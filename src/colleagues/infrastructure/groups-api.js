import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export class GroupsApi {
  static async getAll() {
    const response = await axios.get(`${API_URL}/groups`);
    return response.data;
  }

  static async getById(id) {
    const response = await axios.get(`${API_URL}/groups/${id}`);
    return response.data;
  }

  static async create(groupData) {
    const response = await axios.post(`${API_URL}/groups`, groupData);
    return response.data;
  }

  static async update(id, groupData) {
    const response = await axios.put(`${API_URL}/groups/${id}`, groupData);
    return response.data;
  }

  static async delete(id) {
    await axios.delete(`${API_URL}/groups/${id}`);
  }
}
