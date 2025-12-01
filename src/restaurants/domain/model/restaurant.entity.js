/**
 * @file restaurant.entity.js
 * @description Domain entity for Restaurant
 * Represents the core business logic and rules for a restaurant
 */

export class RestaurantEntity {
  constructor({
    id,
    name,
    cuisine,
    rating,
    priceRange,
    address,
    phone,
    openHours,
    userId
  }) {
    this.id = id;
    this.name = name;
    this.cuisine = cuisine;
    this.rating = rating;
    this.priceRange = priceRange;
    this.address = address;
    this.phone = phone;
    this.openHours = openHours;
    this.userId = userId;
  }

  /**
   * Validates if the restaurant has a good quality rating (3-5 stars)
   * @returns {boolean}
   */
  isHighQuality() {
    return this.rating >= 3 && this.rating <= 5;
  }

  /**
   * Gets the full address as a string
   * @returns {string}
   */
  getFullAddress() {
    if (!this.address) return 'No address available';
    return `${this.address.street}, ${this.address.city}`;
  }

  /**
   * Gets the location coordinates
   * @returns {object} { latitude, longitude }
   */
  getCoordinates() {
    if (!this.address) return null;
    return {
      latitude: this.address.latitude,
      longitude: this.address.longitude
    };
  }

  /**
   * Formats price range for display
   * @returns {string}
   */
  getPriceRangeDisplay() {
    const priceMap = {
      '$': 'Budget Friendly',
      '$$': 'Moderate',
      '$$$': 'Premium'
    };
    return priceMap[this.priceRange] || this.priceRange;
  }

  /**
   * Gets cuisine icon emoji
   * @returns {string}
   */
  getCuisineIcon() {
    const iconMap = {
      'Comida Rápida': '🍟',
      'American': '🍔',
      'Argentine': '🥩',
      'Chinese': '🥡',
      'Italian': '🍝',
      'Japanese': '🍣',
      'Mexican': '🌮',
      'Peruvian': '🍗',
      'Seafood': '🍤',
      'Thai': '🍲'
    };
    return iconMap[this.cuisine] || '🍽️';
  }
}

