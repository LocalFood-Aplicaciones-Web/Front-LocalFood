/**
 * 🧮 CALCULATION MODEL - Domain Business Logic
 * Pure functions for distance calculations using Haversine formula
 *
 * @domain Calculate Bounded Context
 */
export class CalculationModel {
  static EARTH_RADIUS_KM = 6371

  /**
   * Convert degrees to radians
   */
  static toRadians(degrees) {
    return (degrees * Math.PI) / 180
  }

  /**
   * Calculate distance between two points using Haversine formula
   * @param {Object} point1 - { lat, lng }
   * @param {Object} point2 - { lat, lng }
   * @returns {number} Distance in km
   */
  static calculateHaversineDistance(point1, point2) {
    const lat1 = this.toRadians(point1.lat)
    const lat2 = this.toRadians(point2.lat)
    const deltaLat = this.toRadians(point2.lat - point1.lat)
    const deltaLng = this.toRadians(point2.lng - point1.lng)

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLng / 2) *
        Math.sin(deltaLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return this.EARTH_RADIUS_KM * c
  }

  /**
   * Calculate center point (average) from members' coordinates
   */
  static calculateGroupCenter(members) {
    console.log('📍 Calculating group center...')

    if (!members || members.length === 0) return null

    const totalLat = members.reduce((sum, m) => sum + (m.address?.latitude || 0), 0)
    const totalLng = members.reduce((sum, m) => sum + (m.address?.longitude || 0), 0)

    return {
      lat: totalLat / members.length,
      lng: totalLng / members.length
    }
  }

  /**
   * Calculate distance from group center to restaurant
   */
  static calculateDistanceToRestaurant(members, restaurant) {
    console.log('🧮 Calculating distance to restaurant:', restaurant.name)

    const centerPoint = this.calculateGroupCenter(members)
    if (!centerPoint || !restaurant.address) return null

    const restaurantPoint = {
      lat: restaurant.address.latitude,
      lng: restaurant.address.longitude
    }

    return this.calculateHaversineDistance(centerPoint, restaurantPoint)
  }

  /**
   * Calculate average distance from all members to restaurant
   */
  static calculateAverageDistance(members, restaurant) {
    console.log('🧮 Calculating average distance...')

    if (!members || members.length === 0 || !restaurant.address) return 0

    const restaurantPoint = {
      lat: restaurant.address.latitude,
      lng: restaurant.address.longitude
    }

    const totalDistance = members.reduce((sum, member) => {
      if (!member.address) return sum
      return (
        sum +
        this.calculateHaversineDistance(
          { lat: member.address.latitude, lng: member.address.longitude },
          restaurantPoint
        )
      )
    }, 0)

    return totalDistance / members.length
  }

  /**
   * Sort members by distance to restaurant
   */
  static sortMembersByDistance(members, restaurant) {
    console.log('👥 Sorting members by distance...')

    if (!members || !restaurant.address) return members

    const restaurantPoint = {
      lat: restaurant.address.latitude,
      lng: restaurant.address.longitude
    }

    return members
      .map(member => ({
        ...member,
        distance: member.address
          ? this.calculateHaversineDistance(
              { lat: member.address.latitude, lng: member.address.longitude },
              restaurantPoint
            )
          : null
      }))
      .sort((a, b) => (a.distance || 999) - (b.distance || 999))
  }

  /**
   * Calculate maximum spread (dispersion) of group
   */
  static calculateMaxSpread(members) {
    console.log('📏 Calculating max spread...')

    if (!members || members.length < 2) return 0

    let maxDistance = 0

    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        if (members[i].address && members[j].address) {
          const distance = this.calculateHaversineDistance(
            { lat: members[i].address.latitude, lng: members[i].address.longitude },
            { lat: members[j].address.latitude, lng: members[j].address.longitude }
          )
          if (distance > maxDistance) maxDistance = distance
        }
      }
    }

    return maxDistance
  }

  /**
   * Calculate viability score (0-100)
   * Factors:
   * - Distance penalty (closer = better)
   * - Group size bonus (larger = better)
   * - Spread penalty (less spread = better)
   */
  static calculateViabilityScore(calculation) {
    console.log('📊 Calculating viability score...')

    let score = 100

    // Distance penalty: up to 40 points
    if (calculation.averageDistance) {
      const distancePenalty = Math.min(calculation.averageDistance * 2, 40)
      score -= distancePenalty
    }

    // Group size bonus: +10 points for 5+ members
    if (calculation.groupMembers && calculation.groupMembers.length >= 5) {
      score += 10
    }

    // Spread penalty: up to 20 points
    if (calculation.maxSpread) {
      const spreadPenalty = Math.min(calculation.maxSpread / 10, 20)
      score -= spreadPenalty
    }

    // Ensure score is 0-100
    score = Math.max(0, Math.min(100, score))

    console.log('✅ Viability score:', Math.round(score))
    return Math.round(score)
  }
}

