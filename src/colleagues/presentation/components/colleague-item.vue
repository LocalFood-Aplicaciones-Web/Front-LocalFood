<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
    colleague: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['edit', 'delete']);

function handleEdit() {
    emit('edit', props.colleague);
}

function handleDelete() {
    emit('delete', props.colleague);
}
</script>

<template>
    <div class="colleague-card">
        <div class="colleague-header">
            <div class="colleague-avatar">
                {{ colleague.name.charAt(0).toUpperCase() }}
            </div>
            <div class="colleague-info">
                <h3>{{ colleague.name }}</h3>
                <p class="email">{{ colleague.email }}</p>
            </div>
        </div>

        <div class="colleague-details">
            <div class="detail-item" v-if="colleague.phone">
                <span class="icon">📞</span>
                <span>{{ colleague.phone }}</span>
            </div>
            <div class="detail-item" v-if="colleague.address">
                <span class="icon">📍</span>
                <span>{{ colleague.address.street }}, {{ colleague.address.city }}</span>
            </div>
            <div class="detail-item" v-if="colleague.address">
                <span class="icon">🗺️</span>
                <span>{{ colleague.address.latitude.toFixed(4) }}, {{ colleague.address.longitude.toFixed(4) }}</span>
            </div>
        </div>

        <div class="colleague-actions">
            <button @click="handleEdit" class="btn-edit">
                {{ t('common.edit') }}
            </button>
            <button @click="handleDelete" class="btn-delete">
                {{ t('common.delete') }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.colleague-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.colleague-card:hover {
    box-shadow: 0 4px 16px rgba(255, 150, 85, 0.2);
    transform: translateY(-4px);
}

.colleague-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.colleague-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff9655, #ffb380);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 600;
}

.colleague-info h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
}

.colleague-info .email {
    margin: 0.25rem 0 0;
    color: #666;
    font-size: 0.9rem;
}

.colleague-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 1rem 0;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 8px;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #555;
}

.detail-item .icon {
    font-size: 1rem;
}

.colleague-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
}

.btn-edit, .btn-delete {
    flex: 1;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-edit {
    background-color: #ff9655;
    color: white;
}

.btn-edit:hover {
    background-color: #ff7f3d;
}

.btn-delete {
    background-color: #f5f5f5;
    color: #d32f2f;
}

.btn-delete:hover {
    background-color: #ffebee;
}
</style>
