import {Plan} from "../domain/model/plan.entity.js";

/**
 * Assembler for converting API resources to Plan entities.
 * @class
 */
export class PlanAssembler {
    /**
     * Converts a plain resource object to a Plan entity.
     * @param {Object} resource - The resource object representing a plan.
     * @returns {Plan} The corresponding Plan entity.
     */
    static toEntityFromResource(resource) {
        // Asumimos que los nombres de las propiedades coinciden (id, name, price, features)
        return new Plan({...resource})
    }

    /**
     * Converts an API response to an array of Plan entities.
     * Logs an error and returns an empty array if the response status is not 200/201/304.
     *
     * @param {import('axios').AxiosResponse} response - The API response containing plan data.
     * @returns {Plan[]} Array of Plan entities.
     */
    static toEntitiesFromResponse(response) {
        // CORRECCIÓN: Aceptamos 200 (OK), 201 (Created) y 304 (Not Modified)
        if (![200, 201, 304].includes(response.status)) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        // Asumimos que la data viene en response.data['plans'] o directamente como array
        let resources = response.data instanceof Array ? response.data : response.data['plans'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}