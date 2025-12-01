import {BaseEndpoint} from "../../Shared/infrastructure/base-endpoint.js";
import {BaseApi} from "../../Shared/infrastructure/base-api.js";

const colleaguesEndpointPath = import.meta.env.VITE_COLLEAGUES_ENDPOINT_PATH || '/colleagues';

/**
 * @class ColleaguesApi
 * @extends BaseApi
 * @summary API class for Colleagues operations.
 */
export class ColleaguesApi extends BaseApi {
    #colleaguesEndpoint;

    /**
     * @constructor
     */
    constructor() {
        super();
        this.#colleaguesEndpoint = new BaseEndpoint(this, colleaguesEndpointPath);
    }

    /**
     * Gets all colleagues.
     * @returns {Promise} A promise that resolves with the list of colleagues.
     */
    getColleagues() {
        return this.#colleaguesEndpoint.getAll();
    }

    /**
     * Gets a colleague by ID.
     * @param {number|string} id - The colleague ID.
     * @returns {Promise} A promise that resolves with the colleague.
     */
    getColleagueById(id) {
        return this.#colleaguesEndpoint.getById(id);
    }

    /**
     * Creates a new colleague.
     * @param {Object} addColleagueCommand - The add colleague command data.
     * @returns {Promise} A promise that resolves with the created colleague.
     */
    addColleague(addColleagueCommand) {
        return this.#colleaguesEndpoint.create(addColleagueCommand);
    }

    /**
     * Updates an existing colleague.
     * @param {number|string} id - The colleague ID.
     * @param {Object} updateColleagueCommand - The update colleague command data.
     * @returns {Promise} A promise that resolves with the updated colleague.
     */
    updateColleague(id, updateColleagueCommand) {
        return this.#colleaguesEndpoint.update(id, updateColleagueCommand);
    }

    /**
     * Deletes a colleague.
     * @param {number|string} id - The colleague ID.
     * @returns {Promise} A promise that resolves when deleted.
     */
    deleteColleague(id) {
        return this.#colleaguesEndpoint.delete(id);
    }
}
