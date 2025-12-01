<template>
  <div class="calculate-container">
    <Toast />
    <ConfirmDialog />

    <!-- Header Hermoso -->
    <div class="header-section">
      <div class="header-content">
        <h1 class="header-title">
          <i class="pi pi-calculator header-icon"></i>
          {{ $t('calculate.title') }}
        </h1>
        <p class="header-subtitle">{{ $t('calculate.description') }}</p>
      </div>
    </div>

    <!-- No Group Selected State -->
    <div v-if="!selectedGroup" class="empty-state-container">
      <Card class="empty-state-card">
        <template #content>
          <div class="empty-state">
            <i class="pi pi-inbox"></i>
            <p class="empty-title">{{ $t('calculate.selectGroup') }}</p>
            <Button
              :label="$t('calculate.goToGroups')"
              icon="pi pi-arrow-right"
              @click="navigateToColleagues"
              class="btn-navigate"
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- Main Content -->
    <div v-else class="container-main">
      <!-- CUADRO 1: Restaurante Seleccionado -->
      <CalculateRestaurantCard />

      <!-- CUADRO 2: Top 3 Restaurantes -->
      <CalculateTop3Restaurants />

      <!-- CUADRO 3: Grupo de Miembros -->
      <CalculateGroupMembers />

      <!-- CUADRO 4: Miembros por Distancia -->
      <CalculateMembersByDistance />

      <!-- CUADRO 5: Google Maps -->
      <CalculateGoogleMaps />
    </div>

    <!-- Dialogs -->
    <CalculateAddMembersDialog />
    <CalculateSelectRestaurantDialog />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import useCalculateStore from '../../../calculate/application/calculate.store.js';
import useColleaguesStore from '../../../colleagues/application/colleagues.store.js';

import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import Card from 'primevue/card';
import Button from 'primevue/button';

// Componentes locales
import CalculateRestaurantCard from '../../../calculate/presentation/components/CalculateRestaurantCard.vue';
import CalculateTop3Restaurants from '../../../calculate/presentation/components/CalculateTop3Restaurants.vue';
import CalculateGroupMembers from '../../../calculate/presentation/components/CalculateGroupMembers.vue';
import CalculateMembersByDistance from '../../../calculate/presentation/components/CalculateMembersByDistance.vue';
import CalculateGoogleMaps from '../../../calculate/presentation/components/CalculateGoogleMaps.vue';
import CalculateAddMembersDialog from '../../../calculate/presentation/components/CalculateAddMembersDialog.vue';
import CalculateSelectRestaurantDialog from '../../../calculate/presentation/components/CalculateSelectRestaurantDialog.vue';

const router = useRouter();
const toast = useToast();
const calculateStore = useCalculateStore();
const colleaguesStore = useColleaguesStore();

const selectedGroup = computed(() => calculateStore.selectedGroup);
const groups = computed(() => colleaguesStore.groups);

function navigateToColleagues() {
  router.push('/colleagues');
}

onMounted(async () => {
  console.log('📐 Página Calculate montada');

  // Cargar colegas y grupos
  await colleaguesStore.fetchColleagues();
  await colleaguesStore.fetchGroups();

  // Cargar restaurantes
  calculateStore.loadNearestRestaurants();

  // Inicializar con primer grupo
  if (groups.value.length > 0) {
    const group = groups.value[0];
    const members = colleaguesStore.colleaguesByGroup(group.id);
    calculateStore.initializeCalculation(group, members);
  }
});
</script>

<style scoped>
.calculate-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

/* ===== HEADER ===== */
.header-section {
  background: linear-gradient(135deg, #ff9655 0%, #ff7f3d 100%);
  color: white;
  padding: 3rem 2rem;
  border-radius: 20px;
  margin-bottom: 3rem;
  box-shadow: 0 20px 50px rgba(255, 150, 85, 0.2);
  text-align: center;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.header-title {
  font-size: 3rem;
  font-weight: 900;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.header-icon {
  font-size: 3.5rem;
  animation: bounce 2s infinite;
}

.header-subtitle {
  font-size: 1.1rem;
  margin-top: 1rem;
  opacity: 0.95;
  font-weight: 300;
}

/* ===== EMPTY STATE ===== */
.empty-state-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.empty-state-card {
  border-radius: 20px;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.empty-state {
  text-align: center;
  padding: 2rem;
}

.empty-state i {
  font-size: 4rem;
  color: #d1d5db;
  margin-bottom: 1rem;
  display: block;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin: 1rem 0;
}

.btn-navigate {
  margin-top: 1.5rem;
}

/* ===== MAIN CONTAINER ===== */
.container-main {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

/* ===== ANIMATIONS ===== */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
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

@keyframes memberFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
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

/* ===== TRANSITIONS ===== */
.list-enter-active,
.list-leave-active,
.member-enter-active,
.member-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.member-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to,
.member-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .container-main {
    grid-template-columns: 1fr;
  }

  .header-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .calculate-container {
    padding: 1rem;
  }

  .header-section {
    padding: 2rem 1rem;
    margin-bottom: 2rem;
  }

  .header-title {
    font-size: 1.5rem;
    flex-direction: column;
  }

  .header-icon {
    font-size: 2rem;
  }
}
</style>
