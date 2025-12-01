<template>
  <div class="cuadro-top3">
    <Card class="card-top3">
      <template #header>
        <div class="top3-header">
          <i class="pi pi-fire"></i>
          <span v-if="nearestRestaurants.length > 0">
            Top 3 {{ selectedCuisine || 'Restaurantes Cercanos' }}
          </span>
          <span v-else>
            {{ $t('calculate.topRestaurants.title') }}
          </span>
        </div>
      </template>

      <template #content>
        <!-- Filtros de cocina -->
        <div class="cuisine-filters">
          <div class="filter-label">Filtrar por tipo:</div>
          <div class="filter-buttons">
            <button
              v-for="cuisine in availableCuisines"
              :key="cuisine"
              class="cuisine-btn"
              :class="{ active: selectedCuisine === cuisine }"
              @click="selectCuisine(cuisine)"
            >
              {{ getCuisineIcon(cuisine) }} {{ cuisine }}
            </button>
            <button
              class="cuisine-btn clear-btn"
              :class="{ active: !selectedCuisine }"
              @click="clearCuisineFilter"
            >
              ✕ Todos
            </button>
          </div>
        </div>

        <div v-if="isLoading" class="loading-state">
          <i class="pi pi-spin pi-spinner"></i>
          <p>{{ $t('calculate.topRestaurants.loading') }}</p>
        </div>

        <div v-else-if="nearestRestaurants && nearestRestaurants.length > 0" class="restaurants-top3-list">
          <TransitionGroup name="list" tag="div">
            <div
              v-for="(restaurant, index) in nearestRestaurants"
              :key="restaurant.id"
              class="restaurant-item-top3"
              :class="{ active: selectedRestaurant?.id === restaurant.id }"
              @click="selectRestaurantFromTop3(restaurant)"
            >
              <div class="rank-badge">{{ index + 1 }}</div>
              <div class="restaurant-item-info">
                <h4>{{ restaurant.name }}</h4>
                <p class="cuisine-type">{{ restaurant.cuisine }}</p>
                <p class="distance-info">
                  <i class="pi pi-map-marker"></i>
                  {{ calculateDistance(restaurant) }} km
                </p>
              </div>
              <div class="restaurant-item-rating">
                <Tag :value="`${restaurant.rating}⭐`" severity="warning" />
              </div>
            </div>
          </TransitionGroup>
        </div>

        <div v-else class="empty-state">
          <i class="pi pi-inbox"></i>
          <p v-if="selectedCuisine">
            No hay restaurantes de tipo "{{ selectedCuisine }}" cercanos
          </p>
          <p v-else>{{ $t('calculate.topRestaurants.noRestaurants') }}</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import useCalculateStore from '../../../calculate/application/calculate.store.js';

import Card from 'primevue/card';
import Tag from 'primevue/tag';

const toast = useToast();
const calculateStore = useCalculateStore();

const allRestaurants = ref([]);
const isLoading = ref(false);

// Propiedades computadas
const selectedRestaurant = computed(() => calculateStore.selectedRestaurant);
const groupMembers = computed(() => calculateStore.groupMembers);
const selectedGroup = computed(() => calculateStore.selectedGroup);
const selectedCuisine = computed({
  get: () => calculateStore.selectedCuisine,
  set: (value) => {
    calculateStore.selectedCuisine = value;
  }
});

// Obtener tipos de cocina disponibles
const availableCuisines = computed(() => {
  const cuisines = new Set(allRestaurants.value.map(r => r.cuisine).filter(Boolean));
  return Array.from(cuisines).sort();
});

// Calcular el Top 3 restaurantes más cercanos (filtrados por cuisine si está seleccionado)
const nearestRestaurants = computed(() => {
  if (!allRestaurants.value.length || !groupMembers.value.length) {
    return [];
  }

  // Filtrar restaurantes por cuisine si está seleccionado
  let restaurantsToFilter = allRestaurants.value;
  if (selectedCuisine.value) {
    restaurantsToFilter = restaurantsToFilter.filter(r => r.cuisine === selectedCuisine.value);
  }

  // Calcular centro del grupo
  const centerLat = groupMembers.value.reduce((sum, m) => sum + (m.address?.latitude || 0), 0) / groupMembers.value.length;
  const centerLng = groupMembers.value.reduce((sum, m) => sum + (m.address?.longitude || 0), 0) / groupMembers.value.length;

  // Calcular distancias
  const restaurantsWithDistance = restaurantsToFilter.map(restaurant => ({
    ...restaurant,
    distance: calculateHaversineDistance(centerLat, centerLng, restaurant.address?.latitude, restaurant.address?.longitude)
  }));

  // Ordenar por distancia y tomar Top 3
  return restaurantsWithDistance
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);
});

// Fórmula Haversine para calcular distancia entre dos puntos GPS
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calcular distancia para mostrar
function calculateDistance(restaurant) {
  if (!groupMembers.value.length) return 0;

  const centerLat = groupMembers.value.reduce((sum, m) => sum + (m.address?.latitude || 0), 0) / groupMembers.value.length;
  const centerLng = groupMembers.value.reduce((sum, m) => sum + (m.address?.longitude || 0), 0) / groupMembers.value.length;

  return calculateHaversineDistance(centerLat, centerLng, restaurant.address?.latitude, restaurant.address?.longitude).toFixed(2);
}

// Obtener ícono para tipo de cocina
function getCuisineIcon(cuisine) {
  const icons = {
    'Comida Rápida': '🍟',
    'Chinese': '🥡',
    'Peruvian': '🍗',
    'Mexican': '🌮',
    'Italian': '🍝',
    'Japanese': '🍣',
    'Argentine': '🥩',
    'American': '🍔',
    'Healthy': '🥗',
    'Thai': '🍲',
  };
  return icons[cuisine] || '🍽️';
}

// Seleccionar tipo de cocina
function selectCuisine(cuisine) {
  selectedCuisine.value = cuisine;
}

// Limpiar filtro de cocina
function clearCuisineFilter() {
  selectedCuisine.value = null;
}

// Cargar restaurantes desde la API
async function loadRestaurants() {
  isLoading.value = true;
  try {
    const response = await fetch('http://localhost:3000/restaurants');
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    allRestaurants.value = data;
    console.log('✅ Restaurantes cargados:', allRestaurants.value.length);
  } catch (error) {
    console.error('❌ Error cargando restaurantes:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los restaurantes',
      life: 3000
    });
  } finally {
    isLoading.value = false;
  }
}

function selectRestaurantFromTop3(restaurant) {
  calculateStore.setSelectedRestaurant(restaurant);
  toast.add({
    severity: 'success',
    summary: 'Seleccionado',
    detail: `${restaurant.name} seleccionado`,
    life: 2000
  });
}

// Cargar restaurantes al montar y cuando cambia el grupo
onMounted(() => {
  loadRestaurants();
});

watch(() => selectedGroup.value?.id, () => {
  loadRestaurants();
  selectedCuisine.value = null;
});
</script>

<style scoped>
.cuadro-top3 {
  grid-column: 2;
  grid-row: 1;
}

.card-top3 {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  animation: slideInRight 0.6s ease 0.1s both;
}

.top3-header {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
  font-weight: 700;
}

.top3-header i {
  font-size: 1.5rem;
  animation: fire 1s ease-in-out infinite;
}

.cuisine-filters {
  padding: 1.5rem;
  background: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
}

.filter-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 0.8rem;
}

.filter-buttons {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.cuisine-btn {
  padding: 0.6rem 1rem;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  font-weight: 600;
  color: #4b5563;
  white-space: nowrap;
}

.cuisine-btn:hover {
  border-color: #ff9655;
  background: #fff7ed;
  color: #ff9655;
}

.cuisine-btn.active {
  background: linear-gradient(135deg, #ff9655 0%, #ff7f3d 100%);
  color: white;
  border-color: #ff9655;
}

.clear-btn {
  background: #f0f0f0;
}

.clear-btn:hover {
  background: #e0e0e0;
}

.clear-btn.active {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
  border-color: #4b5563;
}

.restaurants-top3-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
}

.restaurant-item-top3 {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem;
  background: #f9fafb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.restaurant-item-top3:hover {
  background: #f3f4f6;
  transform: translateX(5px);
  border-left-color: #ff9655;
}

.restaurant-item-top3.active {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-left-color: #f59e0b;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

.rank-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff9655 0%, #ff7f3d 100%);
  color: white;
  font-weight: 900;
  font-size: 1.3rem;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(255, 150, 85, 0.3);
}

.restaurant-item-info {
  flex: 1;
}

.restaurant-item-info h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
}

.cuisine-type {
  margin: 0.3rem 0 0 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.distance-info {
  margin: 0.5rem 0 0 0;
  color: #ff9655;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.restaurant-item-rating {
  flex-shrink: 0;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #9ca3af;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fire {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.loading-state {
  padding: 2rem;
  text-align: center;
  color: #4b5563;
}

.loading-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
