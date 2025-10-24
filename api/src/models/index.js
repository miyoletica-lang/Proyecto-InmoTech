const Persona = require('./Persona');
const Acceso = require('./Acceso');
const Rol = require('./Rol');
const PersonaRol = require('./PersonaRol');
const Inmueble = require('./Inmueble');
const PropiedadInmueble = require('./PropiedadInmueble');
const ServicioCita = require('./ServicioCita');
const EstadoCita = require('./EstadoCita');
const Cita = require('./Cita');
const Notificacion = require('./Notificacion');
const Reporte = require('./Reporte');

Persona.hasOne(Acceso, { foreignKey: 'id_persona', as: 'acceso' });
Acceso.belongsTo(Persona, { foreignKey: 'id_persona', as: 'persona' });

Persona.belongsToMany(Rol, {
  through: PersonaRol,
  foreignKey: 'id_persona',
  otherKey: 'id_rol',
  as: 'roles',
});
Rol.belongsToMany(Persona, {
  through: PersonaRol,
  foreignKey: 'id_rol',
  otherKey: 'id_persona',
  as: 'personas',
});

PersonaRol.belongsTo(Persona, { foreignKey: 'id_persona', as: 'persona' });
PersonaRol.belongsTo(Rol, { foreignKey: 'id_rol', as: 'rol' });

Inmueble.hasMany(PropiedadInmueble, { foreignKey: 'id_inmueble', as: 'propietarios' });
PropiedadInmueble.belongsTo(Inmueble, { foreignKey: 'id_inmueble', as: 'inmueble' });
PropiedadInmueble.belongsTo(Persona, { foreignKey: 'id_persona', as: 'persona' });

Cita.belongsTo(Persona, { foreignKey: 'id_persona', as: 'cliente' });
Cita.belongsTo(Inmueble, { foreignKey: 'id_inmueble', as: 'inmueble' });
Cita.belongsTo(ServicioCita, { foreignKey: 'id_servicio', as: 'servicio' });
Cita.belongsTo(EstadoCita, { foreignKey: 'id_estado_cita', as: 'estado' });
Cita.belongsTo(Persona, { foreignKey: 'id_agente_asignado', as: 'agente' });
Cita.belongsTo(Persona, { foreignKey: 'id_usuario_creador', as: 'creador' });

Notificacion.belongsTo(Cita, { foreignKey: 'id_cita', as: 'cita' });
Notificacion.belongsTo(Rol, { foreignKey: 'id_rol_destino', as: 'rol_destino' });
Notificacion.belongsTo(Persona, { foreignKey: 'id_persona_destino', as: 'persona_destino' });

Reporte.belongsTo(Inmueble, { foreignKey: 'id_inmueble', as: 'inmueble' });
Reporte.belongsTo(Persona, { foreignKey: 'id_persona_reporta', as: 'persona_reporta' });

module.exports = {
  Persona,
  Acceso,
  Rol,
  PersonaRol,
  Inmueble,
  PropiedadInmueble,
  ServicioCita,
  EstadoCita,
  Cita,
  Notificacion,
  Reporte,
};
