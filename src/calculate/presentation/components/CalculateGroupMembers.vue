<template>
  <div class="cuadro-group">
    <Card class="card-group">
      <template #header>
        <div class="group-header">
          <div class="group-header-left">
            <i class="pi pi-users"></i>
            <span>{{ $t('calculate.groupMembers.title') }}</span>
          </div>
          <Badge
            :value="memberCount"
            severity="info"
            class="member-count-badge"
          />
        </div>
      </template>

      <template #content>
        <div v-if="groupMembers && groupMembers.length > 0" class="members-container">
          <div class="members-counter">
            <span class="counter-label">{{ $t('calculate.groupMembers.members') }}:</span>
            <span class="counter-value">{{ memberCount }}/8</span>
            <ProgressBar
              :value="(memberCount / 8) * 100"
              class="counter-bar"
            ></ProgressBar>
          </div>

          <div class="members-grid">
            <TransitionGroup name="member" tag="div">
              <div
                v-for="member in groupMembers"
                :key="member.id"
                class="member-card"
                :class="{ 'is-leader': member.id === getCurrentUserId() }"
              >
                <div class="member-avatar-section">
                  <Avatar
                    :label="member.name.charAt(0).toUpperCase()"
                    size="xlarge"
                    shape="circle"
                    class="member-avatar"
                  />
                  <div v-if="member.id === getCurrentUserId()" class="leader-badge">
                    <i class="pi pi-crown"></i>
                  </div>
                </div>

                <div class="member-info">
                  <p class="member-name">{{ member.name }}</p>
                  <p class="member-email">{{ member.email }}</p>
                  <p v-if="member.distance" class="member-distance">
                    <i class="pi pi-map-marker"></i>
                    {{ member.distance.toFixed(2) }} km
                  </p>
                </div>

                <div class="member-actions">
                  <Button
                    v-if="member.id !== getCurrentUserId()"
                    icon="pi pi-trash"
                    severity="danger"
                    rounded
                    @click="confirmRemoveMember(member)"
                    class="btn-delete-member"
                    :title="`Eliminar ${member.name}`"
                  />
                  <Tag
                    v-else
                    :value="$t('calculate.groupMembers.leader')"
                    severity="success"
                  />
                </div>
              </div>
            </TransitionGroup>
          </div>

          <div v-if="memberCount >= 8" class="max-members-warning">
            <Message
              severity="warning"
              :text="$t('calculate.groupMembers.maxMembers')"
              class="w-full"
            />
          </div>
        </div>

        <div v-else class="empty-state">
          <i class="pi pi-inbox"></i>
          <p>{{ $t('calculate.groupMembers.noMembers') }}</p>
        </div>
      </template>

      <template #footer v-if="selectedGroup">
        <div class="group-action-buttons">
          <Button
            :label="$t('calculate.actionButtons.addMembers')"
            icon="pi pi-user-plus"
            severity="success"
            @click="openAddMembersDialog"
            :disabled="memberCount >= 8"
            class="btn-action"
          />
          <Button
            :label="$t('calculate.actionButtons.editRestaurant')"
            icon="pi pi-pencil"
            severity="info"
            @click="openSelectRestaurantDialog"
            class="btn-action"
          />
          <Button
            :label="$t('calculate.actionButtons.calculateAlt')"
            icon="pi pi-calculator"
            severity="warning"
            @click="calculateWithoutRecommendations"
            :disabled="!hasValidCalculation"
            class="btn-action"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import useCalculateStore from '../../../calculate/application/calculate.store.js';

import Card from 'primevue/card';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import Avatar from 'primevue/avatar';
import Tag from 'primevue/tag';
import ProgressBar from 'primevue/progressbar';
import Message from 'primevue/message';
import Tooltip from 'primevue/tooltip';

const confirm = useConfirm();
const toast = useToast();
const calculateStore = useCalculateStore();

const vTooltip = Tooltip;

const selectedGroup = computed(() => calculateStore.selectedGroup);
const groupMembers = computed(() => calculateStore.groupMembers);
const memberCount = computed(() => groupMembers.value.length);
const hasValidCalculation = computed(() => calculateStore.hasValidCalculation);
const isCurrentUserLeader = computed(() => calculateStore.isCurrentUserLeader);

function getCurrentUserId() {
  return parseInt(localStorage.getItem('userId')) || 0;
}

function openAddMembersDialog() {
  calculateStore.showAddMembersDialog = true;
}

function openSelectRestaurantDialog() {
  calculateStore.showSelectRestaurantDialog = true;
}

function calculateWithoutRecommendations() {
  calculateStore.calculateWithoutTop3();
  toast.add({
    severity: 'info',
    summary: 'Cálculo Alternativo',
    detail: 'Cálculo completado sin filtro de Top 3',
    life: 3000
  });
}

function confirmRemoveMember(member) {
  confirm.require({
    message: `¿Eliminar a ${member.name} del grupo?`,
    header: 'Confirmar Eliminación',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      console.log('Attempting to remove member:', member.id, member.name)
      const success = calculateStore.removeMember(member.id);
      console.log('Remove result:', success)

      if (success) {
        toast.add({
          severity: 'success',
          summary: 'Eliminado ✅',
          detail: `${member.name} ha sido eliminado del grupo`,
          life: 3000
        });
        console.log('Toast shown')
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar a ${member.name}`,
          life: 3000
        });
      }
    }
  });
}
</script>

<style scoped>
.cuadro-group {
  grid-column: 1 / -1;
  grid-row: 2;
}

.card-group {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  animation: slideInUp 0.6s ease 0.2s both;
}

.group-header {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: 700;
}

.group-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.group-header-left i {
  font-size: 1.5rem;
}

.member-count-badge {
  background: white;
  color: #3b82f6;
  font-weight: 700;
  font-size: 1.1rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.members-container {
  padding: 2rem;
}

.members-counter {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  border-radius: 12px;
}

.counter-label {
  grid-column: 1 / -1;
  font-weight: 600;
  color: #0369a1;
}

.counter-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #3b82f6;
}

.counter-bar {
  grid-column: 1 / -1;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.member-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 16px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  animation: memberFadeIn 0.4s ease;
}

.member-card:hover {
  transform: translateY(-5px);
  border-color: #3b82f6;
  box-shadow: 0 12px 35px rgba(59, 130, 246, 0.15);
}

.member-card.is-leader {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: #f59e0b;
}

.member-avatar-section {
  position: relative;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.member-avatar {
  background: linear-gradient(135deg, #ff9655 0%, #ff7f3d 100%) !important;
  color: white !important;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(255, 150, 85, 0.3);
}

.leader-badge {
  position: absolute;
  bottom: -8px;
  right: 0;
  background: #f59e0b;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  animation: bounce 0.6s ease infinite;
}

.member-info {
  text-align: center;
  margin-bottom: 1rem;
  flex: 1;
}

.member-name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
}

.member-email {
  margin: 0.3rem 0 0 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.member-distance {
  margin: 0.8rem 0 0 0;
  font-size: 0.9rem;
  color: #3b82f6;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.member-actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.btn-delete-member {
  border-color: rgba(220, 38, 38, 0.5);
  color: #dc2626;
  font-weight: 600;
  background: rgba(220, 38, 38, 0.1);
  border: 2px solid #dc2626;
  padding: 0.5rem !important;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-delete-member:hover {
  background-color: #dc2626 !important;
  color: white !important;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.btn-delete-member:active {
  transform: scale(0.95);
}

.max-members-warning {
  margin-top: 1.5rem;
}

.group-action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  padding: 2rem;
  background: #f9fafb;
  border-top: 2px solid #e5e7eb;
}

.btn-action {
  padding: 1rem 1.5rem !important;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
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

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
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

.member-enter-active,
.member-leave-active {
  transition: all 0.3s ease;
}

.member-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.member-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
