import { User } from './user.entity.js';

export class UserModel {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validate(userData) {
    const errors = [];

    if (!userData.username || userData.username.trim().length === 0) {
      errors.push('Username is required');
    }

    if (userData.username && userData.username.length < 3) {
      errors.push('Username must be at least 3 characters');
    }

    if (!userData.email || !this.validateEmail(userData.email)) {
      errors.push('Valid email is required');
    }

    if (!userData.password || userData.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    if (!userData.name || userData.name.trim().length === 0) {
      errors.push('Name is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static create(userData) {
    const validation = this.validate(userData);
    
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    return User.create(userData);
  }
}
