import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CalculationEntity } from '../domain/model/calculation.entity.js'
import { CalculationModel } from '../domain/model/calculation.model.js'
import { CalculationsApi } from '../infrastructure/calculations-api.js'

/**
 * 📐 CALCULATE STORE - Pinia State Management
 * Vue 3 Composition API + DDD Architecture
 * Manages distance calculations and restaurant recommendations
 */
const calculationsApi = new CalculationsApi()

export const useCalculateStore = defineStore('calculate', () => {
  // ═══════════════════════════════════════════════════════════════════════════════
  // 🔴 REACTIVE STATE (ref)
  // ═══════════════════════════════════════════════════════════════════════════════

  const selectedGroup = ref(null)
  const groupMembers = ref([])
  const selectedRestaurant = ref(null)
  const nearestRestaurants = ref([])
  const calculationResults = ref(null)
  const calculations = ref([])
  const isLoading = ref(false)
  const errors = ref([])

  // 🎯 DIALOG STATE
  const showAddMembersDialog = ref(false)
  const showSelectRestaurantDialog = ref(false)
  const restaurantSearchQuery = ref('')
  const selectedCuisine = ref(null)

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🧮 COMPUTED PROPERTIES
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Check if calculation is valid
   */
  const hasValidCalculation = computed(() => {
    return (
      selectedGroup.value &&
      groupMembers.value.length > 0 &&
      selectedRestaurant.value
    )
  })

  /**
   * Check if current user is group leader
   */
  const isCurrentUserLeader = computed(() => {
    const userId = parseInt(localStorage.getItem('userId')) || 0
    return groupMembers.value.some(m => m.isLeader && m.userId == userId)
  })

  /**
   * Get current user ID
   */
  function getCurrentUserId() {
    return parseInt(localStorage.getItem('userId')) || 0
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 📍 INITIALIZATION METHODS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Initialize calculation with group and members
   */
  function initializeCalculation(group, members = []) {
    console.log('📐 Initializing calculation with group:', group.name)
    selectedGroup.value = group
    groupMembers.value = members
    selectedRestaurant.value = null
    calculationResults.value = null
  }

  /**
   * Clear current calculation
   */
  function clearCalculation() {
    console.log('🔄 Clearing calculation')
    selectedGroup.value = null
    groupMembers.value = []
    selectedRestaurant.value = null
    calculationResults.value = null
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🍽️ RESTAURANT METHODS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Set selected restaurant
   */
  function setSelectedRestaurant(restaurant) {
    console.log('🍽️ Restaurant selected:', restaurant.name)
    selectedRestaurant.value = restaurant
  }

  /**
   * Load nearest restaurants using Google Maps API
   */
  async function loadNearestRestaurants() {
    console.log('📡 Loading nearest restaurants from Google Maps API...')
    isLoading.value = true

    try {
      // Calculate group center
      const centerPoint = CalculationModel.calculateGroupCenter(groupMembers.value)
      if (!centerPoint) return

      // TODO: Call Google Maps API to get restaurants
      // For now, using mock data from fake API
      const mockRestaurants = [
        {
          id: 1,
          name: 'KFC - San Isidro',
          cuisine: 'Comida Rápida',
          rating: 4.5,
          address: {
            street: 'Av. Paseo de la República 5150',
            city: 'Lima',
            latitude: -12.0904,
            longitude: -77.0396
          },
          photo: 'https://via.placeholder.com/400x300?text=KFC+San+Isidro',
          distance: 2.5
        },
        {
          id: 2,
          name: 'KFC - Miraflores',
          cuisine: 'Comida Rápida',
          rating: 4.7,
          address: {
            street: 'Av. Larco 1028',
            city: 'Lima',
            latitude: -12.1265,
            longitude: -77.0305
          },
          photo: 'https://via.placeholder.com/400x300?text=KFC+Miraflores',
          distance: 5.2
        },
        {
          id: 3,
          name: 'KFC - Centro Histórico',
          cuisine: 'Comida Rápida',
          rating: 4.3,
          address: {
            street: 'Jr. Lampa 540',
            city: 'Lima',
            latitude: -12.0469,
            longitude: -77.0289
          },
          photo: 'https://via.placeholder.com/400x300?text=KFC+Centro',
          distance: 7.1
        }
      ]

      nearestRestaurants.value = mockRestaurants
      errors.value = []
      console.log('✅ Restaurants loaded')
    } catch (error) {
      console.error('❌ Error loading restaurants:', error)
      errors.value.push(error.message)
    } finally {
      isLoading.value = false
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🧮 CALCULATION METHODS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Calculate distances to selected restaurant
   */
  function calculateDistances() {
    console.log('🧮 Calculating distances...')

    if (!hasValidCalculation.value) {
      console.warn('⚠️ Invalid calculation setup')
      return
    }

    // Calculate group center
    const centerPoint = CalculationModel.calculateGroupCenter(groupMembers.value)

    // Calculate distance from center to restaurant
    const distance = CalculationModel.calculateDistanceToRestaurant(
      groupMembers.value,
      selectedRestaurant.value
    )

    // Calculate average distance
    const averageDistance = CalculationModel.calculateAverageDistance(
      groupMembers.value,
      selectedRestaurant.value
    )

    // Calculate max spread
    const maxSpread = CalculationModel.calculateMaxSpread(groupMembers.value)

    // Get members sorted by distance
    const sortedMembers = CalculationModel.sortMembersByDistance(
      groupMembers.value,
      selectedRestaurant.value
    )

    // Calculate viability score
    const viabilityScore = CalculationModel.calculateViabilityScore({
      groupMembers: groupMembers.value,
      averageDistance,
      maxSpread
    })

    // Store results
    calculationResults.value = {
      groupId: selectedGroup.value.id,
      restaurantId: selectedRestaurant.value.id,
      restaurantName: selectedRestaurant.value.name,
      centerPoint,
      distance,
      averageDistance,
      maxSpread,
      viabilityScore,
      membersByDistance: sortedMembers,
      timestamp: new Date().toISOString()
    }

    console.log('✅ Calculation complete:', calculationResults.value)
    saveCalculation()
  }

  /**
   * Calculate without top 3 filter
   */
  function calculateWithoutTop3() {
    console.log('🧮 Alternative calculation (no top 3)...')
    calculateDistances()
    // Same logic, but could have different business rules
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 👥 MEMBER MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Add members to group
   */
  function addMembersToGroup(memberIds) {
    console.log('👥 Adding members:', memberIds)
    // TODO: Implement member addition (fetch from colleagues store)
  }

  /**
   * Remove member from group
   */
  function removeMember(memberId) {
    console.log('🗑️ Removing member:', memberId)
    console.log('Current members:', groupMembers.value)

    const index = groupMembers.value.findIndex(m => m.id === memberId)
    console.log('Member index found:', index)

    if (index > -1) {
      // Usar asignación en lugar de splice para asegurar reactividad
      groupMembers.value = groupMembers.value.filter(m => m.id !== memberId)
      console.log('✅ Member removed successfully')
      console.log('Remaining members:', groupMembers.value)
      return true
    }

    console.warn('⚠️ Member not found')
    return false
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 💾 PERSISTENCE METHODS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Save calculation to fake API
   */
  async function saveCalculation() {
    console.log('💾 Saving calculation...')
    isLoading.value = true

    try {
      const calculation = new CalculationEntity({
        groupId: selectedGroup.value.id,
        restaurantId: selectedRestaurant.value.id,
        groupMembers: groupMembers.value,
        ...calculationResults.value
      })

      const response = await calculationsApi.createCalculation(calculation)
      calculations.value.push(response)

      console.log('✅ Calculation saved')
      errors.value = []
    } catch (error) {
      console.error('❌ Error saving calculation:', error)
      errors.value.push(error.message)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch calculations from fake API
   */
  async function fetchCalculations() {
    console.log('📡 Fetching calculations...')
    isLoading.value = true

    try {
      const response = await calculationsApi.getAllCalculations()
      calculations.value = response
      console.log('✅ Calculations fetched')
      errors.value = []
    } catch (error) {
      console.error('❌ Error fetching calculations:', error)
      errors.value.push(error.message)
    } finally {
      isLoading.value = false
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // ✅ RETURN STORE
  // ═══════════════════════════════════════════════════════════════════════════════

  return {
    // State
    selectedGroup,
    groupMembers,
    selectedRestaurant,
    nearestRestaurants,
    calculationResults,
    calculations,
    isLoading,
    errors,
    showAddMembersDialog,
    showSelectRestaurantDialog,
    restaurantSearchQuery,
    selectedCuisine,

    // Computed
    hasValidCalculation,
    isCurrentUserLeader,

    // Methods
    initializeCalculation,
    clearCalculation,
    setSelectedRestaurant,
    loadNearestRestaurants,
    calculateDistances,
    calculateWithoutTop3,
    addMembersToGroup,
    removeMember,
    saveCalculation,
    fetchCalculations,
    getCurrentUserId
  }
})

export default useCalculateStore
