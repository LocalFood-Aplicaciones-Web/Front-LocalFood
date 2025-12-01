import { BaseApi } from '../../Shared/infrastructure/base-api.js'

/**
 * 📡 CALCULATIONS API - HTTP Client
 * Handles API calls for calculations (fake API via json-server)
 *
 * @infrastructure Calculate Bounded Context
 */
export class CalculationsApi extends BaseApi {
  constructor() {
    super('/calculations')
  }

  /**
   * Get all calculations
   */
  async getAllCalculations() {
    console.log('📡 Fetching all calculations...')
    try {
      const response = await this.get('')
      console.log('✅ Calculations fetched:', response.length)
      return response
    } catch (error) {
      console.error('❌ Error fetching calculations:', error)
      throw error
    }
  }

  /**
   * Get calculation by ID
   */
  async getCalculationById(id) {
    console.log('📡 Fetching calculation:', id)
    try {
      const response = await this.get(`/${id}`)
      console.log('✅ Calculation fetched')
      return response
    } catch (error) {
      console.error('❌ Error fetching calculation:', error)
      throw error
    }
  }

  /**
   * Get calculations by group ID
   */
  async getCalculationsByGroupId(groupId) {
    console.log('📡 Fetching calculations for group:', groupId)
    try {
      const response = await this.get(`?groupId=${groupId}`)
      console.log('✅ Group calculations fetched')
      return response
    } catch (error) {
      console.error('❌ Error fetching group calculations:', error)
      throw error
    }
  }

  /**
   * Create new calculation
   */
  async createCalculation(data) {
    console.log('📡 Creating calculation...')
    try {
      const response = await this.post('', data)
      console.log('✅ Calculation created')
      return response
    } catch (error) {
      console.error('❌ Error creating calculation:', error)
      throw error
    }
  }

  /**
   * Update calculation
   */
  async updateCalculation(id, data) {
    console.log('📡 Updating calculation:', id)
    try {
      const response = await this.put(`/${id}`, data)
      console.log('✅ Calculation updated')
      return response
    } catch (error) {
      console.error('❌ Error updating calculation:', error)
      throw error
    }
  }

  /**
   * Delete calculation
   */
  async deleteCalculation(id) {
    console.log('📡 Deleting calculation:', id)
    try {
      await this.delete(`/${id}`)
      console.log('✅ Calculation deleted')
    } catch (error) {
      console.error('❌ Error deleting calculation:', error)
      throw error
    }
  }
}

// Create singleton instance
export const calculationsApi = new CalculationsApi()

