<template>
  <Dialog
    v-model:visible="showAddMembersDialog"
    :header="$t('calculate.actionButtons.addMembers')"
    :modal="true"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <div class="dialog-content">
      <p class="text-600 mb-4">Selecciona colegas para agregar al grupo</p>

      <div class="colleagues-list">
        <div
          v-for="colleague in availableColleagues"
          :key="colleague.id"
          class="colleague-selection-item"
          @click="toggleColleagueSelection(colleague)"
        >
          <Checkbox
            :modelValue="isColleagueSelected(colleague.id)"
            @update:modelValue="toggleColleagueSelection(colleague)"
            :binary="true"
          />
          <Avatar
            :label="colleague.name.charAt(0).toUpperCase()"
            size="large"
            shape="circle"
          />
          <div class="colleague-info">
            <p class="colleague-name">{{ colleague.name }}</p>
            <p class="colleague-email">{{ colleague.email }}</p>
          </div>
        </div>
      </div>

      <div v-if="availableColleagues.length === 0" class="empty-state">
        <p>No hay más colegas disponibles</p>
      </div>
    </div>

    <template #footer>
      <Button label="Cancelar" severity="secondary" @click="closeDialog" />
      <Button label="Agregar Seleccionados" @click="addSelectedColleagues" />
    </template>
  </Dialog>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import useCalculateStore from '../../../calculate/application/calculate.store.js';
import useColleaguesStore from '../../../colleagues/application/colleagues.store.js';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Avatar from 'primevue/avatar';

const toast = useToast();
const calculateStore = useCalculateStore();
const colleaguesStore = useColleaguesStore();

// Usar el estado del store
const showAddMembersDialog = computed({
  get: () => calculateStore.showAddMembersDialog,
  set: (value) => {
    calculateStore.showAddMembersDialog = value;
  }
});

// Estado local para selección
const selectedColleaguesForAdd = ref(new Set());

// Datos del store
const allColleagues = computed(() => colleaguesStore.colleagues);
const groupMembers = computed(() => calculateStore.groupMembers);

// Colegas disponibles (no están en el grupo)
const availableColleagues = computed(() => {
  const addedIds = new Set(groupMembers.value.map(m => m.id));
  return allColleagues.value.filter(c => !addedIds.has(c.id));
});

// Métodos
function isColleagueSelected(colleagueId) {
  return selectedColleaguesForAdd.value.has(colleagueId);
}

function toggleColleagueSelection(colleague) {
  if (isColleagueSelected(colleague.id)) {
    selectedColleaguesForAdd.value.delete(colleague.id);
  } else {
    selectedColleaguesForAdd.value.add(colleague.id);
  }
}

function addSelectedColleagues() {
  if (selectedColleaguesForAdd.value.size === 0) {
    toast.add({
      severity: 'warning',
      summary: 'Sin Selección',
      detail: 'Selecciona al menos un colega',
      life: 3000
    });
    return;
  }

  // Agregar colegas al grupo
  const selectedIds = Array.from(selectedColleaguesForAdd.value);
  const selectedColleaguesData = allColleagues.value.filter(c => selectedIds.includes(c.id));

  selectedColleaguesData.forEach(colleague => {
    calculateStore.groupMembers.push(colleague);
  });

  toast.add({
    severity: 'success',
    summary: 'Agregado',
    detail: `${selectedIds.length} colega(s) agregado(s) al grupo`,
    life: 3000
  });

  closeDialog();
}

function closeDialog() {
  calculateStore.showAddMembersDialog = false;
  selectedColleaguesForAdd.value.clear();
}
</script>

<style scoped>
.dialog-content {
  padding: 1rem;
}

.colleagues-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.colleague-selection-item {
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

.colleague-selection-item:hover {
  background: #f3f4f6;
  border-color: #ff9655;
  transform: translateX(5px);
}

.colleague-info {
  flex: 1;
}

.colleague-name {
  margin: 0;
  font-weight: 600;
  color: #1f2937;
}

.colleague-email {
  margin: 0.3rem 0 0 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #9ca3af;
}
</style>
