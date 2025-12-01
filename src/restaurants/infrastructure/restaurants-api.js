/**
 * @file restaurants-api.js
 * @description HTTP API communication for restaurants
 * Usa db.json con JSON Server en puerto 3000
 */

import axios from 'axios';
import { RestaurantAssembler } from './restaurant.assembler.js';

// La ruta correcta es sin /api/v1 porque JSON Server sirve directamente
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const restaurantsApi = {
  /**
   * Fetch all restaurants from db.json
   * @returns {Promise<RestaurantEntity[]>}
   */
  async getAll() {
    try {
      console.log('🌐 Solicitando restaurantes de:', `${API_BASE_URL}/restaurants`);
      const response = await axios.get(`${API_BASE_URL}/restaurants`);
      console.log('✅ Respuesta recibida de axios:', response);
      console.log('✅ response.data:', response.data);
      console.log('✅ response.data es array?', Array.isArray(response.data));
      console.log('✅ response.data.length:', response.data ? response.data.length : 'no es array');

      const entities = RestaurantAssembler.fromJsonList(response.data);
      console.log('📡 Restaurantes convertidos a entidades:', entities);
      return entities;
    } catch (error) {
      console.error('❌ Error completo en getAll:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error response:', error.response);
      throw error;
    }
  },

  /**
   * Fetch restaurant by ID from db.json
   * @param {number} id
   * @returns {Promise<RestaurantEntity>}
   */
  async getById(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/restaurants/${id}`);
      return RestaurantAssembler.fromJson(response.data);
    } catch (error) {
      console.error(`❌ Error fetching restaurant ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create new restaurant in db.json
   * @param {RestaurantEntity} restaurant
   * @returns {Promise<RestaurantEntity>}
   */
  async create(restaurant) {
    try {
      const resource = RestaurantAssembler.toResource(restaurant);
      const response = await axios.post(`${API_BASE_URL}/restaurants`, resource.toJson());
      console.log('✅ Restaurant created in db.json:', response.data);
      return RestaurantAssembler.fromJson(response.data);
    } catch (error) {
      console.error('❌ Error creating restaurant:', error);
      throw error;
    }
  },

  /**
   * Update restaurant in db.json
   * @param {number} id
   * @param {RestaurantEntity} restaurant
   * @returns {Promise<RestaurantEntity>}
   */
  async update(id, restaurant) {
    try {
      const resource = RestaurantAssembler.toResource(restaurant);
      const response = await axios.put(`${API_BASE_URL}/restaurants/${id}`, resource.toJson());
      console.log('✅ Restaurant updated in db.json:', response.data);
      return RestaurantAssembler.fromJson(response.data);
    } catch (error) {
      console.error(`❌ Error updating restaurant ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete restaurant from db.json
   * @param {number} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await axios.delete(`${API_BASE_URL}/restaurants/${id}`);
      console.log(`✅ Restaurant ${id} deleted from db.json`);
    } catch (error) {
      console.error(`❌ Error deleting restaurant ${id}:`, error);
      throw error;
    }
  }
};

export default restaurantsApi;
