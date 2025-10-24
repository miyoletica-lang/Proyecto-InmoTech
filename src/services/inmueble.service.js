import apiClient from './api.service';

class InmuebleService {
  async createInmueble(inmuebleData) {
    const response = await apiClient.post('/inmuebles', inmuebleData);
    return response.data;
  }

  async getInmuebles(filters = {}) {
    const params = new URLSearchParams();

    if (filters.ciudad) params.append('ciudad', filters.ciudad);
    if (filters.precioMin) params.append('precioMin', filters.precioMin);
    if (filters.precioMax) params.append('precioMax', filters.precioMax);
    if (filters.areaMin) params.append('areaMin', filters.areaMin);
    if (filters.areaMax) params.append('areaMax', filters.areaMax);
    if (filters.categoria) params.append('categoria', filters.categoria);
    if (filters.estado) params.append('estado', filters.estado);

    const response = await apiClient.get(`/inmuebles?${params.toString()}`);
    return response.data;
  }

  async getInmuebleById(id) {
    const response = await apiClient.get(`/inmuebles/${id}`);
    return response.data;
  }

  async updateInmueble(id, inmuebleData) {
    const response = await apiClient.patch(`/inmuebles/${id}`, inmuebleData);
    return response.data;
  }

  async getDisponibilidad(id, fecha) {
    const response = await apiClient.get(`/inmuebles/${id}/disponibilidad`, {
      params: { fecha },
    });
    return response.data;
  }
}

export default new InmuebleService();
