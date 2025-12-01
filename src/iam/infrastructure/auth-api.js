import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export class AuthApi {
  static async login(email, password) {
    const response = await axios.get(`${API_URL}/users`, {
      params: { email, password }
    });
    
    if (response.data.length === 0) {
      throw new Error('Invalid credentials');
    }

    return response.data[0];
  }

  static async register(userData) {
    // Check if email already exists
    const existingUsers = await axios.get(`${API_URL}/users`, {
      params: { email: userData.email }
    });

    if (existingUsers.data.length > 0) {
      throw new Error('Email already registered');
    }

    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  }

  static async getUserById(id) {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  }
}
