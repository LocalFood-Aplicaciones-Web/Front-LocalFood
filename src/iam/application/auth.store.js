import { defineStore } from 'pinia';
import { AuthApi } from '../infrastructure/auth-api.js';
import { UserAssembler } from '../infrastructure/user.assembler.js';
import { UserModel } from '../domain/model/user.model.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const userData = await AuthApi.login(email, password);
        this.user = UserAssembler.toDomain(userData);
        
        // Generate a simple token (in production use JWT)
        this.token = btoa(`${email}:${Date.now()}`);
        localStorage.setItem('token', this.token);
        localStorage.setItem('userId', userData.id);
        
        return this.user;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      this.loading = true;
      this.error = null;
      try {
        const user = UserModel.create(userData);
        const resource = UserAssembler.toResource(user);
        const created = await AuthApi.register(resource);
        
        // Auto login after registration
        await this.login(created.email, created.password);
        
        return this.user;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async loadUser() {
      const userId = localStorage.getItem('userId');
      if (!userId || !this.token) return;

      try {
        const userData = await AuthApi.getUserById(userId);
        this.user = UserAssembler.toDomain(userData);
      } catch (error) {
        this.logout();
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
  }
});
