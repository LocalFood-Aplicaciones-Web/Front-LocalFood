<script setup>
import {useI18n} from "vue-i18n";
import useSubscriptionsStore from "../../application/subscriptions.store.js";
import {onMounted, ref, computed} from "vue";
import {useConfirm} from "primevue";
import {useRouter} from "vue-router";
import {storeToRefs} from "pinia"; // IMPORTANTE

const {t} = useI18n();
const confirm = useConfirm();
const router = useRouter();
const store = useSubscriptionsStore();

// 1. Extraer estado con storeToRefs
const {
  currentMembership,
  membershipLoaded
} = storeToRefs(store);

// 2. Extraer acciones directamente
const {
  fetchCurrentMembership,
  cancelMembership
} = store;

const isProcessing = ref(false);

onMounted(() => {
  if (!membershipLoaded.value) fetchCurrentMembership();
});

const membershipStatus = computed(() => {
  const status = currentMembership.value?.status;
  switch (status) {
    case 'active': return t('memberships.status-active');
    case 'pending': return t('memberships.status-pending');
    case 'canceled': return t('memberships.status-canceled');
    default: return t('memberships.status-none');
  }
});

const confirmCancellation = () => {
  confirm.require({
    message: t('memberships.confirm-cancel'),
    header: t('memberships.cancel-header'),
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      isProcessing.value = true;
      try {
        await cancelMembership();
      } catch (e) {
        console.error("Cancellation failed:", e);
      } finally {
        isProcessing.value = false;
      }
    },
  });
};

const navigateToChangePlan = () => {
  router.push({name: 'subscriptions-plans'});
};
</script>

<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-8">{{ t('memberships.title') }}</h1>

    <div v-if="!membershipLoaded">
      <pv-progress-spinner />
    </div>

    <div v-else-if="currentMembership"
         class="bg-white p-6 rounded-xl shadow-lg max-w-2xl">

      <h2 class="text-xl font-semibold mb-4">{{ t('memberships.current-plan-details') }}</h2>

      <div class="space-y-3">
        <p><strong>{{ t('memberships.plan-name') }}:</strong>
          <span class="font-medium text-lg">{{ currentMembership.plan.name }}</span></p>

        <p><strong>{{ t('memberships.status') }}:</strong>
          <pv-tag :severity="currentMembership.status === 'active' ? 'success' : 'warning'">
            {{ membershipStatus }}
          </pv-tag>
        </p>

        <p><strong>{{ t('memberships.renewal-date') }}:</strong>
          {{ currentMembership.renewalDate || t('memberships.not-applicable') }}</p>
      </div>

      <h3 class="text-lg font-semibold mt-6 mb-3">{{ t('memberships.included-features') }}</h3>
      <ul class="list-disc list-inside space-y-1 ml-4">
        <li v-for="feature in currentMembership.plan.features" :key="feature">{{ feature }}</li>
      </ul>

      <div class="mt-8 flex gap-3">
        <pv-button
            :label="t('memberships.change-plan-button')"
            icon="pi pi-refresh"
            severity="info"
            @click="navigateToChangePlan"
        />
        <pv-button
            :label="t('memberships.cancel-button')"
            icon="pi pi-times"
            severity="danger"
            :loading="isProcessing"
            :disabled="!currentMembership.id || currentMembership.status !== 'active'"
            @click="confirmCancellation"
        />
      </div>

    </div>

    <div v-else class="text-center p-10 border rounded-lg bg-white max-w-2xl">
      <p class="text-lg">{{ t('memberships.no-active-membership') }}</p>
      <pv-button :label="t('memberships.view-plans')" class="mt-4" @click="navigateToChangePlan"/>
    </div>
    <pv-confirm-dialog />
  </div>
</template>

<style scoped>
</style>