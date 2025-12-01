import {Plan} from "./plan.entity.js"; // Importamos la entidad Plan

/**
 * Represents a Membership entity (the active agreement of a user).
 * @class
 */
export class Membership {
    /**
     * Creates a new Membership instance.
     * @param {Object} params - The parameters for the membership.
     * @param {?number} [params.id=null] - The unique identifier for the membership agreement.
     * @param {?number} [params.userId=null] - The ID of the user owning this membership.
     * @param {?number} [params.planId=null] - The ID of the currently subscribed Plan.
     * @param {string} [params.status='pending'] - The current status (e.g., 'active', 'canceled', 'expired').
     * @param {string} [params.renewalDate=''] - The next renewal date.
     * @param {?Plan} [params.plan=null] - The Plan instance associated with this membership.
     */
    constructor({id = null, userId = null, planId = null, status = 'pending', renewalDate = '', plan = null}) {
        this.id = id;
        this.userId = userId;
        this.planId = planId;
        this.status = status;
        this.renewalDate = renewalDate;

        // Modelado de Relación (Similar a cómo Tutorial usa Category)
        // Asegura que la propiedad 'plan' sea una instancia de la entidad Plan.
        this.plan = plan instanceof Plan ? plan : null;
    }
}