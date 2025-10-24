import apiClient from './api.service';

class AuthService {
  async register(userData) {
    const response = await apiClient.post('/auth/register', userData);

    if (response.data.success) {
      const { user, accessToken, refreshToken } = response.data.data;
      this.setAuthData(user, accessToken, refreshToken);
    }

    return response.data;
  }

  async login(correo, password) {
    const response = await apiClient.post('/auth/login', { correo, password });

    if (response.data.success) {
      const { user, accessToken, refreshToken } = response.data.data;
      this.setAuthData(user, accessToken, refreshToken);
    }

    return response.data;
  }

  async logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  async getMe() {
    const response = await apiClient.get('/auth/me');

    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }

    return response.data;
  }

  setAuthData(user, accessToken, refreshToken) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  }

  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) || false;
  }

  hasAnyRole(roles) {
    const user = this.getCurrentUser();
    return roles.some(role => user?.roles?.includes(role)) || false;
  }
}

export default new AuthService();
