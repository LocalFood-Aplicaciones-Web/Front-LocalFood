<template>
  <Dialog
    v-model:visible="showSelectRestaurantDialog"
    :header="$t('calculate.actionButtons.editRestaurant')"
    :modal="true"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <div class="dialog-content">
      <InputText
        v-model="restaurantSearchQuery"
        placeholder="Buscar restaurantes..."
        class="w-full mb-3"
      />

      <div class="restaurants-list">
        <div
          v-for="restaurant in filteredRestaurants"
          :key="restaurant.id"
          class="restaurant-selection-item"
          @click="selectAndCloseRestaurantDialog(restaurant)"
        >
          <Avatar
            :label="restaurant.name.charAt(0).toUpperCase()"
            size="large"
          />
          <div class="restaurant-info">
            <p class="restaurant-name">{{ restaurant.name }}</p>
            <p class="restaurant-cuisine">{{ restaurant.cuisine }}</p>
            <p class="restaurant-rating">
              <i class="pi pi-star text-warning"></i>
              {{ restaurant.rating }}/5
            </p>
          </div>
          <Tag :value="restaurant.priceRange" severity="info" />
        </div>
      </div>
    </div>

    <template #footer>
      <Button label="Cerrar" severity="secondary" @click="closeDialog" />
    </template>
  </Dialog>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import useCalculateStore from '../../../calculate/application/calculate.store.js';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Avatar from 'primevue/avatar';
import Tag from 'primevue/tag';

const toast = useToast();
const calculateStore = useCalculateStore();

// Usar el estado del store
const showSelectRestaurantDialog = computed({
  get: () => calculateStore.showSelectRestaurantDialog,
  set: (value) => {
    calculateStore.showSelectRestaurantDialog = value;
  }
});

// Estado local para búsqueda
const restaurantSearchQuery = ref('');
const allRestaurants = ref([]);
const isLoading = ref(false);

// Restaurantes filtrados
const filteredRestaurants = computed(() => {
  if (!restaurantSearchQuery.value) {
    return allRestaurants.value;
  }
  const query = restaurantSearchQuery.value.toLowerCase();
  return allRestaurants.value.filter(r =>
    r.name.toLowerCase().includes(query) ||
    r.cuisine.toLowerCase().includes(query)
  );
});

// Cargar restaurantes desde el servidor
async function loadRestaurants() {
  isLoading.value = true;
  try {
    const response = await fetch('http://localhost:3000/restaurants');
    if (!response.ok) throw new Error('Failed to fetch restaurants');
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

function selectAndCloseRestaurantDialog(restaurant) {
  calculateStore.setSelectedRestaurant(restaurant);
  closeDialog();
  toast.add({
    severity: 'success',
    summary: 'Seleccionado',
    detail: `${restaurant.name} seleccionado`,
    life: 2000
  });
}

function closeDialog() {
  calculateStore.showSelectRestaurantDialog = false;
  restaurantSearchQuery.value = '';
}

onMounted(() => {
  loadRestaurants();
});
</script>

<style scoped>
.dialog-content {
  padding: 1rem;
}

.restaurants-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.restaurant-selection-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.restaurant-selection-item:hover {
  background: #f3f4f6;
  border-color: #ff9655;
  transform: translateX(5px);
}

.restaurant-info {
  flex: 1;
}

.restaurant-name {
  margin: 0;
  font-weight: 600;
  color: #1f2937;
}

.restaurant-cuisine {
  margin: 0.3rem 0 0 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.restaurant-rating {
  margin: 0.3rem 0 0 0;
  font-size: 0.9rem;
  color: #f59e0b;
  font-weight: 600;
}
</style>
