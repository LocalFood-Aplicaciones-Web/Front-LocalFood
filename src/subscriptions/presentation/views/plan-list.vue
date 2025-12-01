<script setup>
import {useI18n} from "vue-i18n";
import useSubscriptionsStore from "../../application/subscriptions.store.js";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {useConfirm} from "primevue";
import {storeToRefs} from "pinia";

const {t} = useI18n();
const router = useRouter();
const confirm = useConfirm();
const store = useSubscriptionsStore();

// 1. Estado Reactivo
const {
  plans,
  plansLoaded,
  currentMembership,
  hasActiveMembership,
  currentPlanName
} = storeToRefs(store);

// 2. Acciones
const {
  fetchPlans,
  subscribeToPlan,
  changePlan,
  fetchCurrentMembership
} = store;

const isProcessing = ref(false);

onMounted(() => {
  if (!plansLoaded.value) fetchPlans();
  fetchCurrentMembership();
});

const getButtonProps = (plan) => {
  const isCurrentPlan = currentMembership.value?.planId === plan.id;
  const isActive = hasActiveMembership.value;

  if (isCurrentPlan) {
    return {
      label: t('subscriptions.managing-plan'),
      action: () => navigateToDetails(),
      severity: 'success',
      disabled: isProcessing.value
    };
  } else if (isActive) {
    return {
      label: t('subscriptions.change-plan'),
      action: () => handleTransaction(plan.id, 'change'),
      severity: 'info',
      disabled: isProcessing.value
    };
  } else {
    return {
      label: t('subscriptions.start'),
      action: () => handleTransaction(plan.id, 'subscribe'),
      severity: 'primary',
      disabled: isProcessing.value
    };
  }
};

const handleTransaction = async (planId, type) => {
  const planName = plans.value.find(p => p.id === planId)?.name;
  const message = type === 'subscribe'
      ? t('subscriptions.confirm-subscribe', {plan: planName})
      : t('subscriptions.confirm-change', {plan: planName});

  confirm.require({
    message: message,
    header: t('subscriptions.confirm-header'),
    icon: 'pi pi-info-circle',
    accept: async () => {
      isProcessing.value = true;
      try {
        if (type === 'subscribe') {
          await subscribeToPlan(planId);
        } else if (type === 'change') {
          await changePlan(planId);
        }
      } catch (e) {
        console.error("Transaction failed:", e);
      } finally {
        isProcessing.value = false;
      }
    },
  });
};

const navigateToDetails = () => {
  router.push({name: 'subscriptions-details'});
};
</script>

<template>
  <div class="subscriptions-container">
    <h1 class="title">{{ t('subscriptions.title') }}</h1>

    <p v-if="hasActiveMembership" class="current-status">
      {{ t('subscriptions.current-plan-is', { plan: currentPlanName }) }}
    </p>

    <!-- Spinner -->
    <div v-if="!plansLoaded" class="loading-container">
      <pv-progress-spinner />
    </div>

    <!-- Grid de Planes -->
    <div v-else class="plans-grid">
      <div v-for="plan in plans" :key="plan.id" class="plan-card"
           :class="{'active-card': currentMembership?.planId === plan.id}">

        <div class="card-header">
                    <span v-if="currentMembership?.planId === plan.id" class="badge">
                        {{ t('subscriptions.ideal-plan') }}
                    </span>
          <h2>{{ plan.name }}</h2>
          <div class="price-container">
            <span class="price">{{ plan.price.split(' / ')[0] }}</span>
            <span class="period"> / {{ plan.price.split(' / ')[1] }}</span>
          </div>
        </div>

        <div class="card-action">
          <pv-button
              :label="getButtonProps(plan).label"
              :severity="getButtonProps(plan).severity"
              :disabled="getButtonProps(plan).disabled"
              :loading="isProcessing"
              class="full-width-btn"
              @click="getButtonProps(plan).action()"
          />
        </div>

        <ul class="features-list">
          <li v-for="feature in plan.features" :key="feature">
            <i class="pi pi-check icon-check"></i>
            <span>{{ feature }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Mensaje de Confirmación -->
    <Transition name="fade">
      <div v-if="currentMembership && !isProcessing && currentMembership.status === 'active'"
           class="confirmation-card">
        <h3>{{ t('subscriptions.plan-obtained') }}</h3>
        <p>{{ t('subscriptions.plan-obtained-message', { plan: currentMembership.plan.name }) }}</p>
      </div>
    </Transition>

    <pv-confirm-dialog />

    <!-- Elemento invisible final para forzar el scroll -->
    <div class="bottom-spacer"></div>
  </div>
</template>

<style scoped>
.subscriptions-container {
  padding: 3rem;
  background-color: #f9fafb;
  /* Ajuste para que la altura mínima descuente el espacio del footer aprox */
  min-height: calc(100vh - 100px);
  height: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #1f2937;
}

.current-status {
  color: #059669;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  font-weight: 500;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

/* Grid Layout Horizontal */
.plans-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.plan-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 2rem;
  width: 100%;
  max-width: 300px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

/* Media query para pantallas pequeñas (móviles) */
@media (max-width: 768px) {
  .plans-grid {
    flex-wrap: wrap;
  }
  .plan-card {
    max-width: 100%;
  }
}

.plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.active-card {
  border: 2px solid #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

.card-header { text-align: center; margin-bottom: 1.5rem; width: 100%; }
.card-header h2 { font-size: 1.5rem; font-weight: 700; color: #111827; margin: 0.5rem 0; }
.price { font-size: 2.25rem; font-weight: 800; color: #1f2937; }
.period { color: #6b7280; }
.badge { background-color: #d1fae5; color: #065f46; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; }
.card-action { width: 100%; margin-bottom: 1.5rem; }
.full-width-btn { width: 100%; }
.features-list { list-style: none; padding: 0; margin: 0; width: 100%; text-align: left; }
.features-list li { display: flex; align-items: flex-start; margin-bottom: 0.75rem; color: #4b5563; }
.icon-check { color: #10b981; margin-right: 0.5rem; margin-top: 0.25rem; }

/* Estilo para la barra de confirmación */
.confirmation-card {
  margin-top: 0;
  padding: 1rem;
  background-color: #ecfdf5;
  border: 1px solid #6ee7b7;
  border-radius: 0.5rem;
  color: #065f46;
  text-align: center;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.confirmation-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.confirmation-card p {
  font-size: 0.9rem;
  margin: 0;
}

/* Espaciador Final Ajustado: Reducido para evitar el hueco blanco excesivo */
.bottom-spacer {
  display: block;
  width: 100%;
  height: 6rem; /* Reducido a ~96px */
  background: transparent;
  flex-shrink: 0;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>