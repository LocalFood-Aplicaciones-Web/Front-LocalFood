import { Group } from '../domain/model/group.entity.js';

export class GroupAssembler {
  static toDomain(resource) {
    return new Group({
      id: resource.id,
      name: resource.name,
      description: resource.description,
      color: resource.color,
      favoriteRestaurants: resource.favoriteRestaurants || [],
      userId: resource.userId
    });
  }

  static toResource(entity) {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      color: entity.color,
      favoriteRestaurants: entity.favoriteRestaurants,
      userId: entity.userId
    };
  }
}
