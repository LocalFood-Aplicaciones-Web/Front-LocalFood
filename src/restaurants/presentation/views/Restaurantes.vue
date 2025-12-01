/**
 * Restaurantes.vue
 * @description Main view for restaurant management
 * Displays all restaurants grouped by name with search functionality
 */

<script setup>
import { onMounted, computed } from 'vue';
import { useRestaurantsStore } from '../../restaurants/application/restaurants.store.js';
import RestaurantCard from '../components/RestaurantCard.vue';
import RestaurantSearch from '../components/RestaurantSearch.vue';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';

const restaurantsStore = useRestaurantsStore();

// Load restaurants on mount
onMounted(async () => {
  await restaurantsStore.fetchRestaurants();
});

// Computed properties
const totalRestaurants = computed(() => restaurantsStore.restaurants.length);
const totalLocales = computed(() => {
  return restaurantsStore.restaurants.reduce((acc, r) => acc + 1, 0);
});
</script>

<template>
  <div class="restaurantes-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>🍽️ Gestión de Restaurantes</h1>
        <p class="subtitle">Explora y selecciona restaurantes para tu almuerzo en grupo</p>
      </div>
      <div class="header-stats">
        <div class="stat-card">
          <span class="stat-icon">🍴</span>
          <div class="stat-info">
            <p class="stat-label">Restaurantes</p>
            <p class="stat-value">{{ restaurantsStore.groupedRestaurants.length }}</p>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">📍</span>
          <div class="stat-info">
            <p class="stat-label">Locales Totales</p>
            <p class="stat-value">{{ totalRestaurants }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Component -->
    <RestaurantSearch />

    <!-- Loading State -->
    <div v-if="restaurantsStore.loading" class="loading-container">
      <ProgressSpinner />
      <p>Cargando restaurantes...</p>
    </div>

    <!-- Error State -->
    <Message
      v-if="restaurantsStore.error"
      severity="error"
      :text="restaurantsStore.error"
      class="error-message"
    />

    <!-- Empty State -->
    <Message
      v-if="!restaurantsStore.loading && restaurantsStore.groupedRestaurants.length === 0"
      severity="info"
      text="No se encontraron restaurantes con los criterios de búsqueda"
      class="empty-message"
    />

    <!-- Restaurants Grid -->
    <div v-if="!restaurantsStore.loading && restaurantsStore.groupedRestaurants.length > 0" class="restaurants-grid">
      <RestaurantCard
        v-for="restaurant in restaurantsStore.groupedRestaurants"
        :key="restaurant.name"
        :restaurant="restaurant"
      />
    </div>
  </div>
</template>

<style scoped>
.restaurantes-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-header {
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.header-content h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a8a0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.header-stats {
  display: flex;
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: #4ecdc4;
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.1);
}

.stat-icon {
  font-size: 24px;
}

.stat-info {
  text-align: left;
}

.stat-label {
  margin: 0;
  font-size: 11px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #4ecdc4;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  color: #666;
}

.error-message {
  margin-bottom: 24px;
}

.empty-message {
  margin-bottom: 24px;
}

.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
  animation: gridAppear 0.4s ease-in;
}

@keyframes gridAppear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 1024px) {
  .restaurants-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }

  .page-header {
    flex-direction: column;
  }

  .header-stats {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .restaurantes-page {
    padding: 16px;
  }

  .page-header {
    gap: 16px;
  }

  .header-content h1 {
    font-size: 24px;
  }

  .restaurants-grid {
    grid-template-columns: 1fr;
  }

  .header-stats {
    flex-direction: column;
    width: 100%;
  }

  .stat-card {
    width: 100%;
  }
}
</style>

