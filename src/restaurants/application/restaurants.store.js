/**
 * @file restaurants.store.js
 * @description Pinia store for restaurants state management
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import restaurantsApi from '../infrastructure/restaurants-api.js';
import { RestaurantModel } from '../domain/model/restaurant.model.js';

export const useRestaurantsStore = defineStore('restaurants', () => {
  // ============================================
  // State
  // ============================================
  const restaurants = ref([]);
  const selectedRestaurant = ref(null);
  const searchTerm = ref('');
  const filterMode = ref('all'); // 'all' o 'quality' (3-5 stars)
  const loading = ref(false);
  const error = ref(null);

  // ============================================
  // Helper Functions
  // ============================================

  /**
   * Get current user ID from localStorage
   */
  function getCurrentUserId() {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.id;
    }
    return null;
  }

  /**
   * Save restaurants to localStorage
   */
  function saveToLocalStorage(data) {
    const userId = getCurrentUserId();
    if (userId) {
      localStorage.setItem(`restaurants_${userId}`, JSON.stringify(data));
      console.log(`💾 Saved ${data.length} restaurants to localStorage for user ${userId}`);
    }
  }

  /**
   * Load restaurants from localStorage
   */
  function loadFromLocalStorage() {
    const userId = getCurrentUserId();
    if (userId) {
      const data = localStorage.getItem(`restaurants_${userId}`);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          console.log(`📂 Loaded ${parsed.length} restaurants from localStorage for user ${userId}`);
          return parsed;
        } catch (e) {
          console.error('❌ Error parsing localStorage data:', e);
          return [];
        }
      }
    }
    return [];
  }

  // ============================================
  // Computed Properties
  // ============================================

  /**
   * Groups restaurants by name and counts locales
   */
  const groupedRestaurants = computed(() => {
    console.log('🔄 COMPUTED groupedRestaurants iniciado');
    console.log('📊 restaurants.value:', restaurants.value);
    console.log('📊 restaurants.value.length:', restaurants.value.length);

    let filtered = restaurants.value;

    // Aplicar búsqueda
    if (searchTerm.value.trim()) {
      filtered = RestaurantModel.searchByName(filtered, searchTerm.value);
      console.log('🔍 Después de búsqueda, filtered:', filtered);
    }

    // Agrupar por nombre
    console.log('📦 Llamando a groupRestaurantsByName con:', filtered);
    const grouped = RestaurantModel.groupRestaurantsByName(filtered);
    console.log('📦 Resultado de groupRestaurantsByName:', grouped);

    // Convertir Map a Array y aplicar filtro de calidad
    const result = Array.from(grouped.values()).map((group, index) => {
      console.log(`\n🏪 Procesando grupo ${index}:`, group);
      console.log(`   ├─ name: ${group.name}`);
      console.log(`   ├─ cuisine: ${group.cuisine}`);
      console.log(`   ├─ locales.length: ${group.locales.length}`);
      console.log(`   └─ locales:`, group.locales);

      let locales = [...group.locales]; // Copiar el array para evitar mutaciones
      console.log(`   📍 Locales antes de filtro:`, locales);

      // Filtrar por calidad si está activado
      if (filterMode.value === 'quality') {
        locales = RestaurantModel.filterHighQuality(locales);
        console.log(`   📍 Locales después de filtro quality:`, locales);
      }

      // Ordenar por rating (mejor primero)
      locales = RestaurantModel.sortByRating(locales);
      console.log(`   📍 Locales después de sort:`, locales);

      const final = {
        name: group.name,
        cuisine: group.cuisine,
        priceRange: group.priceRange,
        userId: group.userId,
        locales: locales, // Asignar explícitamente
        count: locales.length,
        averageRating: RestaurantModel.calculateAverageRating(locales)
      };

      console.log(`   ✅ Objeto final para ${group.name}:`, final);
      console.log(`   ✅ final.locales:`, final.locales);
      console.log(`   ✅ final.locales.length:`, final.locales.length);
      return final;
    });

    console.log('✅ RESULTADO FINAL DE groupedRestaurants:', result);
    return result;
  });

  /**
   * Get filtered restaurants (by search and quality)
   */
  const filteredRestaurants = computed(() => {
    let filtered = restaurants.value;

    // Aplicar búsqueda
    if (searchTerm.value.trim()) {
      filtered = RestaurantModel.searchByName(filtered, searchTerm.value);
    }

    // Aplicar filtro de calidad
    if (filterMode.value === 'quality') {
      filtered = RestaurantModel.filterHighQuality(filtered);
    }

    return filtered;
  });

  /**
   * Get unique cuisines
   */
  const uniqueCuisines = computed(() => {
    return RestaurantModel.getUniqueCuisines(restaurants.value);
  });

  /**
   * Check if any restaurants are loaded
   */
  const hasRestaurants = computed(() => restaurants.value.length > 0);

  // ============================================
  // Actions
  // ============================================

  /**
   * Fetch all restaurants
   */
  async function fetchRestaurants() {
    console.log('🔄 INICIANDO fetchRestaurants...');
    loading.value = true;
    error.value = null;

    try {
      // Cargar del localStorage primero para UI instantánea
      const localData = loadFromLocalStorage();
      console.log('📂 localStorage data:', localData);
      if (localData.length > 0) {
        restaurants.value = localData;
        console.log('✅ Restaurantes cargados desde localStorage');
      }

      // Fetch desde API en background
      console.log('🌐 Buscando restaurantes en http://localhost:3000/restaurants');
      const data = await restaurantsApi.getAll();

      console.log('📡 Data completa desde db.json:', data);
      console.log('📡 Cantidad total de restaurantes recibidos:', data.length);

      // NO filtrar por userId - mostrar todos los restaurantes
      restaurants.value = data;

      console.log(`✅ Loaded ${restaurants.value.length} restaurants from db.json`);
      console.log('🍽️ Restaurantes finales en store:', restaurants.value);

      // Guardar en localStorage
      const userId = getCurrentUserId();
      if (userId) {
        saveToLocalStorage(restaurants.value);
      }
    } catch (err) {
      error.value = err.message;
      console.error('❌ Error fetching restaurants:', err);
      console.error('❌ Error message:', err.message);
      console.error('❌ Error stack:', err.stack);
    } finally {
      loading.value = false;
      console.log('🔄 fetchRestaurants finalizado');
    }
  }

  /**
   * Select a restaurant
   */
  function selectRestaurant(restaurant) {
    selectedRestaurant.value = restaurant;
    console.log('🍽️ Selected restaurant:', restaurant.name);
  }

  /**
   * Clear selection
   */
  function clearSelection() {
    selectedRestaurant.value = null;
    console.log('🗑️ Cleared restaurant selection');
  }

  /**
   * Set search term
   */
  function setSearchTerm(term) {
    searchTerm.value = term;
  }

  /**
   * Clear search
   */
  function clearSearch() {
    searchTerm.value = '';
  }

  /**
   * Toggle filter mode between 'all' and 'quality'
   */
  function toggleFilterMode(mode) {
    filterMode.value = mode; // 'all' o 'quality'
    console.log(`🔍 Filter mode set to: ${mode}`);
  }

  /**
   * Get restaurants by name
   */
  function getRestaurantsByName(baseName) {
    return restaurants.value.filter(r =>
      r.name.split(' - ')[0] === baseName
    );
  }

  /**
   * Get best rated restaurants
   */
  function getBestRated(limit = null) {
    let sorted = RestaurantModel.sortByRating(restaurants.value);
    return limit ? sorted.slice(0, limit) : sorted;
  }

  // ============================================
  // Return Store
  // ============================================

  return {
    // State
    restaurants,
    selectedRestaurant,
    searchTerm,
    filterMode,
    loading,
    error,

    // Computed
    groupedRestaurants,
    filteredRestaurants,
    uniqueCuisines,
    hasRestaurants,

    // Actions
    fetchRestaurants,
    selectRestaurant,
    clearSelection,
    setSearchTerm,
    clearSearch,
    toggleFilterMode,
    getRestaurantsByName,
    getBestRated,
    loadFromLocalStorage,
    saveToLocalStorage,
    getCurrentUserId
  };
});
