import { Group } from './group.entity.js';

export class GroupModel {
  static validate(groupData) {
    const errors = [];

    if (!groupData.name || groupData.name.trim().length === 0) {
      errors.push('Group name is required');
    }

    if (groupData.name && groupData.name.length > 100) {
      errors.push('Group name must be less than 100 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static create(groupData) {
    const validation = this.validate(groupData);
    
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    return Group.create(groupData);
  }
}
