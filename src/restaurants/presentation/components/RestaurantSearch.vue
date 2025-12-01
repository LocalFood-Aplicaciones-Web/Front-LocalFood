/**
 * RestaurantSearch.vue
 * @description Search input component for filtering restaurants by name
 * Vue-First: Enfocado en reactividad y binding de Vue
 */

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRestaurantsStore } from '../../application/restaurants.store.js';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const { t } = useI18n();
const restaurantsStore = useRestaurantsStore();

// Binding directo con el store reactivo
const searchInputValue = computed({
  get: () => restaurantsStore.searchTerm,
  set: (value) => restaurantsStore.setSearchTerm(value)
});

// Computed para mostrar información
const hasSearchResults = computed(() => {
  return restaurantsStore.searchTerm && restaurantsStore.groupedRestaurants.length > 0;
});

const noSearchResults = computed(() => {
  return restaurantsStore.searchTerm && restaurantsStore.groupedRestaurants.length === 0;
});

const resultCount = computed(() => restaurantsStore.groupedRestaurants.length);

// Métodos Vue
const clearSearch = () => {
  searchInputValue.value = '';
};
</script>

<template>
  <div class="search-container">
    <div class="search-input-wrapper">
      <i class="pi pi-search search-icon"></i>

      <!-- Input con v-model directo al computed (binding bidireccional) -->
      <InputText
        v-model="searchInputValue"
        type="text"
        :placeholder="t('restaurants.search.placeholder')"
        class="search-input"
      />

      <!-- Botón de limpiar condicional con v-show -->
      <Button
        v-show="searchInputValue"
        icon="pi pi-times"
        class="clear-btn"
        @click="clearSearch"
        severity="danger"
        text
        rounded
      />
    </div>

    <!-- Información reactiva con v-if -->
    <p v-if="hasSearchResults" class="search-info success">
      ✅ {{ t('restaurants.search.results') }}: <strong>{{ resultCount }}</strong> {{ t('restaurants.search.restaurantFound') }}
    </p>
    <p v-else-if="noSearchResults" class="search-info error">
      ❌ {{ t('restaurants.search.noResults') }}
    </p>
  </div>
</template>

<style scoped>
.search-container {
  margin-bottom: 24px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-icon {
  position: absolute;
  left: 14px;
  color: #4ecdc4;
  font-size: 16px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 14px 12px 40px !important;
  font-size: 14px;
  border: 2px solid #e8e8e8 !important;
  border-radius: 8px !important;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #4ecdc4 !important;
  box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1) !important;
}

.clear-btn {
  margin-right: 8px;
}

.search-info {
  margin-top: 8px;
  font-size: 12px;
  padding: 0 4px;
}

.search-info.success {
  color: #28a745;
}

.search-info.error {
  color: #dc3545;
}

@media (max-width: 768px) {
  .search-input {
    font-size: 16px; /* Prevenir zoom en mobile */
  }
}
</style>
