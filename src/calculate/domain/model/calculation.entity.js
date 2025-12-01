/**
 * 📐 CALCULATION ENTITY - Domain Layer
 * Represents a distance calculation for a group visiting a restaurant
 *
 * @domain Calculate Bounded Context
 */
export class CalculationEntity {
  constructor(data = {}) {
    this.id = data.id || null
    this.groupId = data.groupId
    this.restaurantId = data.restaurantId
    this.restaurantName = data.restaurantName
    this.groupMembers = data.groupMembers || []
    this.centerPoint = data.centerPoint || null
    this.distance = data.distance || null
    this.averageDistance = data.averageDistance || null
    this.maxSpread = data.maxSpread || null
    this.viabilityScore = data.viabilityScore || 0
    this.membersByDistance = data.membersByDistance || []
    this.timestamp = data.timestamp || new Date().toISOString()
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
  }

  /**
   * Validate calculation data
   */
  validate() {
    const errors = []

    if (!this.groupId) errors.push('Group ID is required')
    if (!this.restaurantId) errors.push('Restaurant ID is required')
    if (!this.groupMembers || this.groupMembers.length === 0) {
      errors.push('Group must have at least one member')
    }
    if (this.groupMembers && this.groupMembers.length > 8) {
      errors.push('Maximum 8 members allowed')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Convert to API format
   */
  toJSON() {
    return {
      id: this.id,
      groupId: this.groupId,
      restaurantId: this.restaurantId,
      restaurantName: this.restaurantName,
      groupMembers: this.groupMembers,
      centerPoint: this.centerPoint,
      distance: this.distance,
      averageDistance: this.averageDistance,
      maxSpread: this.maxSpread,
      viabilityScore: this.viabilityScore,
      membersByDistance: this.membersByDistance,
      timestamp: this.timestamp,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}

