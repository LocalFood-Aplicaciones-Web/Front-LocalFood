<template>
  <div class="cuadro-members-distance">
    <Card v-if="hasValidCalculation && selectedRestaurant" class="card-members-distance">
      <template #header>
        <div class="members-distance-header">
          <i class="pi pi-list"></i>
          <span>{{ $t('calculate.membersByDistance.title') }}</span>
        </div>
      </template>

      <template #content>
        <div v-if="getSortedMembersByDistance().length > 0" class="members-distance-list">
          <div
            v-for="(member, index) in getSortedMembersByDistance()"
            :key="member.id"
            class="member-distance-item"
          >
            <div class="distance-rank">{{ index + 1 }}</div>
            <div class="member-info-distance">
              <p class="member-name-distance">{{ member.name }}</p>
              <p class="member-city">{{ member.address?.city }}</p>
            </div>
            <div class="distance-value">
              <Tag
                :value="`${member.distance?.toFixed(2) || '—'} km`"
                :severity="getDistanceSeverity(member.distance)"
              />
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import useCalculateStore from '../../../calculate/application/calculate.store.js';

import Card from 'primevue/card';
import Tag from 'primevue/tag';

const calculateStore = useCalculateStore();

const hasValidCalculation = computed(() => calculateStore.hasValidCalculation);
const selectedRestaurant = computed(() => calculateStore.selectedRestaurant);

function getSortedMembersByDistance() {
  return calculateStore.calculationResults?.membersByDistance || [];
}

function getDistanceSeverity(distance) {
  if (!distance) return 'info';
  if (distance < 2) return 'success';
  if (distance < 5) return 'warning';
  return 'danger';
}
</script>

<style scoped>
.cuadro-members-distance {
  grid-column: 1 / -1;
  grid-row: 3;
}

.card-members-distance {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  animation: slideInUp 0.6s ease 0.3s both;
}

.members-distance-header {
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
  color: white;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
  font-weight: 700;
}

.members-distance-header i {
  font-size: 1.5rem;
}

.members-distance-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
}

.member-distance-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.member-distance-item:hover {
  background: #f3f4f6;
  transform: translateX(5px);
  border-left-color: #8b5cf6;
}

.distance-rank {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
  color: white;
  font-weight: 700;
  flex-shrink: 0;
}

.member-info-distance {
  flex: 1;
}

.member-name-distance {
  margin: 0;
  font-weight: 600;
  color: #1f2937;
}

.member-city {
  margin: 0.3rem 0 0 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.distance-value {
  flex-shrink: 0;
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
</style>

