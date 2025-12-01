/**
 * @file restaurant.assembler.js
 * @description Converts between RestaurantResource (DTO) and RestaurantEntity (Domain)
 */

import { RestaurantEntity } from '../domain/model/restaurant.entity.js';
import { RestaurantResource } from './restaurant.resource.js';

export class RestaurantAssembler {
  /**
   * Converts RestaurantResource (API DTO) to RestaurantEntity (Domain)
   * @param {RestaurantResource} resource
   * @returns {RestaurantEntity}
   */
  static toDomain(resource) {
    return new RestaurantEntity({
      id: resource.id,
      name: resource.name,
      cuisine: resource.cuisine,
      rating: resource.rating,
      priceRange: resource.priceRange,
      address: resource.address,
      phone: resource.phone,
      openHours: resource.openHours,
      userId: resource.userId
    });
  }

  /**
   * Converts RestaurantEntity (Domain) to RestaurantResource (API DTO)
   * @param {RestaurantEntity} entity
   * @returns {RestaurantResource}
   */
  static toResource(entity) {
    return new RestaurantResource({
      id: entity.id,
      name: entity.name,
      cuisine: entity.cuisine,
      rating: entity.rating,
      priceRange: entity.priceRange,
      address: entity.address,
      phone: entity.phone,
      openHours: entity.openHours,
      userId: entity.userId
    });
  }

  /**
   * Converts array of RestaurantResources to RestaurantEntities
   * @param {RestaurantResource[]} resources
   * @returns {RestaurantEntity[]}
   */
  static toDomainList(resources) {
    return resources.map(resource => this.toDomain(resource));
  }

  /**
   * Converts array of RestaurantEntities to RestaurantResources
   * @param {RestaurantEntity[]} entities
   * @returns {RestaurantResource[]}
   */
  static toResourceList(entities) {
    return entities.map(entity => this.toResource(entity));
  }

  /**
   * Converts plain JSON object to RestaurantEntity
   * @param {object} json
   * @returns {RestaurantEntity}
   */
  static fromJson(json) {
    const resource = RestaurantResource.fromJson(json);
    return this.toDomain(resource);
  }

  /**
   * Converts plain JSON array to RestaurantEntity array
   * @param {object[]} jsonArray
   * @returns {object[]}
   */
  static fromJsonList(jsonArray) {
    console.log('🔄 fromJsonList recibido:', jsonArray);
    console.log('🔄 Es array?:', Array.isArray(jsonArray));
    console.log('🔄 Cantidad de items:', jsonArray?.length);

    // Retornar los objetos directamente sin conversión compleja
    // Simplificar: los datos ya tienen la estructura correcta del JSON
    const result = jsonArray.map((json, index) => {
      console.log(`📦 Item ${index}:`, json);
      return {
        id: json.id,
        name: json.name,
        cuisine: json.cuisine,
        rating: json.rating,
        priceRange: json.priceRange,
        address: json.address,
        phone: json.phone,
        openHours: json.openHours,
        userId: json.userId
      };
    });

    console.log('✅ Objetos convertidos:', result);
    console.log('✅ Cantidad total:', result.length);
    return result;
  }
}
