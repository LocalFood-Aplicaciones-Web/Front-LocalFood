import {Colleague} from "../domain/model/colleague.entity.js";
import {ColleagueResource} from "./colleague.resource.js";

/**
 * @class ColleagueAssembler
 * @summary Assembler for converting between colleague resources and entities.
 */
export class ColleagueAssembler {
    /**
     * Converts a resource to an entity.
     * @static
     * @param {ColleagueResource} resource - The colleague resource.
     * @returns {Colleague} The Colleague entity.
     */
    static toEntityFromResource(resource) {
        return new Colleague({...resource});
    }

    /**
     * Converts multiple resources to entities.
     * @static
     * @param {Object} response - The API response object.
     * @param {number} response.status - The HTTP status code.
     * @param {string} response.statusText - The status text.
     * @param {Array|Object} response.data - The response data.
     * @returns {Colleague[]} Array of Colleague entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array ? response.data : response.data['colleagues'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }

    /**
     * Converts an entity to a resource for API submission.
     * @static
     * @param {Colleague} entity - The colleague entity.
     * @returns {Object} The resource object for API.
     */
    static toResourceFromEntity(entity) {
        return {
            name: entity.name,
            email: entity.email,
            phone: entity.phone,
            address: entity.address,
            userId: entity.userId,
            groupId: entity.groupId
        };
    }

    /**
     * Converts a response to a single resource.
     * @static
     * @param {Object} response - The API response object.
     * @returns {ColleagueResource|null} The colleague resource or null.
     */
    static toResourceFromResponse(response) {
        if (response.status !== 200 && response.status !== 201) {
            console.error(`${response.status}, ${response.statusText}`);
            return null;
        }
        return new ColleagueResource(response.data);
    }
}
