import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

// La ruta para el Bounded Context 'subscriptions' (e.g., /subscriptions)
const subscriptionsEndpointPath = import.meta.env.VITE_SUBSCRIPTIONS_ENDPOINT_PATH;

/**
 * SubscriptionsApi class to handle API operations for the Subscriptions Bounded Context.
 * Extends BaseApi and provides operations for Plans and Memberships, using the
 * BaseEndpoint for standard CRUD operations.
 *
 * @class
 * @extends BaseApi
 */
export class SubscriptionsApi extends BaseApi {
    /**
     * Endpoint para el recurso Membership (Ej: /subscriptions).
     * Se usa para operaciones transaccionales (crear, cambiar, cancelar).
     * @type {BaseEndpoint}
     * @private
     */
    #membershipEndpoint;

    /**
     * Endpoint para el sub-recurso Plan (Ej: /subscriptions/plans).
     * Se usa para obtener la lista de planes disponibles.
     * @type {BaseEndpoint}
     * @private
     */
    #plansEndpoint;

    /**
     * Initializes endpoints for Memberships and Plans.
     */
    constructor() {
        super();
        // Inicializa el endpoint base para el recurso principal (Membership)
        this.#membershipEndpoint = new BaseEndpoint(this, subscriptionsEndpointPath);

        // Inicializa un endpoint para el sub-recurso Planes
        this.#plansEndpoint = new BaseEndpoint(this, `${subscriptionsEndpointPath}/plans`);
    }

    // --- OPERACIONES DE PLAN (READ) ---

    /**
     * Fetches all available Plans (GET /subscriptions/plans).
     * Mapea a la acción fetchPlans() del Store.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the plans' response.
     */
    getPlans() {
        return this.#plansEndpoint.getAll();
    }

    // --- OPERACIONES DE MEMBERSHIP (READ/WRITE Transaccional) ---

    /**
     * Fetches the active Membership for the current user.
     * Asume un endpoint dedicado para la membresía activa del usuario (Ej: GET /subscriptions/active-membership).
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the membership response.
     */
    getCurrentMembership() {
        // Necesitamos un BaseEndpoint para una ruta específica (e.g., /subscriptions/active-membership)
        const activeMembershipEndpoint = new BaseEndpoint(this, `${subscriptionsEndpointPath}/active-membership`);
        return activeMembershipEndpoint.getAll();
    }

    /**
     * Creates a new Membership (Subscribes the user to a plan).
     * Mapea a la acción subscribeToPlan(planId) del Store y se traduce a POST /subscriptions.
     * @param {number|string} planId - The ID of the plan to subscribe to.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the created membership response.
     */
    subscribeToPlan(planId) {
        // El body de la petición solo necesita el planId
        const subscriptionResource = { planId: planId };
        return this.#membershipEndpoint.create(subscriptionResource);
    }

    /**
     * Changes the current Membership plan (Upgrade/Downgrade).
     * Mapea a la acción changePlan(membershipId, newPlanId) del Store y se traduce a PUT /subscriptions/{membershipId}.
     * @param {number|string} membershipId - The ID of the membership resource to update.
     * @param {number|string} newPlanId - The ID of the new plan.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated membership response.
     */
    changePlan(membershipId, newPlanId) {
        // El body de la petición solo necesita el nuevo planId
        const updateResource = { planId: newPlanId };
        return this.#membershipEndpoint.update(membershipId, updateResource);
    }

    /**
     * Cancels the current Membership.
     * Mapea a la acción cancelMembership(membershipId) del Store y se traduce a DELETE /subscriptions/{membershipId}.
     * @param {number|string} membershipId - The ID of the membership to cancel/delete.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the delete/cancellation response.
     */
    cancelMembership(membershipId) {
        // El backend debe interpretar la eliminación del recurso Membership como una cancelación.
        return this.#membershipEndpoint.delete(membershipId);
    }
}