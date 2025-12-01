/**
 * RestaurantCard.vue
 * @description Card component expandible que muestra restaurante y sus locales
 * Vue-First: Enfocado en reactividad y binding reactivo
 */

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRestaurantsStore } from '../../application/restaurants.store.js';
import { useCalculateStore } from '../../../calculate/application/calculate.store.js';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Divider from 'primevue/divider';

const { t } = useI18n();
const restaurantsStore = useRestaurantsStore();
const calculateStore = useCalculateStore();

// Estado local para expandir/contraer
const isExpanded = ref(false);

const props = defineProps({
  restaurant: {
    type: Object,
    required: true
  }
});

// Log al recibir props
console.log('🔍 RestaurantCard recibió props:', props.restaurant);
console.log('🔍 restaurant.name:', props.restaurant.name);
console.log('🔍 restaurant.locales:', props.restaurant.locales);
console.log('🔍 restaurant.locales.length:', props.restaurant.locales?.length);
console.log('🔍 Todas las propiedades del restaurant:', Object.keys(props.restaurant));
console.log('🔍 Valores completos:', {
  name: props.restaurant.name,
  cuisine: props.restaurant.cuisine,
  priceRange: props.restaurant.priceRange,
  averageRating: props.restaurant.averageRating,
  count: props.restaurant.count,
  locales: props.restaurant.locales,
  userId: props.restaurant.userId
});

// Computed properties
const cuisineIcon = computed(() => {
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
  return iconMap[props.restaurant.cuisine] || '🍽️';
});

const averageRatingColor = computed(() => {
  const rating = parseFloat(props.restaurant.averageRating);
  if (rating >= 4.5) return 'success';
  if (rating >= 3.5) return 'info';
  if (rating >= 3) return 'warning';
  return 'danger';
});

const priceRangeDisplay = computed(() => {
  const priceMap = {
    '$': t('restaurants.card.budget'),
    '$$': t('restaurants.card.moderate'),
    '$$$': t('restaurants.card.premium')
  };
  return priceMap[props.restaurant.priceRange] || props.restaurant.priceRange;
});

const displayLocales = computed(() => {
  console.log('📊 displayLocales computed iniciado');
  console.log('📊 props.restaurant:', props.restaurant);
  console.log('📊 props.restaurant.locales:', props.restaurant.locales);
  console.log('📊 props.restaurant.locales es array?:', Array.isArray(props.restaurant.locales));

  // Asegurar que locales siempre sea un array
  const localesArray = Array.isArray(props.restaurant.locales) ? props.restaurant.locales : [];
  console.log('📊 localesArray después de validación:', localesArray);
  console.log('📊 localesArray.length:', localesArray.length);
  console.log('📊 filterMode:', restaurantsStore.filterMode);

  if (restaurantsStore.filterMode === 'all') {
    console.log('📊 Modo ALL - retornando todos:', localesArray);
    return localesArray;
  } else {
    const filtered = localesArray.filter(r => r.rating >= 3 && r.rating <= 5);
    console.log('📊 Modo QUALITY - retornando filtrados:', filtered);
    return filtered;
  }
});

const hasNoLocales = computed(() => {
  const result = displayLocales.value.length === 0;
  console.log('📊 hasNoLocales:', result, 'displayLocales.length:', displayLocales.value.length);
  return result;
});

// Métodos
const toggleExpand = () => {
  console.log('🔄 Toggling expand. Antes:', isExpanded.value);
  isExpanded.value = !isExpanded.value;
  console.log('🔄 Toggling expand. Después:', isExpanded.value);
  console.log('🔄 displayLocales cuando se expande:', displayLocales.value);
};

const selectRestaurant = (locale) => {
  restaurantsStore.selectRestaurant(locale);
  calculateStore.setSelectedRestaurant(locale);
  console.log(`✅ ${t('restaurants.messages.selectedRestaurant')}: ${locale.name}`);
};

const toggleLocalesView = (mode) => {
  restaurantsStore.toggleFilterMode(mode);
};

const getFilterIcon = (mode) => {
  return mode === 'all' ? 'pi pi-list' : 'pi pi-star-fill';
};
</script>

<template>
  <div class="restaurant-card" :class="{ expanded: isExpanded }">
    <!-- Header: Clickeable para expandir -->
    <div class="card-header-clickable" @click="toggleExpand">
      <div class="header-left">
        <span class="cuisine-icon">{{ cuisineIcon }}</span>
        <div class="header-info">
          <h3>{{ restaurant.name }}</h3>
          <p class="locales-count">{{ displayLocales.length }} {{ t('restaurants.card.locales') }}</p>
        </div>
      </div>
      <div class="header-right">
        <Tag
          :value="`${restaurant.averageRating} ⭐`"
          :severity="averageRatingColor"
          rounded
        />
        <i :class="['expand-icon', 'pi', isExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
      </div>
    </div>

    <!-- Contenido expandible: Mostrar/ocultar todo el contenido -->
    <div v-if="isExpanded" class="expanded-content">
      <!-- Info del restaurante -->
      <div class="info-section">
        <div class="info-row">
          <span class="label">{{ t('restaurants.card.cuisine') }}:</span>
          <span class="value">{{ restaurant.cuisine }}</span>
        </div>
        <div class="info-row">
          <span class="label">{{ t('restaurants.card.price') }}:</span>
          <span class="value">{{ priceRangeDisplay }} ({{ restaurant.priceRange }})</span>
        </div>
      </div>

      <Divider />

      <!-- Opción Extra: Botones toggle -->
      <div class="extra-options">
        <p class="option-title">{{ t('restaurants.extraOptions.title') }}</p>
        <div class="button-group">
          <Button
            :label="t('restaurants.extraOptions.allLocales')"
            :icon="getFilterIcon('all')"
            class="toggle-btn"
            :class="{ active: restaurantsStore.filterMode === 'all' }"
            @click="toggleLocalesView('all')"
            severity="info"
            text
            size="small"
          />
          <Button
            :label="t('restaurants.extraOptions.bestQuality')"
            :icon="getFilterIcon('quality')"
            class="toggle-btn"
            :class="{ active: restaurantsStore.filterMode === 'quality' }"
            @click="toggleLocalesView('quality')"
            severity="warning"
            text
            size="small"
          />
        </div>
      </div>

      <Divider />

      <!-- Lista de locales -->
      <div class="locales-section">
        <p v-if="hasNoLocales" class="no-locales">
          {{ t('restaurants.extraOptions.noLocales') }}
        </p>

        <div v-else class="locales-list">
          <div
            v-for="locale in displayLocales"
            :key="locale.id"
            class="locale-item"
          >
            <div class="locale-info">
              <div class="locale-name">{{ locale.name }}</div>
              <div class="locale-address">
                📍 {{ locale.address.street }}
              </div>
              <div class="locale-details">
                <span class="rating">⭐ {{ locale.rating }}</span>
                <span class="phone">☎️ {{ locale.phone }}</span>
                <span class="hours">🕐 {{ locale.openHours }}</span>
              </div>
            </div>
            <Button
              :label="t('restaurants.card.select')"
              icon="pi pi-check"
              class="select-btn"
              @click="selectRestaurant(locale)"
              severity="success"
              size="small"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.restaurant-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
}

.restaurant-card:hover {
  border-color: #4ecdc4;
  box-shadow: 0 4px 16px rgba(78, 205, 196, 0.15);
}

.restaurant-card.expanded {
  border-color: #4ecdc4;
  box-shadow: 0 8px 24px rgba(78, 205, 196, 0.2);
}

.card-header-clickable {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.cuisine-icon {
  font-size: 28px;
}

.header-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.header-info p {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: #999;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.expand-icon {
  font-size: 18px;
  color: #4ecdc4;
  transition: transform 0.3s ease;
}

.expanded-content {
  padding: 16px;
  border-top: 1px solid #e8e8e8;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 1000px;
  }
}

.info-section {
  padding: 12px 0;
  font-size: 13px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #666;
}

.value {
  color: #333;
}

.locales-count {
  color: #4ecdc4;
  font-weight: 600;
}

.extra-options {
  padding: 12px 0;
  text-align: center;
}

.option-title {
  margin: 0 0 10px 0;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.button-group {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.toggle-btn {
  border-radius: 6px;
  transition: all 0.3s ease;
}

.toggle-btn.active {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a8a0 100%);
  color: white !important;
}

.locales-section {
  padding: 12px 0;
}

.no-locales {
  text-align: center;
  color: #999;
  padding: 12px;
  font-size: 12px;
  font-style: italic;
}

.locales-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.locale-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4ecdc4;
  transition: all 0.3s ease;
}

.locale-item:hover {
  background: #f0f5f5;
  border-left-color: #2a9d8f;
}

.locale-info {
  flex: 1;
}

.locale-name {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
  font-size: 13px;
}

.locale-address {
  font-size: 11px;
  color: #666;
  margin-bottom: 6px;
}

.locale-details {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 10px;
  color: #888;
}

.locale-details span {
  display: flex;
  align-items: center;
  gap: 3px;
  white-space: nowrap;
}

.select-btn {
  white-space: nowrap;
}

@media (max-width: 768px) {
  .card-header-clickable {
    padding: 12px;
  }

  .expanded-content {
    padding: 12px;
  }

  .locale-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .locale-details {
    width: 100%;
  }
}
</style>
