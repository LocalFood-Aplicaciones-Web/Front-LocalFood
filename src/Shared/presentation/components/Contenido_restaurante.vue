/**
 * Contenido_restaurante.vue
 * @description Componente contenedor del módulo de restaurantes
 * Vue-First: Enfocado en reactividad, computed properties e i18n
 */

<script setup>
import { onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRestaurantsStore } from '../../../restaurants/application/restaurants.store.js';
import RestaurantCard from '../../../restaurants/presentation/components/RestaurantCard.vue';
import RestaurantSearch from '../../../restaurants/presentation/components/RestaurantSearch.vue';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';

const { t } = useI18n();
const restaurantsStore = useRestaurantsStore();

// Lifecycle: Cargar restaurantes al montar el componente
onMounted(async () => {
  await restaurantsStore.fetchRestaurants();
});

// Computed properties para renderizado reactivo
const isLoading = computed(() => restaurantsStore.loading);
const hasError = computed(() => !!restaurantsStore.error);
const errorMessage = computed(() => restaurantsStore.error);

const restaurantCount = computed(() => restaurantsStore.groupedRestaurants.length);
const totalLocales = computed(() => restaurantsStore.restaurants.length);

const hasNoResults = computed(() => {
  return !isLoading.value && restaurantCount.value === 0;
});

const shouldShowGrid = computed(() => {
  return !isLoading.value && !hasNoResults.value;
});
</script>

<template>
  <section class="content">
    <!-- Page Header: Título y estadísticas con binding reactivo -->
    <div class="page-header">
      <div class="header-content">
        <h1>{{ t('restaurants.title') }}</h1>
        <p class="subtitle">{{ t('restaurants.description') }}</p>
      </div>
      <div class="header-stats">
        <!-- Card de estadísticas con valores reactivos -->
        <div class="stat-card">
          <span class="stat-icon">🍴</span>
          <div class="stat-info">
            <p class="stat-label">{{ t('restaurants.stats.restaurants') }}</p>
            <p class="stat-value">{{ restaurantCount }}</p>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">📍</span>
          <div class="stat-info">
            <p class="stat-label">{{ t('restaurants.stats.localesTotal') }}</p>
            <p class="stat-value">{{ totalLocales }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Componente de búsqueda -->
    <RestaurantSearch />

    <!-- Estado de carga: v-if con transición -->
    <div v-if="isLoading" class="loading-container">
      <ProgressSpinner />
      <p>{{ t('restaurants.loading') }}</p>
    </div>

    <!-- Estado de error: Message component reactivo -->
    <Message
      v-if="hasError"
      severity="error"
      :text="errorMessage"
      class="error-message"
    />

    <!-- Estado vacío: Mostrar cuando no hay resultados -->
    <Message
      v-if="hasNoResults"
      severity="info"
      :text="t('restaurants.search.noResults')"
      class="empty-message"
    />

    <!-- Grid de restaurantes: v-if + v-for con binding reactivo -->
    <div v-if="shouldShowGrid" class="restaurants-grid">
      <RestaurantCard
        v-for="restaurant in restaurantsStore.groupedRestaurants"
        :key="restaurant.name"
        :restaurant="restaurant"
      />
    </div>
  </section>
</template>

<style scoped>
.content {
  flex: 1;
  padding: 40px;
  background-color: #f4f4f4;
  min-height: 100vh;
  overflow-y: auto;
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
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
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

@media (max-width: 1200px) {
  .restaurants-grid {
    grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
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

@media (max-width: 900px) {
  .restaurants-grid {
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  }
}

@media (max-width: 768px) {
  .content {
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
