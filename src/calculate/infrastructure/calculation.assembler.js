import { CalculationEntity } from '../domain/model/calculation.entity.js'

/**
 * 🔄 CALCULATION ASSEMBLER
 * Transforms between API responses and domain entities
 *
 * @infrastructure Calculate Bounded Context
 */
export class CalculationAssembler {
  /**
   * Convert API resource to entity
   */
  static toEntityFromResource(resource) {
    console.log('🔄 Converting resource to entity...')
    return new CalculationEntity({
      id: resource.id,
      groupId: resource.groupId,
      restaurantId: resource.restaurantId,
      restaurantName: resource.restaurantName,
      groupMembers: resource.groupMembers || [],
      centerPoint: resource.centerPoint,
      distance: resource.distance,
      averageDistance: resource.averageDistance,
      maxSpread: resource.maxSpread,
      viabilityScore: resource.viabilityScore,
      membersByDistance: resource.membersByDistance || [],
      timestamp: resource.timestamp,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt
    })
  }

  /**
   * Convert array of resources to entities
   */
  static toEntitiesFromResponse(resources) {
    console.log('🔄 Converting resources array to entities...')
    if (!Array.isArray(resources)) return []
    return resources.map(r => this.toEntityFromResource(r))
  }

  /**
   * Convert entity to API resource (DTO)
   */
  static toResourceFromEntity(entity) {
    console.log('🔄 Converting entity to resource...')
    return {
      id: entity.id,
      groupId: entity.groupId,
      restaurantId: entity.restaurantId,
      restaurantName: entity.restaurantName,
      groupMembers: entity.groupMembers,
      centerPoint: entity.centerPoint,
      distance: entity.distance,
      averageDistance: entity.averageDistance,
      maxSpread: entity.maxSpread,
      viabilityScore: entity.viabilityScore,
      membersByDistance: entity.membersByDistance,
      timestamp: entity.timestamp,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    }
  }

  /**
   * Convert plain data to entity
   */
  static toDtoFromData(data) {
    console.log('🔄 Converting data to DTO...')
    return new CalculationEntity({
      id: data.id || null,
      groupId: data.groupId,
      restaurantId: data.restaurantId,
      restaurantName: data.restaurantName,
      groupMembers: data.groupMembers || [],
      centerPoint: data.centerPoint,
      distance: data.distance,
      averageDistance: data.averageDistance,
      maxSpread: data.maxSpread,
      viabilityScore: data.viabilityScore || 0,
      membersByDistance: data.membersByDistance || [],
      timestamp: data.timestamp || new Date().toISOString(),
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString()
    })
  }
}

