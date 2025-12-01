import { User } from '../domain/model/user.entity.js';

export class UserAssembler {
  static toDomain(resource) {
    return new User({
      id: resource.id,
      username: resource.username,
      email: resource.email,
      password: resource.password,
      role: resource.role || 'user',
      name: resource.name
    });
  }

  static toResource(entity) {
    return {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      password: entity.password,
      role: entity.role,
      name: entity.name
    };
  }

  static toEntityFromResource(resource) {
    return this.toDomain(resource);
  }

  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status}, ${response.statusText}`);
      return [];
    }
    let resources = response.data instanceof Array ? response.data : response.data['users'];
    return resources.map(resource => this.toEntityFromResource(resource));
  }
}