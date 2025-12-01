/**
 * @file restaurant.model.js
 * @description Domain model for Restaurant business logic
 */

import { RestaurantEntity } from './restaurant.entity.js';

export class RestaurantModel {
  /**
   * Groups restaurants by name and counts locales in Peru
   * @param {RestaurantEntity[]} restaurants
   * @returns {Map} Map with restaurant names as keys and count as value
   */
  static groupRestaurantsByName(restaurants) {
    console.log('🔍 groupRestaurantsByName - Restaurantes recibidos:', restaurants);
    console.log('🔍 Cantidad de restaurantes:', restaurants.length);
    const grouped = new Map();

    restaurants.forEach(restaurant => {
      console.log('📦 Procesando restaurante:', restaurant);
      const baseName = restaurant.name.split(' - ')[0]; // Get base name (e.g., "KFC" from "KFC - San Isidro")
      console.log('🏷️ Nombre base extraído:', baseName);

      if (!grouped.has(baseName)) {
        console.log('✨ Creando nueva entrada para:', baseName);
        grouped.set(baseName, {
          name: baseName,
          cuisine: restaurant.cuisine,
          priceRange: restaurant.priceRange,
          userId: restaurant.userId,
          locales: []
        });
      }

      console.log('➕ Agregando locale a:', baseName, 'Locale:', restaurant);
      grouped.get(baseName).locales.push(restaurant);
      console.log('📊 Locales actuales para', baseName, ':', grouped.get(baseName).locales.length);
    });

    console.log('✅ Mapa agrupado final:');
    grouped.forEach((value, key) => {
      console.log(`   ${key}: ${value.locales.length} locales`, value.locales);
    });
    return grouped;
  }

  /**
   * Filters restaurants by high quality (3-5 stars)
   * @param {RestaurantEntity[]} restaurants
   * @returns {RestaurantEntity[]}
   */
  static filterHighQuality(restaurants) {
    return restaurants.filter(r => r.isHighQuality());
  }

  /**
   * Filters restaurants by name (search)
   * @param {RestaurantEntity[]} restaurants
   * @param {string} searchTerm
   * @returns {RestaurantEntity[]}
   */
  static searchByName(restaurants, searchTerm) {
    if (!searchTerm.trim()) return restaurants;

    const term = searchTerm.toLowerCase();
    return restaurants.filter(r =>
      r.name.toLowerCase().includes(term) ||
      r.cuisine.toLowerCase().includes(term)
    );
  }

  /**
   * Filters restaurants by cuisine type
   * @param {RestaurantEntity[]} restaurants
   * @param {string} cuisine
   * @returns {RestaurantEntity[]}
   */
  static filterByCuisine(restaurants, cuisine) {
    if (!cuisine) return restaurants;
    return restaurants.filter(r => r.cuisine === cuisine);
  }

  /**
   * Gets unique cuisines from restaurants
   * @param {RestaurantEntity[]} restaurants
   * @returns {string[]}
   */
  static getUniqueCuisines(restaurants) {
    const cuisines = new Set(restaurants.map(r => r.cuisine));
    return Array.from(cuisines).sort();
  }

  /**
   * Calculates average rating for a group of restaurants
   * @param {RestaurantEntity[]} restaurants
   * @returns {number}
   */
  static calculateAverageRating(restaurants) {
    if (restaurants.length === 0) return 0;
    const sum = restaurants.reduce((acc, r) => acc + r.rating, 0);
    return (sum / restaurants.length).toFixed(1);
  }

  /**
   * Sorts restaurants by rating (descending)
   * @param {RestaurantEntity[]} restaurants
   * @returns {RestaurantEntity[]}
   */
  static sortByRating(restaurants) {
    return [...restaurants].sort((a, b) => b.rating - a.rating);
  }
}
