/**
 * Represents a Plan entity (Free, Premium, Business).
 * @class
 */
export class Plan {
    /**
     * Creates a new Plan instance.
     * @param {Object} params - The parameters for the plan.
     * @param {?number} [params.id=null] - The unique identifier for the plan.
     * @param {string} [params.name=''] - The name of the plan (e.g., 'Premium').
     * @param {string} [params.price='S/0'] - The price displayed (e.g., 'S/10 / mensual, anual').
     * @param {string[]} [params.features=[]] - A list of key features included in the plan.
     */
    constructor({ id = null, name = '', price = '', features = [] }) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.features = features;

        // *Opcional: Añadir un identificador de botón o estatus si es necesario para la UI*
        // this.buttonLabel = buttonLabel;
    }
}