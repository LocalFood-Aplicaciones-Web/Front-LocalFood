import {Membership} from "../domain/model/membership.entity.js";
import {PlanAssembler} from "./plan.assembler.js"; // Importamos el assembler de Plan

/**
 * Assembler for converting API resources to Membership entities.
 * @class
 */
export class MembershipAssembler {
    /**
     * Converts a plain resource object to a Membership entity.
     * @param {Object} resource - The resource object representing a membership.
     * @returns {Membership} The corresponding Membership entity.
     */
    static toEntityFromResource(resource) {
        // 1. Convertir el objeto 'plan' anidado (si existe) a su Entidad.
        const planEntity = resource.plan
            ? PlanAssembler.toEntityFromResource(resource.plan)
            : null;

        // 2. Crear la entidad Membership, inyectando la entidad Plan.
        return new Membership({
            ...resource,
            plan: planEntity // Aquí se establece la relación.
        });
    }

    /**
     * Converts an API response to an array of Membership entities.
     * Esta función podría ser más usada para obtener el historial de membresías.
     *
     * @param {import('axios').AxiosResponse} response - The API response.
     * @returns {Membership[]} Array of Membership entities.
     */
    static toEntitiesFromResponse(response) {
        // CORRECCIÓN: Aceptamos 200, 201 y 304
        if (![200, 201, 304].includes(response.status)) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['memberships'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }

    /**
     * Conversión específica para obtener una única Membership activa.
     * @param {import('axios').AxiosResponse} response - The API response.
     * @returns {Membership|null} The corresponding Membership entity or null.
     */
    static toEntityFromResponse(response) {
        // CORRECCIÓN: Aceptamos 200, 201 y 304
        if (![200, 201, 304].includes(response.status)) {
            console.error(`${response.status}, ${response.statusText}`);
            return null;
        }
        let resource = response.data;
        return this.toEntityFromResource(resource);
    }
}