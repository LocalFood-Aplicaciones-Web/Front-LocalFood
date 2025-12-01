<script setup>
import { ref, onMounted } from 'vue';
import useColleaguesStore from '../../application/colleagues.store.js';
import ColleagueItem from '../components/colleague-item.vue';
import ColleagueForm from '../components/colleague-form.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const colleaguesStore = useColleaguesStore();
const showForm = ref(false);
const editingColleague = ref(null);

onMounted(async () => {
    await colleaguesStore.fetchColleagues();
});

function handleAddNew() {
    editingColleague.value = null;
    showForm.value = true;
}

function handleEdit(colleague) {
    editingColleague.value = colleague;
    showForm.value = true;
}

function handleFormClose() {
    showForm.value = false;
    editingColleague.value = null;
}

async function handleDelete(colleague) {
    if (confirm(t('colleagues.confirmDelete', { name: colleague.name }))) {
        await colleaguesStore.deleteColleague(colleague.id);
    }
}
</script>

<template>
    <div class="colleagues-page">
        <div class="colleagues-header">
            <div>
                <h1>{{ t('colleagues.title') }}</h1>
                <p class="page-subtitle">Manage your team members and their locations</p>
            </div>
            <button @click="handleAddNew" class="btn-primary">
                <span class="icon">+</span>
                {{ t('colleagues.addNew') }}
            </button>
        </div>

        <div v-if="colleaguesStore.isLoading" class="loading">
            <div class="loading-spinner"></div>
            <p>{{ t('common.loading') }}</p>
        </div>

        <div v-else-if="colleaguesStore.errors.length > 0" class="error-message">
            {{ t('errors.occurred') }}
        </div>

        <div v-else class="colleagues-list">
            <div v-if="colleaguesStore.colleagues.length === 0" class="empty-state">
                <span class="empty-icon">📭</span>
                <p>{{ t('colleagues.noColleagues') }}</p>
                <button @click="handleAddNew" class="btn-secondary">
                    {{ t('colleagues.addNew') }}
                </button>
            </div>
            <ColleagueItem
                v-for="colleague in colleaguesStore.colleagues"
                :key="colleague.id"
                :colleague="colleague"
                @edit="handleEdit"
                @delete="handleDelete"
            />
        </div>

        <ColleagueForm
            v-if="showForm"
            :colleague="editingColleague"
            @close="handleFormClose"
        />
    </div>
</template>

<style scoped>
.colleagues-page {
    max-width: 1400px;
    margin: 0 auto;
}

.colleagues-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.colleagues-header h1 {
    font-size: 2rem;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.btn-primary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #ff9655;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    background-color: #ff7f3d;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(255, 150, 85, 0.3);
}

.icon {
    font-size: 1.2rem;
}

.colleagues-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.loading, .error-message, .empty-state {
    text-align: center;
    padding: 3rem;
    color: #666;
    font-size: 1.1rem;
}

.error-message {
    color: #d32f2f;
}

.empty-state p {
    color: #999;
}
</style>
