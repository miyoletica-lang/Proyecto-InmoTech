import apiClient from './api.service';

class ReporteService {
  async createReporte(reporteData) {
    const response = await apiClient.post('/reportes', reporteData);
    return response.data;
  }

  async getReportes(filters = {}) {
    const params = new URLSearchParams();

    if (filters.estado) params.append('estado', filters.estado);
    if (filters.prioridad) params.append('prioridad', filters.prioridad);
    if (filters.tipo_reporte) params.append('tipo_reporte', filters.tipo_reporte);

    const response = await apiClient.get(`/reportes?${params.toString()}`);
    return response.data;
  }

  async getReporteById(id) {
    const response = await apiClient.get(`/reportes/${id}`);
    return response.data;
  }

  async updateReporte(id, reporteData) {
    const response = await apiClient.patch(`/reportes/${id}`, reporteData);
    return response.data;
  }
}

export default new ReporteService();
