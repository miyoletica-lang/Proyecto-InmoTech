import apiClient from './api.service';

class NotificacionService {
  async getNotificaciones(filters = {}) {
    const params = new URLSearchParams();

    if (filters.idRol) params.append('idRol', filters.idRol);
    if (filters.idPersona) params.append('idPersona', filters.idPersona);

    const response = await apiClient.get(`/notificaciones?${params.toString()}`);
    return response.data;
  }

  async marcarLeida(id) {
    const response = await apiClient.patch(`/notificaciones/${id}/leer`);
    return response.data;
  }

  async getContadorNoLeidas(idPersona = null, idRol = null) {
    const params = new URLSearchParams();

    if (idPersona) params.append('idPersona', idPersona);
    if (idRol) params.append('idRol', idRol);

    const response = await apiClient.get(`/notificaciones/contador?${params.toString()}`);
    return response.data;
  }
}

export default new NotificacionService();
