const bcrypt = require('bcryptjs');
const { Persona, Acceso, Rol, PersonaRol } = require('../models');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { formatPhoneNumber, parseFullName, buildFullName } = require('../utils/helpers');
const { sequelize } = require('../config/database');
const logger = require('../utils/logger');

class AuthService {
  async register(data) {
    const transaction = await sequelize.transaction();

    try {
      const { nombre, correo, telefono, password } = data;

      const existingUser = await Persona.findOne({
        where: { correo },
      });

      if (existingUser) {
        throw { statusCode: 409, message: 'El correo ya está registrado' };
      }

      const nameParts = parseFullName(nombre);
      const formattedPhone = formatPhoneNumber(telefono);

      const hashedPassword = await bcrypt.hash(password, 10);

      const persona = await Persona.create(
        {
          tipo_documento: 'CC',
          numero_documento: Date.now().toString(),
          primer_nombre: nameParts.primer_nombre,
          segundo_nombre: nameParts.segundo_nombre || null,
          primer_apellido: nameParts.primer_apellido,
          segundo_apellido: nameParts.segundo_apellido || null,
          correo,
          telefono: formattedPhone,
          tiene_cuenta: true,
          estado: true,
        },
        { transaction }
      );

      await Acceso.create(
        {
          id_persona: persona.id_persona,
          contrasena: hashedPassword,
        },
        { transaction }
      );

      const rolUsuario = await Rol.findOne({
        where: { nombre_rol: 'Usuario' },
      });

      if (!rolUsuario) {
        throw { statusCode: 500, message: 'Rol Usuario no encontrado' };
      }

      await PersonaRol.create(
        {
          id_persona: persona.id_persona,
          id_rol: rolUsuario.id_rol,
          estado: true,
        },
        { transaction }
      );

      await transaction.commit();

      const payload = {
        id_persona: persona.id_persona,
        correo: persona.correo,
        nombre: buildFullName(persona),
        roles: ['Usuario'],
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      logger.info(`Usuario registrado exitosamente: ${correo}`);

      return {
        user: {
          id_persona: persona.id_persona,
          nombre: buildFullName(persona),
          correo: persona.correo,
          telefono: persona.telefono,
          roles: ['Usuario'],
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      await transaction.rollback();
      logger.error('Error en registro:', error);
      throw error;
    }
  }

  async login(correo, password) {
    try {
      const persona = await Persona.findOne({
        where: { correo, estado: true },
        include: [
          {
            model: Acceso,
            as: 'acceso',
            required: true,
          },
          {
            model: Rol,
            as: 'roles',
            through: {
              where: { estado: true },
              attributes: [],
            },
          },
        ],
      });

      if (!persona) {
        throw { statusCode: 401, message: 'Credenciales inválidas' };
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        persona.acceso.contrasena
      );

      if (!isPasswordValid) {
        throw { statusCode: 401, message: 'Credenciales inválidas' };
      }

      await Acceso.update(
        { ultimo_acceso: new Date() },
        { where: { id_persona: persona.id_persona } }
      );

      const roles = persona.roles.map((rol) => rol.nombre_rol);

      const payload = {
        id_persona: persona.id_persona,
        correo: persona.correo,
        nombre: buildFullName(persona),
        roles,
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      logger.info(`Usuario autenticado: ${correo}`);

      return {
        user: {
          id_persona: persona.id_persona,
          nombre: buildFullName(persona),
          correo: persona.correo,
          telefono: persona.telefono,
          roles,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      logger.error('Error en login:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      const persona = await Persona.findOne({
        where: { id_persona: decoded.id_persona, estado: true },
        include: [
          {
            model: Rol,
            as: 'roles',
            through: {
              where: { estado: true },
              attributes: [],
            },
          },
        ],
      });

      if (!persona) {
        throw { statusCode: 401, message: 'Usuario no encontrado' };
      }

      const roles = persona.roles.map((rol) => rol.nombre_rol);

      const payload = {
        id_persona: persona.id_persona,
        correo: persona.correo,
        nombre: buildFullName(persona),
        roles,
      };

      const newAccessToken = generateAccessToken(payload);

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      logger.error('Error al renovar token:', error);
      throw { statusCode: 401, message: 'Token inválido o expirado' };
    }
  }

  async getMe(idPersona) {
    try {
      const persona = await Persona.findOne({
        where: { id_persona: idPersona, estado: true },
        include: [
          {
            model: Rol,
            as: 'roles',
            through: {
              where: { estado: true },
              attributes: [],
            },
          },
        ],
      });

      if (!persona) {
        throw { statusCode: 404, message: 'Usuario no encontrado' };
      }

      const roles = persona.roles.map((rol) => rol.nombre_rol);

      return {
        id_persona: persona.id_persona,
        tipo_documento: persona.tipo_documento,
        numero_documento: persona.numero_documento,
        nombre: buildFullName(persona),
        primer_nombre: persona.primer_nombre,
        segundo_nombre: persona.segundo_nombre,
        primer_apellido: persona.primer_apellido,
        segundo_apellido: persona.segundo_apellido,
        correo: persona.correo,
        telefono: persona.telefono,
        roles,
      };
    } catch (error) {
      logger.error('Error al obtener perfil:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();
