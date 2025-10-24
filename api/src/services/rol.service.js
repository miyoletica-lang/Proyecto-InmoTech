const { Rol, PersonaRol, Persona } = require('../models');
const logger = require('../utils/logger');

class RolService {
  async createRol(data) {
    try {
      const rol = await Rol.create(data);

      logger.info(`Rol creado: ${rol.nombre_rol}`);

      return rol;
    } catch (error) {
      logger.error('Error al crear rol:', error);
      throw error;
    }
  }

  async getRoles() {
    try {
      const roles = await Rol.findAll({
        where: { estado: true },
        order: [['nombre_rol', 'ASC']],
      });

      return roles;
    } catch (error) {
      logger.error('Error al obtener roles:', error);
      throw error;
    }
  }

  async asignarRol(idRol, idPersona) {
    try {
      const rol = await Rol.findByPk(idRol);
      if (!rol) {
        throw { statusCode: 404, message: 'Rol no encontrado' };
      }

      const persona = await Persona.findByPk(idPersona);
      if (!persona) {
        throw { statusCode: 404, message: 'Persona no encontrada' };
      }

      const [personaRol, created] = await PersonaRol.findOrCreate({
        where: {
          id_persona: idPersona,
          id_rol: idRol,
        },
        defaults: {
          id_persona: idPersona,
          id_rol: idRol,
          estado: true,
        },
      });

      if (!created && !personaRol.estado) {
        await personaRol.update({ estado: true });
      }

      logger.info(`Rol ${idRol} asignado a persona ${idPersona}`);

      return personaRol;
    } catch (error) {
      logger.error('Error al asignar rol:', error);
      throw error;
    }
  }
}

module.exports = new RolService();
