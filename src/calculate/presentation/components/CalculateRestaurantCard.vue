<template>
  <div class="cuadro-restaurant">
    <Card class="card-restaurant">
      <template #header>
        <div class="restaurant-header-image">
          <img
            v-if="selectedRestaurant"
            :src="`https://via.placeholder.com/400x250?text=${selectedRestaurant.name}`"
            :alt="selectedRestaurant.name"
            class="image-restaurant"
          />
          <div v-else class="restaurant-empty">
            <i class="pi pi-image"></i>
            <p>{{ $t('calculate.restaurantCard.noRestaurant') }}</p>
          </div>
        </div>
      </template>

      <template #title v-if="selectedRestaurant">
        <div class="restaurant-title-section">
          <div>
            <h3 class="restaurant-name">{{ selectedRestaurant.name }}</h3>
            <p class="restaurant-cuisine">{{ selectedRestaurant.cuisine }} • {{ selectedRestaurant.priceRange }}</p>
          </div>
          <div class="restaurant-rating">
            <span class="rating-stars">⭐ {{ selectedRestaurant.rating }}/5</span>
          </div>
        </div>
      </template>

      <template #content v-if="selectedRestaurant">
        <div class="restaurant-details">
          <div class="detail-row">
            <i class="pi pi-map-marker"></i>
            <span>{{ selectedRestaurant.address?.city }}</span>
          </div>
          <div class="detail-row">
            <i class="pi pi-phone"></i>
            <span>{{ selectedRestaurant.phone }}</span>
          </div>
          <div class="detail-row">
            <i class="pi pi-clock"></i>
            <span>{{ selectedRestaurant.openHours }}</span>
          </div>

          <Divider class="my-3" />

          <div v-if="hasValidCalculation" class="calculation-results">
            <div class="result-box">
              <div class="result-label">{{ $t('calculate.restaurantCard.calculate') }}</div>
              <div class="result-value">{{ formattedDistance }}</div>
            </div>
            <div class="result-box">
              <div class="result-label">{{ $t('calculate.membersByDistance.distance') }}</div>
              <div class="result-value">{{ calculateAverageDistance()?.toFixed(2) || '—' }} km</div>
            </div>
            <div class="result-box">
              <div class="result-label">Score de Viabilidad</div>
              <ProgressBar
                :value="getViabilityScore()"
                :showValue="true"
                class="score-bar"
              ></ProgressBar>
            </div>
          </div>
        </div>
      </template>

      <template #footer v-if="selectedRestaurant">
        <Button
          :label="$t('calculate.restaurantCard.calculate')"
          icon="pi pi-calculator"
          class="btn-calculate"
          @click="performCalculation"
          :loading="isCalculating"
        />
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import useCalculateStore from '../../../calculate/application/calculate.store.js';

import Card from 'primevue/card';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import ProgressBar from 'primevue/progressbar';

const toast = useToast();
const calculateStore = useCalculateStore();

const isCalculating = ref(false);

const selectedRestaurant = computed(() => calculateStore.selectedRestaurant);
const currentCalculation = computed(() => calculateStore.calculationResults);
const hasValidCalculation = computed(() => calculateStore.hasValidCalculation);
const formattedDistance = computed(() => {
  if (!currentCalculation.value?.distance) {
    return '— km';
  }
  return `${currentCalculation.value.distance.toFixed(2)} km`;
});

function performCalculation() {
  if (!hasValidCalculation.value) {
    toast.add({
      severity: 'warning',
      summary: 'Incompleto',
      detail: 'Selecciona un restaurante y asegúrate de tener miembros',
      life: 3000
    });
    return;
  }

  // 🎯 Validar que el restaurante seleccionado coincida con el tipo de cocina filtrado
  if (calculateStore.selectedCuisine && selectedRestaurant.value?.cuisine !== calculateStore.selectedCuisine) {
    toast.add({
      severity: 'error',
      summary: 'Tipo de cocina incompatible',
      detail: `El restaurante seleccionado no coincide con el filtro "${calculateStore.selectedCuisine}"`,
      life: 3000
    });
    return;
  }

  isCalculating.value = true;
  setTimeout(() => {
    calculateStore.calculateDistances();
    isCalculating.value = false;

    const cuisineLabel = calculateStore.selectedCuisine ? ` (${calculateStore.selectedCuisine})` : '';
    toast.add({
      severity: 'success',
      summary: 'Calculado',
      detail: `Distancia${cuisineLabel}: ${currentCalculation.value?.distance?.toFixed(2) || '—'} km`,
      life: 3000
    });
  }, 800);
}

function calculateAverageDistance() {
  return currentCalculation.value?.averageDistance || 0;
}

function getViabilityScore() {
  return currentCalculation.value?.viabilityScore || 0;
}
</script>

<style scoped>
.cuadro-restaurant {
  grid-column: 1;
  grid-row: 1;
}

.card-restaurant {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: slideInLeft 0.6s ease;
}

.card-restaurant:hover {
  transform: translateY(-5px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.15);
}

.restaurant-header-image {
  width: 100%;
  height: 280px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.image-restaurant {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card-restaurant:hover .image-restaurant {
  transform: scale(1.05);
}

.restaurant-empty {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  gap: 1rem;
}

.restaurant-empty i {
  font-size: 4rem;
}

.restaurant-title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.restaurant-name {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  color: #1f2937;
}

.restaurant-cuisine {
  margin: 0.5rem 0 0 0;
  color: #6b7280;
  font-size: 0.95rem;
}

.restaurant-rating {
  background: #f59e0b;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-weight: 600;
}

.rating-stars {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.restaurant-details {
  padding: 1rem 0;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  border-radius: 10px;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
}

.detail-row:hover {
  background: #f3f4f6;
}

.detail-row i {
  font-size: 1.2rem;
  color: #ff9655;
  min-width: 24px;
}

.calculation-results {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1rem 0;
}

.result-box {
  padding: 1.2rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  border-left: 4px solid #f59e0b;
}

.result-label {
  font-size: 0.85rem;
  color: #92400e;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.result-value {
  font-size: 2rem;
  font-weight: 900;
  color: #ff7f3d;
  margin-top: 0.5rem;
}

.score-bar {
  margin-top: 0.5rem;
}

.btn-calculate {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #ff9655 0%, #ff7f3d 100%);
  border: none;
  color: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 150, 85, 0.3);
}

.btn-calculate:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 150, 85, 0.4);
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
