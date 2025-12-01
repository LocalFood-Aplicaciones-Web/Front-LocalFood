<template>
  <div class="colleagues-page p-4">
    <Toast />
    <ConfirmDialog />
    
    <!-- Header con tabs -->
    <div class="page-header mb-4">
      <div>
        <h1 class="text-4xl font-bold text-900 mb-2">
          My Colleagues & Groups
          <Tag :value="`${colleagues.length} colleagues`" severity="info" class="ml-2" />
        </h1>
        <p class="text-600">
          <i class="pi pi-user text-primary"></i>
          You are viewing your personal workspace. Only you can see and manage these colleagues and groups.
        </p>
      </div>
      <div class="flex gap-2">
        <Button 
          label="New Group" 
          icon="pi pi-users" 
          severity="success"
          @click="openNewGroupDialog"
        />
        <Button 
          label="New Colleague" 
          icon="pi pi-user-plus" 
          @click="openNewColleagueDialog()"
        />
      </div>
    </div>

    <!-- Tabs -->
    <TabView v-model:activeIndex="activeTab" class="mb-4">
      <TabPanel header="All Colleagues">
        <div v-if="loading" class="flex justify-content-center p-5">
          <ProgressSpinner />
        </div>
        
        <div v-else-if="colleagues.length === 0" class="empty-state p-5 text-center">
          <i class="pi pi-users text-6xl text-400 mb-3"></i>
          <p class="text-xl text-600 mb-4">No colleagues yet</p>
          <Button label="Add Your First Colleague" icon="pi pi-plus" @click="showColleagueDialog = true" />
        </div>

        <div v-else class="colleagues-grid">
          <TransitionGroup name="card-list">
            <Card 
              v-for="colleague in colleagues" 
              :key="colleague.id"
              class="colleague-card"
            >
              <template #header>
                <div class="card-header" :style="{ background: getGroupColor(colleague.groupId) }">
                  <Avatar 
                    :label="colleague.name.charAt(0).toUpperCase()" 
                    size="xlarge" 
                    shape="circle"
                    class="colleague-avatar"
                  />
                </div>
              </template>
              <template #title>
                <div class="flex align-items-center justify-content-between">
                  <span>{{ colleague.name }}</span>
                  <Tag v-if="colleague.groupId" :value="getGroupName(colleague.groupId)" severity="info" />
                </div>
              </template>
              <template #content>
                <div class="colleague-info">
                  <div class="info-item">
                    <i class="pi pi-envelope"></i>
                    <span>{{ colleague.email }}</span>
                  </div>
                  <div class="info-item">
                    <i class="pi pi-phone"></i>
                    <span>{{ colleague.phone }}</span>
                  </div>
                  <div class="info-item">
                    <i class="pi pi-map-marker"></i>
                    <span>{{ colleague.address.city }}</span>
                  </div>
                </div>
              </template>
              <template #footer>
                <div class="flex gap-2">
                  <Button 
                    label="Edit" 
                    icon="pi pi-pencil" 
                    severity="info"
                    text
                    @click="editColleague(colleague)"
                  />
                  <Button 
                    label="Delete" 
                    icon="pi pi-trash" 
                    severity="danger"
                    text
                    @click="confirmDelete(colleague)"
                  />
                </div>
              </template>
            </Card>
          </TransitionGroup>
        </div>
      </TabPanel>

      <TabPanel header="By Groups">
        <div v-if="loading" class="flex justify-content-center p-5">
          <ProgressSpinner />
        </div>

        <div v-else class="groups-view">
          <Accordion :multiple="true" :activeIndex="[0]">
            <AccordionTab v-for="group in groups" :key="group.id">
              <template #header>
                <div class="flex align-items-center gap-3 w-full">
                  <div class="group-color-indicator" :style="{ background: group.color }"></div>
                  <span class="font-semibold">{{ group.name }}</span>
                  <Badge :value="getColleaguesByGroupCount(group.id)" class="ml-auto" />
                  <Button 
                    icon="pi pi-user-plus" 
                    text 
                    rounded 
                    severity="success"
                    v-tooltip.top="'Add colleague to this group'"
                    @click.stop="openNewColleagueDialog(group.id)"
                  />
                  <Button 
                    icon="pi pi-pencil" 
                    text 
                    rounded 
                    severity="info"
                    @click.stop="editGroup(group)"
                  />
                  <Button 
                    icon="pi pi-trash" 
                    text 
                    rounded 
                    severity="danger"
                    @click.stop="confirmDeleteGroup(group)"
                  />
                </div>
              </template>
              
              <p class="text-600 mb-3">{{ group.description }}</p>
              
              <div class="colleagues-grid">
                <Card 
                  v-for="colleague in getColleaguesByGroup(group.id)" 
                  :key="colleague.id"
                  class="colleague-card-compact"
                >
                  <template #content>
                    <div class="flex align-items-center gap-3">
                      <Avatar 
                        :label="colleague.name.charAt(0).toUpperCase()" 
                        size="large"
                        :style="{ background: group.color }"
                      />
                      <div class="flex-1">
                        <p class="font-semibold m-0">{{ colleague.name }}</p>
                        <p class="text-sm text-600 m-0">{{ colleague.email }}</p>
                      </div>
                      <Button 
                        icon="pi pi-pencil" 
                        text 
                        rounded 
                        @click="editColleague(colleague)"
                      />
                    </div>
                  </template>
                </Card>
              </div>
              
              <div v-if="getColleaguesByGroup(group.id).length === 0" class="text-center p-4 text-600">
                <i class="pi pi-inbox text-4xl mb-2"></i>
                <p class="mb-3">No colleagues in this group yet</p>
                <Button 
                  label="Add First Colleague" 
                  icon="pi pi-user-plus" 
                  severity="success"
                  outlined
                  @click="openNewColleagueDialog(group.id)"
                />
              </div>
            </AccordionTab>
          </Accordion>

          <!-- Colleagues without group -->
          <Card v-if="colleaguesWithoutGroup.length > 0" class="mt-4">
            <template #title>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-users"></i>
                <span>Unassigned Colleagues</span>
                <Badge :value="colleaguesWithoutGroup.length" severity="warning" />
              </div>
            </template>
            <template #content>
              <div class="colleagues-grid">
                <Card 
                  v-for="colleague in colleaguesWithoutGroup" 
                  :key="colleague.id"
                  class="colleague-card-compact"
                >
                  <template #content>
                    <div class="flex align-items-center gap-3">
                      <Avatar 
                        :label="colleague.name.charAt(0).toUpperCase()" 
                        size="large"
                      />
                      <div class="flex-1">
                        <p class="font-semibold m-0">{{ colleague.name }}</p>
                        <p class="text-sm text-600 m-0">{{ colleague.email }}</p>
                      </div>
                      <Button 
                        icon="pi pi-pencil" 
                        text 
                        rounded 
                        @click="editColleague(colleague)"
                      />
                    </div>
                  </template>
                </Card>
              </div>
            </template>
          </Card>
        </div>
      </TabPanel>
    </TabView>

    <!-- Colleague Dialog -->
    <Dialog 
      v-model:visible="showColleagueDialog" 
      :header="editingColleague ? 'Edit Colleague' : 'New Colleague'"
      :modal="true"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <div class="flex flex-column gap-3 pt-3">
        <div class="flex flex-column gap-2">
          <label for="name">Name *</label>
          <InputText id="name" v-model="colleagueForm.name" placeholder="Enter full name" />
        </div>

        <div class="flex flex-column gap-2">
          <label for="email">Email *</label>
          <InputText id="email" v-model="colleagueForm.email" type="email" placeholder="email@example.com" />
        </div>

        <div class="flex flex-column gap-2">
          <label for="phone">Phone *</label>
          <InputText id="phone" v-model="colleagueForm.phone" placeholder="+1 555-0100" />
        </div>

        <div class="flex flex-column gap-2">
          <label for="group">Group</label>
          <Dropdown 
            id="group"
            v-model="colleagueForm.groupId" 
            :options="groups" 
            optionLabel="name" 
            optionValue="id"
            placeholder="Select a group" 
            showClear
          />
        </div>

        <Divider />

        <h4 class="m-0">Address</h4>

        <div class="grid">
          <div class="col-12 md:col-6">
            <div class="flex flex-column gap-2">
              <label for="street">Street *</label>
              <InputText id="street" v-model="colleagueForm.address.street" placeholder="123 Main St" />
            </div>
          </div>
          <div class="col-12 md:col-6">
            <div class="flex flex-column gap-2">
              <label for="city">City *</label>
              <InputText id="city" v-model="colleagueForm.address.city" placeholder="New York" />
            </div>
          </div>
          <div class="col-12 md:col-6">
            <div class="flex flex-column gap-2">
              <label for="latitude">Latitude *</label>
              <InputNumber id="latitude" v-model="colleagueForm.address.latitude" :minFractionDigits="4" />
            </div>
          </div>
          <div class="col-12 md:col-6">
            <div class="flex flex-column gap-2">
              <label for="longitude">Longitude *</label>
              <InputNumber id="longitude" v-model="colleagueForm.address.longitude" :minFractionDigits="4" />
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" severity="secondary" @click="showColleagueDialog = false" />
        <Button :label="editingColleague ? 'Update' : 'Create'" @click="saveColleague" />
      </template>
    </Dialog>

    <!-- Group Dialog -->
    <Dialog 
      v-model:visible="showGroupDialog" 
      :header="editingGroup ? 'Edit Group' : 'New Group'"
      :modal="true"
      :style="{ width: '30rem' }"
    >
      <div class="flex flex-column gap-3 pt-3">
        <div class="flex flex-column gap-2">
          <label for="groupName">Group Name *</label>
          <InputText id="groupName" v-model="groupForm.name" placeholder="e.g., Marketing Team" />
        </div>

        <div class="flex flex-column gap-2">
          <label for="groupDesc">Description</label>
          <Textarea id="groupDesc" v-model="groupForm.description" rows="3" placeholder="Brief description..." />
        </div>

        <div class="flex flex-column gap-2">
          <label for="groupColor">Color</label>
          <ColorPicker id="groupColor" v-model="groupForm.color" />
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" severity="secondary" @click="showGroupDialog = false" />
        <Button :label="editingGroup ? 'Update' : 'Create'" @click="saveGroup" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import useColleaguesStore from '../../application/colleagues.store.js';

import Button from 'primevue/button';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import ColorPicker from 'primevue/colorpicker';
import Avatar from 'primevue/avatar';
import Tag from 'primevue/tag';
import Badge from 'primevue/badge';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Divider from 'primevue/divider';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import ProgressSpinner from 'primevue/progressspinner';

const store = useColleaguesStore();
const confirm = useConfirm();
const toast = useToast();

const activeTab = ref(0);
const showColleagueDialog = ref(false);
const showGroupDialog = ref(false);
const editingColleague = ref(null);
const editingGroup = ref(null);

const colleagueForm = ref({
  name: '',
  email: '',
  phone: '',
  groupId: null,
  address: {
    street: '',
    city: '',
    latitude: 0,
    longitude: 0
  }
});

const groupForm = ref({
  name: '',
  description: '',
  color: 'FF6B6B'
});

const loading = computed(() => store.isLoading);
const colleagues = computed(() => store.colleagues);
const groups = computed(() => store.groups);
const colleaguesWithoutGroup = computed(() => store.colleaguesWithoutGroup);

onMounted(async () => {
  console.log('🚀 MOUNTED - Component loading...');
  
  // Load from localStorage first for instant display
  store.loadFromLocalStorage();
  console.log('💾 MOUNTED - Loaded from localStorage:', {
    colleagues: colleagues.value.length,
    groups: groups.value.length
  });
  
  // Then fetch fresh data from API in background
  console.log('🌐 MOUNTED - Fetching from API...');
  await Promise.all([
    store.fetchColleagues(),
    store.fetchGroups()
  ]);
  console.log('✅ MOUNTED - API data loaded:', {
    colleagues: colleagues.value.length,
    groups: groups.value.length
  });
  console.log('👥 MOUNTED - Colleagues with groups:', colleagues.value.filter(c => c.groupId));
});

function getGroupColor(groupId) {
  if (!groupId) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  const group = groups.value.find(g => g.id == groupId); // Usar == para comparación flexible
  return group ? `linear-gradient(135deg, ${group.color} 0%, ${group.color}dd 100%)` : '#ccc';
}

function getGroupName(groupId) {
  const group = groups.value.find(g => g.id == groupId); // Usar == para comparación flexible
  return group ? group.name : 'No Group';
}

function getColleaguesByGroup(groupId) {
  const filtered = colleagues.value.filter(c => c.groupId == groupId);
  return filtered;
}

function getColleaguesByGroupCount(groupId) {
  return getColleaguesByGroup(groupId).length;
}

function openNewColleagueDialog(preselectedGroupId = null) {
  editingColleague.value = null;
  resetColleagueForm();
  if (preselectedGroupId !== null) {
    colleagueForm.value.groupId = preselectedGroupId;
  }
  showColleagueDialog.value = true;
}

function editColleague(colleague) {
  editingColleague.value = colleague;
  colleagueForm.value = {
    name: colleague.name,
    email: colleague.email,
    phone: colleague.phone,
    groupId: colleague.groupId,
    address: { ...colleague.address }
  };
  showColleagueDialog.value = true;
}

async function saveColleague() {
  try {
    if (editingColleague.value) {
      await store.updateColleague(editingColleague.value.id, colleagueForm.value);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Colleague updated', life: 3000 });
    } else {
      await store.addColleague(colleagueForm.value);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Colleague added', life: 3000 });
    }
    
    // Recargar datos inmediatamente después de guardar
    await Promise.all([
      store.fetchColleagues(),
      store.fetchGroups()
    ]);
    
    showColleagueDialog.value = false;
    resetColleagueForm();
  } catch (error) {
    console.error('❌ SAVE ERROR:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
  }
}

function confirmDelete(colleague) {
  confirm.require({
    message: `Are you sure you want to delete ${colleague.name}?`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      await store.deleteColleague(colleague.id);
      toast.add({ severity: 'success', summary: 'Deleted', detail: 'Colleague deleted', life: 3000 });
    }
  });
}

function openNewGroupDialog() {
  editingGroup.value = null;
  resetGroupForm();
  showGroupDialog.value = true;
}

function editGroup(group) {
  editingGroup.value = group;
  groupForm.value = {
    name: group.name,
    description: group.description,
    color: group.color
  };
  showGroupDialog.value = true;
}

async function saveGroup() {
  try {
    const groupData = {
      ...groupForm.value,
      color: `#${groupForm.value.color}`
    };

    if (editingGroup.value) {
      await store.updateGroup(editingGroup.value.id, groupData);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Group updated', life: 3000 });
    } else {
      await store.addGroup(groupData);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Group created', life: 3000 });
    }
    showGroupDialog.value = false;
    resetGroupForm();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
  }
}

function confirmDeleteGroup(group) {
  confirm.require({
    message: `Delete group "${group.name}"? Colleagues will be unassigned.`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      await store.deleteGroup(group.id);
      toast.add({ severity: 'success', summary: 'Deleted', detail: 'Group deleted', life: 3000 });
    }
  });
}

function resetColleagueForm() {
  editingColleague.value = null;
  colleagueForm.value = {
    name: '',
    email: '',
    phone: '',
    groupId: null,
    address: { street: '', city: '', latitude: 0, longitude: 0 }
  };
}

function resetGroupForm() {
  editingGroup.value = null;
  groupForm.value = {
    name: '',
    description: '',
    color: 'FF6B6B'
  };
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.colleagues-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.colleague-card {
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease;
}

.colleague-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px 12px 0 0;
}

.colleague-avatar {
  background: white !important;
  color: var(--primary-color) !important;
  font-weight: bold;
}

.colleague-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color-secondary);
}

.info-item i {
  color: var(--primary-color);
}

.colleague-card-compact {
  animation: fadeInUp 0.5s ease;
}

.group-color-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-list-enter-active,
.card-list-leave-active {
  transition: all 0.5s ease;
}

.card-list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.card-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.card-list-move {
  transition: transform 0.5s ease;
}

.empty-state {
  background: var(--surface-ground);
  border-radius: 12px;
  padding: 3rem;
}

@media (max-width: 768px) {
  .colleagues-grid {
    grid-template-columns: 1fr;
  }
}
</style>
