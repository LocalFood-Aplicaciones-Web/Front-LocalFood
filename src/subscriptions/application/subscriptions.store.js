/**
 * Pinia store for managing Plans and Memberships in the subscriptions context.
 * Encapsulates transactional operations and state management for the user's plan.
 *
 * @module useSubscriptionsStore
 */
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {SubscriptionsApi} from "../infrastructure/subscriptions-api.js";
import {PlanAssembler} from "../infrastructure/plan.assembler.js";
import {MembershipAssembler} from "../infrastructure/membership.assembler.js";
import {Plan} from "../domain/model/plan.entity.js";
import {Membership} from "../domain/model/membership.entity.js";

const subscriptionsApi = new SubscriptionsApi();

/**
 * Store for subscriptions context.
 */
const useSubscriptionsStore = defineStore('subscriptions', () => {


    /**
     * List of available Plan entities.
     * @type {import('vue').Ref<Plan[]>}
     */
    const plans = ref([]);

    /**
     * The active Membership entity for the current user.
     * @type {import('vue').Ref<Membership|null>}
     */
    const currentMembership = ref(null);

    /**
     * List of errors encountered during API operations.
     * @type {import('vue').Ref<Error[]>}
     */
    const errors = ref([]);

    /**
     * Whether plans have been loaded from the API.
     * @type {import('vue').Ref<boolean>}
     */
    const plansLoaded = ref(false);

    /**
     * Whether the current membership has been loaded from the API.
     * @type {import('vue').Ref<boolean>}
     */
    const membershipLoaded = ref(false);

    // --- GETTERS (Propiedades Calculadas) ---

    /**
     * Checks if the user has an active membership (status: 'active').
     * @type {import('vue').ComputedRef<boolean>}
     */
    const hasActiveMembership = computed(() => {
        return currentMembership.value !== null && currentMembership.value.status === 'active';
    });

    /**
     * The name of the user's current plan (or 'Free' if no active plan).
     * @type {import('vue').ComputedRef<string>}
     */
    const currentPlanName = computed(() => {
        return currentMembership.value?.plan?.name || 'Free';
    });


    // --- ACTIONS (Casos de Uso Transaccionales) ---

    // 1. READ: Obtener la lista de planes disponibles
    /**
     * Fetches all available Plans from the API and updates state.
     * @function
     * @returns {void}
     */
    function fetchPlans() {
        subscriptionsApi.getPlans().then(response => {
            plans.value = PlanAssembler.toEntitiesFromResponse(response);
            plansLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    // 2. READ: Obtener la membresía activa del usuario
    /**
     * Fetches the current user's Membership from the API and updates state.
     * @function
     * @returns {void}
     */
    function fetchCurrentMembership() {
        subscriptionsApi.getCurrentMembership().then(response => {
            currentMembership.value = MembershipAssembler.toEntityFromResponse(response);
            membershipLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    // 3. WRITE: Suscribirse a un plan (Crear Membership)
    /**
     * Subscribes the user to a new plan via the API and updates state.
     * Maps to the CREATE operation on the Membership resource.
     * @function
     * @param {number|string} planId - The ID of the plan to subscribe to.
     * @returns {void}
     */
    function subscribeToPlan(planId) {
        subscriptionsApi.subscribeToPlan(planId).then(response => {
            currentMembership.value = MembershipAssembler.toEntityFromResponse(response);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    // 4. WRITE: Cambiar de plan (Actualizar Membership)
    /**
     * Changes the current Membership plan via the API and updates state.
     * Maps to the UPDATE operation on the Membership resource.
     * @function
     * @param {number|string} newPlanId - The ID of the new plan to change to.
     * @returns {void}
     */
    function changePlan(newPlanId) {
        if (!currentMembership.value) return;

        const membershipId = currentMembership.value.id;

        subscriptionsApi.changePlan(membershipId, newPlanId).then(response => {
            currentMembership.value = MembershipAssembler.toEntityFromResponse(response);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    // 5. WRITE: Cancelar la membresía (Eliminar/Desactivar Membership)
    /**
     * Cancels the current Membership via the API and updates state.
     * Maps to the DELETE operation on the Membership resource.
     * @function
     * @returns {void}
     */
    function cancelMembership() {
        if (!currentMembership.value) return;

        const membershipId = currentMembership.value.id;

        subscriptionsApi.cancelMembership(membershipId).then(response => {
            // Asumimos que el backend retorna la Membership con status='canceled' o similar.
            currentMembership.value = MembershipAssembler.toEntityFromResponse(response);
        }).catch(error => {
            errors.value.push(error);
        });
    }


    // --- RETURN ---
    return {
        // State
        plans,
        currentMembership,
        errors,
        plansLoaded,
        membershipLoaded,
        // Getters
        hasActiveMembership,
        currentPlanName,
        // Actions
        fetchPlans,
        fetchCurrentMembership,
        subscribeToPlan,
        changePlan,
        cancelMembership
    };
});

export default useSubscriptionsStore;