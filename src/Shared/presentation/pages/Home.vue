<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import useColleaguesStore from '../../../colleagues/application/colleagues.store.js';

const { t } = useI18n();
const router = useRouter();
const colleaguesStore = useColleaguesStore();

const showAddColleagueModal = ref(false);
const newColleague = ref({
    name: '',
    email: '',
    phone: '',
    address: {
        street: '',
        city: '',
        latitude: 0,
        longitude: 0
    }
});

onMounted(() => {
    // Load from localStorage first for instant display
    colleaguesStore.loadFromLocalStorage();
    
    // Then fetch fresh data from API in background (no await)
    colleaguesStore.fetchColleagues();
});

const stats = computed(() => [
    {
        icon: '👥',
        label: t('colleagues.title'),
        value: colleaguesStore.colleagues.length,
        color: '#ff9655',
        route: 'colleagues'
    },
    {
        icon: '🍴',
        label: t('restaurants.title'),
        value: 6,
        color: '#4caf50',
        route: 'restaurantes'
    },
    {
        icon: '📍',
        label: 'Recent Calculations',
        value: 0,
        color: '#2196f3',
        route: 'calculo'
    }
]);

const recentColleagues = computed(() => {
    return colleaguesStore.colleagues.slice(0, 4);
});

const quickActions = [
    {
        icon: '➕',
        label: t('colleagues.addNew'),
        action: () => showAddColleagueModal.value = true,
        color: '#ff9655'
    },
    {
        icon: '🍽️',
        label: 'Add Restaurant',
        action: () => router.push({ name: 'restaurantes' }),
        color: '#4caf50'
    },
    {
        icon: '🧮',
        label: t('calculate.title'),
        action: () => router.push({ name: 'calculo' }),
        color: '#2196f3'
    }
];

async function handleAddColleague() {
    const success = await colleaguesStore.addColleague(newColleague.value);
    if (success) {
        showAddColleagueModal.value = false;
        resetForm();
    }
}

function resetForm() {
    newColleague.value = {
        name: '',
        email: '',
        phone: '',
        address: {
            street: '',
            city: '',
            latitude: 0,
            longitude: 0
        }
    };
}

function navigateTo(routeName) {
    router.push({ name: routeName });
}
</script>

<template>
    <div class="dashboard">
        <div class="dashboard-header">
            <div>
                <h1>{{ t('home.title') }}</h1>
                <p>{{ t('home.content') }}</p>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
            <div 
                v-for="stat in stats" 
                :key="stat.label"
                class="stat-card"
                @click="navigateTo(stat.route)"
            >
                <div class="stat-icon" :style="{ background: stat.color }">
                    {{ stat.icon }}
                </div>
                <div class="stat-content">
                    <p class="stat-label">{{ stat.label }}</p>
                    <h2 class="stat-value">{{ stat.value }}</h2>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <section class="quick-actions">
            <h2 class="section-title">Quick Actions</h2>
            <div class="actions-grid">
                <button
                    v-for="action in quickActions"
                    :key="action.label"
                    @click="action.action"
                    class="action-card"
                    :style="{ borderColor: action.color }"
                >
                    <span class="action-icon" :style="{ background: action.color }">
                        {{ action.icon }}
                    </span>
                    <span class="action-label">{{ action.label }}</span>
                </button>
            </div>
        </section>

        <!-- Recent Colleagues -->
        <section class="recent-section">
            <div class="section-header">
                <h2 class="section-title">Recent Colleagues</h2>
                <button @click="navigateTo('colleagues')" class="view-all-btn">
                    View All →
                </button>
            </div>
            <div class="colleagues-grid" v-if="recentColleagues.length > 0">
                <div 
                    v-for="colleague in recentColleagues" 
                    :key="colleague.id"
                    class="colleague-mini-card"
                    @click="navigateTo('colleagues')"
                >
                    <div class="colleague-avatar">
                        {{ colleague.name.charAt(0).toUpperCase() }}
                    </div>
                    <div class="colleague-info">
                        <h4>{{ colleague.name }}</h4>
                        <p>{{ colleague.email }}</p>
                    </div>
                </div>
            </div>
            <div v-else class="empty-state">
                <p>No colleagues yet. Add your first one!</p>
            </div>
        </section>

        <!-- Add Colleague Modal -->
        <div v-if="showAddColleagueModal" class="modal-overlay" @click.self="showAddColleagueModal = false">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>{{ t('colleagues.addNew') }}</h2>
                    <button @click="showAddColleagueModal = false" class="btn-close">&times;</button>
                </div>
                <form @submit.prevent="handleAddColleague" class="quick-form">
                    <div class="form-group">
                        <label>{{ t('colleagues.name') }} *</label>
                        <input v-model="newColleague.name" type="text" required />
                    </div>
                    <div class="form-group">
                        <label>{{ t('colleagues.email') }} *</label>
                        <input v-model="newColleague.email" type="email" required />
                    </div>
                    <div class="form-group">
                        <label>{{ t('colleagues.phone') }}</label>
                        <input v-model="newColleague.phone" type="tel" />
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>{{ t('colleagues.latitude') }} *</label>
                            <input v-model.number="newColleague.address.latitude" type="number" step="0.000001" required />
                        </div>
                        <div class="form-group">
                            <label>{{ t('colleagues.longitude') }} *</label>
                            <input v-model.number="newColleague.address.longitude" type="number" step="0.000001" required />
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" @click="showAddColleagueModal = false" class="btn-cancel">
                            {{ t('common.cancel') }}
                        </button>
                        <button type="submit" class="btn-submit">
                            {{ t('common.add') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dashboard {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
}

.dashboard-header {
    margin-bottom: 2rem;
}

.dashboard-header h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
}

.dashboard-header p {
    color: var(--text-secondary);
    font-size: 1rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    display: flex;
    align-items: center;
    gap: 1.5rem;
    cursor: pointer;
    transition: all var(--transition-normal);
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
}

.stat-icon {
    width: 64px;
    height: 64px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
}

.stat-content {
    flex: 1;
}

.stat-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin: 0 0 0.5rem 0;
}

.stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
}

.quick-actions {
    margin-bottom: 2rem;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 1.5rem 0;
}

.actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.action-card {
    background: white;
    padding: 1.5rem;
    border-radius: var(--radius-lg);
    border: 2px solid;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    transition: all var(--transition-normal);
}

.action-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
}

.action-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
}

.action-label {
    font-weight: 600;
    color: var(--text-primary);
}

.recent-section {
    background: white;
    padding: 1.5rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.view-all-btn {
    padding: 0.5rem 1rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.view-all-btn:hover {
    background: var(--primary-hover);
}

.colleagues-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.colleague-mini-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.colleague-mini-card:hover {
    border-color: var(--primary-color);
    background: var(--background-light);
}

.colleague-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: 600;
}

.colleague-info h4 {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    color: var(--text-primary);
}

.colleague-info p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.empty-state {
    text-align: center;
    padding: 3rem;
    color: var(--text-muted);
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: var(--radius-lg);
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--shadow-lg);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
}

.btn-close {
    background: none;
    border: none;
    font-size: 2rem;
    color: var(--text-muted);
    cursor: pointer;
    line-height: 1;
    width: 32px;
    height: 32px;
}

.btn-close:hover {
    color: var(--text-primary);
}

.quick-form {
    padding: 1.5rem;
}

.form-group {
    margin-bottom: 1.25rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
    font-weight: 500;
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    font-size: 1rem;
}

.form-group input:focus {
    outline: none;
    border-color: var(--primary-color);
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
}

.btn-cancel,
.btn-submit {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.btn-cancel {
    background: var(--background-dark);
    color: var(--text-primary);
}

.btn-cancel:hover {
    background: var(--border-color);
}

.btn-submit {
    background: var(--primary-color);
    color: white;
}

.btn-submit:hover {
    background: var(--primary-hover);
}

@media (max-width: 768px) {
    .dashboard {
        padding: 1rem;
    }

    .stats-grid,
    .actions-grid,
    .colleagues-grid {
        grid-template-columns: 1fr;
    }

    .form-row {
        grid-template-columns: 1fr;
    }
}
</style>