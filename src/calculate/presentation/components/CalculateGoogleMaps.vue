<template>
  <div class="cuadro-google-maps">
    <Card class="card-google-maps">
      <template #header>
        <div class="maps-header">
          <i class="pi pi-map"></i>
          <span>{{ $t('calculate.googleMaps.title') }}</span>
        </div>
      </template>

      <template #content>
        <div v-if="isLoading" class="loading-state">
          <ProgressSpinner />
          <p>Cargando datos del mapa...</p>
        </div>

        <div v-else-if="mapDataLoaded" class="map-data-container">
          <!-- Información del grupo -->
          <div class="group-info-box">
            <h4>📍 Ubicaciones del Grupo</h4>
            <div v-if="groupLocationData" class="location-details">
              <p><strong>Grupo:</strong> {{ groupLocationData.groupName }}</p>
              <p><strong>Centro del grupo:</strong> {{ groupLocationData.centerPoint.lat.toFixed(4) }}, {{ groupLocationData.centerPoint.lng.toFixed(4) }}</p>
              <p><strong>Miembros:</strong> {{ groupLocationData.members.length }}</p>
            </div>
          </div>

          <!-- Ruta optimizada -->
          <div class="route-info-box">
            <h4>🚗 Ruta Optimizada</h4>
            <div v-if="optimizedRoute" class="route-details">
              <p><strong>Restaurante:</strong> {{ optimizedRoute.restaurantLocation.name }}</p>
              <p><strong>Distancia total:</strong> {{ optimizedRoute.totalDistance }} km</p>
              <p><strong>Duración estimada:</strong> {{ optimizedRoute.totalDuration }} minutos</p>

              <div class="route-steps">
                <h5>Pasos de la ruta:</h5>
                <div v-for="step in optimizedRoute.routePoints" :key="step.memberId" class="route-step">
                  <span class="step-number">{{ step.order }}</span>
                  <span class="step-name">{{ step.name }}</span>
                  <span class="step-distance">{{ step.distance }} km</span>
                  <span class="step-duration">{{ step.duration }} min</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Matriz de distancias -->
          <div class="distance-matrix-box">
            <h4>📊 Matriz de Distancias</h4>
            <div class="distance-table">
              <div v-for="item in distanceMatrix" :key="item.id" class="distance-row">
                <span class="origin">{{ item.origin }}</span>
                <span class="arrow">→</span>
                <span class="destination">{{ item.destination }}</span>
                <span class="distance">{{ item.distance }} km</span>
                <span class="duration">({{ item.duration }} min)</span>
              </div>
            </div>
          </div>

          <!-- Características -->
          <div class="features-box">
            <h5>✓ Características incluidas:</h5>
            <div class="features-grid">
              <div class="feature">
                <i class="pi pi-check"></i>
                <span>Ubicación de miembros del grupo</span>
              </div>
              <div class="feature">
                <i class="pi pi-check"></i>
                <span>Ubicación del restaurante seleccionado</span>
              </div>
              <div class="feature">
                <i class="pi pi-check"></i>
                <span>Centro del grupo (punto de encuentro)</span>
              </div>
              <div class="feature">
                <i class="pi pi-check"></i>
                <span>Rutas optimizadas</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <i class="pi pi-inbox"></i>
          <p>No hay datos de mapa disponibles</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import useCalculateStore from '../../../calculate/application/calculate.store.js';

import Card from 'primevue/card';
import ProgressSpinner from 'primevue/progressspinner';

const calculateStore = useCalculateStore();

// Estado
const isLoading = ref(false);
const mapDataLoaded = ref(false);
const groupLocationData = ref(null);
const optimizedRoute = ref(null);
const distanceMatrix = ref([]);

// Propiedades computadas
const selectedGroup = computed(() => calculateStore.selectedGroup);
const groupMembers = computed(() => calculateStore.groupMembers);
const selectedRestaurant = computed(() => calculateStore.selectedRestaurant);
const calculationResults = computed(() => calculateStore.calculationResults);
const groupId = computed(() => selectedGroup.value?.id);

// Función para generar datos del mapa desde el cálculo
function generateMapDataFromCalculation() {
  if (!calculationResults.value || !selectedRestaurant.value) return;

  console.log('📍 Generando datos del mapa desde cálculo...');

  // Información del grupo
  groupLocationData.value = {
    groupName: selectedGroup.value?.name || 'Grupo',
    centerPoint: {
      lat: calculationResults.value.centerPoint?.lat || -12.1084,
      lng: calculationResults.value.centerPoint?.lng || -77.0351
    },
    members: groupMembers.value.length
  };

  // Ruta optimizada
  optimizedRoute.value = {
    restaurantLocation: {
      name: selectedRestaurant.value.name,
      lat: selectedRestaurant.value.address?.latitude,
      lng: selectedRestaurant.value.address?.longitude
    },
    totalDistance: calculationResults.value.distance?.toFixed(2) || '0',
    totalDuration: Math.round(calculationResults.value.distance * 1.5 * 60 / 100) || '0',
    routePoints: (calculationResults.value.membersByDistance || []).map((member, index) => ({
      memberId: member.id,
      order: index + 1,
      name: member.name,
      distance: member.distance?.toFixed(2) || '0',
      duration: Math.round(member.distance * 1.5 * 60 / 100) || '0'
    }))
  };

  // Matriz de distancias
  distanceMatrix.value = [
    {
      id: 'center',
      origin: 'Centro del Grupo',
      destination: selectedRestaurant.value.name,
      distance: calculationResults.value.distance?.toFixed(2) || '0',
      duration: Math.round(calculationResults.value.distance * 1.5 * 60 / 100) || '0'
    },
    ...(calculationResults.value.membersByDistance || []).map((member, index) => ({
      id: `member-${member.id}`,
      origin: member.name,
      destination: selectedRestaurant.value.name,
      distance: member.distance?.toFixed(2) || '0',
      duration: Math.round(member.distance * 1.5 * 60 / 100) || '0'
    }))
  ];

  mapDataLoaded.value = true;
  console.log('✅ Datos del mapa generados:', {
    groupLocationData: groupLocationData.value,
    optimizedRoute: optimizedRoute.value,
    distanceMatrix: distanceMatrix.value
  });
}

// Cargar datos del mapa desde la API
async function loadMapData() {
  if (!groupId.value) return;

  isLoading.value = true;
  try {
    const response = await fetch('http://localhost:3000/mapData');
    if (!response.ok) throw new Error('Failed to fetch map data');
    const mapData = await response.json();

    const groupLocation = mapData.groupLocations.find(loc => loc.groupId == groupId.value);
    if (groupLocation) {
      groupLocationData.value = groupLocation;
    }

    const route = mapData.optimizedRoutes.find(r => r.groupId == groupId.value);
    if (route) {
      optimizedRoute.value = route;
    }

    distanceMatrix.value = mapData.distanceMatrix;
    mapDataLoaded.value = true;
    console.log('✅ Datos del mapa cargados desde API');
  } catch (error) {
    console.error('❌ Error cargando datos del mapa:', error);
    mapDataLoaded.value = false;
  } finally {
    isLoading.value = false;
  }
}

// Watcher para detectar cambios en los resultados del cálculo
watch(calculationResults, (newResults) => {
  if (newResults) {
    console.log('👀 Cambios detectados en cálculo, actualizando mapa...');
    generateMapDataFromCalculation();
  }
}, { deep: true });

// Cargar datos iniciales
onMounted(() => {
  loadMapData();
});
</script>

<style scoped>
.cuadro-google-maps {
  grid-column: 1 / -1;
  grid-row: 4;
}

.card-google-maps {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  animation: slideInUp 0.6s ease 0.4s both;
}

.maps-header {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
  font-weight: 700;
}

.maps-header i {
  font-size: 1.5rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
  color: #6b7280;
}

.map-data-container {
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.group-info-box,
.route-info-box,
.distance-matrix-box,
.features-box {
  padding: 1.5rem;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 12px;
  border-left: 4px solid #06b6d4;
}

.group-info-box {
  grid-column: 1;
}

.route-info-box {
  grid-column: 2;
  grid-row: 1;
}

.distance-matrix-box {
  grid-column: 1 / -1;
  grid-row: 2;
}

.features-box {
  grid-column: 1 / -1;
  grid-row: 3;
}

.group-info-box h4,
.route-info-box h4,
.distance-matrix-box h4,
.features-box h5 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #1f2937;
  font-size: 1.1rem;
}

.location-details p,
.route-details p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  color: #374151;
}

.route-steps {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.route-steps h5 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #6b7280;
}

.route-step {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: white;
  border-radius: 8px;
  font-size: 0.85rem;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #06b6d4;
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.step-name {
  flex: 1;
  font-weight: 600;
  color: #1f2937;
}

.step-distance,
.step-duration {
  font-size: 0.8rem;
  color: #6b7280;
}

.distance-table {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.distance-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  font-size: 0.9rem;
  border-left: 3px solid #06b6d4;
}

.origin {
  font-weight: 600;
  color: #1f2937;
  min-width: 120px;
}

.arrow {
  color: #9ca3af;
  font-weight: bold;
}

.destination {
  flex: 1;
  color: #374151;
}

.distance {
  font-weight: 600;
  color: #06b6d4;
  min-width: 60px;
}

.duration {
  color: #6b7280;
  min-width: 70px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
}

.feature i {
  color: #10b981;
  font-weight: 700;
  font-size: 1.2rem;
}

.feature span {
  font-size: 0.9rem;
  color: #374151;
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

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .map-data-container {
    grid-template-columns: 1fr;
  }

  .group-info-box,
  .route-info-box {
    grid-column: 1 !important;
    grid-row: auto !important;
  }
}
</style>
