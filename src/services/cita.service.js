import apiClient from './api.service';

class CitaService {
  async createCita(citaData) {
    const response = await apiClient.post('/citas', citaData);
    return response.data;
  }

  async getCitas(filters = {}) {
    const params = new URLSearchParams();

    if (filters.estado) params.append('estado', filters.estado);
    if (filters.fecha) params.append('fecha', filters.fecha);
    if (filters.agente) params.append('agente', filters.agente);

    const response = await apiClient.get(`/citas?${params.toString()}`);
    return response.data;
  }

  async getCitaById(id) {
    const response = await apiClient.get(`/citas/${id}`);
    return response.data;
  }

  async confirmarCita(id, agenteId = null) {
    const response = await apiClient.post(`/citas/${id}/confirmar`, {
      id_agente_asignado: agenteId,
    });
    return response.data;
  }

  async cancelarCita(id, motivoCancelacion) {
    const response = await apiClient.post(`/citas/${id}/cancelar`, {
      motivo_cancelacion: motivoCancelacion,
    });
    return response.data;
  }

  async reagendarCita(id, nuevaFecha, horaInicio, horaFin, observaciones = '') {
    const response = await apiClient.post(`/citas/${id}/reagendar`, {
      fecha_cita: nuevaFecha,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      observaciones,
    });
    return response.data;
  }

  async completarCita(id) {
    const response = await apiClient.post(`/citas/${id}/completar`);
    return response.data;
  }

  async buscarPersona(tipoDocumento, numeroDocumento) {
    const response = await apiClient.get('/citas/buscar-persona', {
      params: {
        tipo_documento: tipoDocumento,
        numero_documento: numeroDocumento,
      },
    });
    return response.data;
  }
}

export default new CitaService();
