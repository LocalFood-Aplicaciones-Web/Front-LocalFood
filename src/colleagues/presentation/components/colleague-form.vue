<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useColleaguesStore from '../../application/colleagues.store.js';

const { t } = useI18n();
const colleaguesStore = useColleaguesStore();

const props = defineProps({
    colleague: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['close']);

const formData = ref({
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

const isEdit = ref(false);

watch(() => props.colleague, (newValue) => {
    if (newValue) {
        isEdit.value = true;
        formData.value = {
            ...newValue,
            address: { ...newValue.address }
        };
    } else {
        isEdit.value = false;
        resetForm();
    }
}, { immediate: true });

function resetForm() {
    formData.value = {
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

async function handleSubmit() {
    let success = false;
    
    if (isEdit.value) {
        success = await colleaguesStore.updateColleague({
            id: props.colleague.id,
            ...formData.value
        });
    } else {
        success = await colleaguesStore.addColleague(formData.value);
    }

    if (success) {
        emit('close');
    }
}

function handleClose() {
    emit('close');
}
</script>

<template>
    <div class="modal-overlay" @click.self="handleClose">
        <div class="modal-content">
            <div class="modal-header">
                <h2>{{ isEdit ? t('colleagues.editColleague') : t('colleagues.addNew') }}</h2>
                <button @click="handleClose" class="btn-close">&times;</button>
            </div>

            <form @submit.prevent="handleSubmit" class="colleague-form">
                <div class="form-group">
                    <label for="name">{{ t('colleagues.name') }} *</label>
                    <input
                        id="name"
                        v-model="formData.name"
                        type="text"
                        required
                        :placeholder="t('colleagues.namePlaceholder')"
                    />
                </div>

                <div class="form-group">
                    <label for="email">{{ t('colleagues.email') }} *</label>
                    <input
                        id="email"
                        v-model="formData.email"
                        type="email"
                        required
                        :placeholder="t('colleagues.emailPlaceholder')"
                    />
                </div>

                <div class="form-group">
                    <label for="phone">{{ t('colleagues.phone') }}</label>
                    <input
                        id="phone"
                        v-model="formData.phone"
                        type="tel"
                        :placeholder="t('colleagues.phonePlaceholder')"
                    />
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="street">{{ t('colleagues.street') }}</label>
                        <input
                            id="street"
                            v-model="formData.address.street"
                            type="text"
                            :placeholder="t('colleagues.streetPlaceholder')"
                        />
                    </div>

                    <div class="form-group">
                        <label for="city">{{ t('colleagues.city') }}</label>
                        <input
                            id="city"
                            v-model="formData.address.city"
                            type="text"
                            :placeholder="t('colleagues.cityPlaceholder')"
                        />
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="latitude">{{ t('colleagues.latitude') }} *</label>
                        <input
                            id="latitude"
                            v-model.number="formData.address.latitude"
                            type="number"
                            step="0.000001"
                            required
                            :placeholder="t('colleagues.latitudePlaceholder')"
                        />
                    </div>

                    <div class="form-group">
                        <label for="longitude">{{ t('colleagues.longitude') }} *</label>
                        <input
                            id="longitude"
                            v-model.number="formData.address.longitude"
                            type="number"
                            step="0.000001"
                            required
                            :placeholder="t('colleagues.longitudePlaceholder')"
                        />
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" @click="handleClose" class="btn-cancel">
                        {{ t('common.cancel') }}
                    </button>
                    <button type="submit" class="btn-submit">
                        {{ isEdit ? t('common.update') : t('common.add') }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
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
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
}

.btn-close {
    background: none;
    border: none;
    font-size: 2rem;
    color: #999;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    width: 32px;
    height: 32px;
}

.btn-close:hover {
    color: #333;
}

.colleague-form {
    padding: 1.5rem;
}

.form-group {
    margin-bottom: 1.25rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #555;
    font-weight: 500;
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.form-group input:focus {
    outline: none;
    border-color: #ff9655;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #e0e0e0;
}

.btn-cancel, .btn-submit {
    flex: 1;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-cancel {
    background-color: #f5f5f5;
    color: #666;
}

.btn-cancel:hover {
    background-color: #e0e0e0;
}

.btn-submit {
    background-color: #ff9655;
    color: white;
}

.btn-submit:hover {
    background-color: #ff7f3d;
}
</style>
