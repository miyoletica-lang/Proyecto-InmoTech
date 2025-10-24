const { Persona, Rol } = require('../models');
const { formatPhoneNumber } = require('../utils/helpers');
const logger = require('../utils/logger');

class PersonaService {
  async getProfile(idPersona) {
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
        throw { statusCode: 404, message: 'Persona no encontrada' };
      }

      return persona;
    } catch (error) {
      logger.error('Error al obtener perfil:', error);
      throw error;
    }
  }

  async updateProfile(idPersona, data) {
    try {
      const persona = await Persona.findByPk(idPersona);

      if (!persona) {
        throw { statusCode: 404, message: 'Persona no encontrada' };
      }

      if (data.telefono) {
        data.telefono = formatPhoneNumber(data.telefono);
      }

      await persona.update(data);

      logger.info(`Perfil actualizado: persona ${idPersona}`);

      return await this.getProfile(idPersona);
    } catch (error) {
      logger.error('Error al actualizar perfil:', error);
      throw error;
    }
  }

  async buscarPersona(tipoDocumento, numeroDocumento) {
    try {
      const persona = await Persona.findOne({
        where: {
          tipo_documento: tipoDocumento,
          numero_documento: numeroDocumento,
        },
      });

      return persona;
    } catch (error) {
      logger.error('Error al buscar persona:', error);
      throw error;
    }
  }
}

module.exports = new PersonaService();
