/**
 * @class BaseEndpoint
 * @summary Base endpoint class for API operations.
 * Provides common CRUD operations for REST endpoints.
 */
export class BaseEndpoint {
    #api;
    #path;

    /**
     * @constructor
     * @param {BaseApi} api - The base API instance.
     * @param {string} path - The endpoint path.
     */
    constructor(api, path) {
        this.#api = api;
        this.#path = path;
    }

    /**
     * Gets all resources from the endpoint.
     * @returns {Promise} A promise that resolves with the response.
     */
    getAll() {
        return this.#api.http.get(this.#path);
    }

    /**
     * Gets a single resource by ID.
     * @param {number|string} id - The resource ID.
     * @returns {Promise} A promise that resolves with the response.
     */
    getById(id) {
        return this.#api.http.get(`${this.#path}/${id}`);
    }

    /**
     * Creates a new resource.
     * @param {Object} data - The resource data to create.
     * @returns {Promise} A promise that resolves with the response.
     */
    create(data) {
        return this.#api.http.post(this.#path, data);
    }

    /**
     * Updates an existing resource.
     * @param {number|string} id - The resource ID.
     * @param {Object} data - The updated resource data.
     * @returns {Promise} A promise that resolves with the response.
     */
    update(id, data) {
        return this.#api.http.put(`${this.#path}/${id}`, data);
    }

    /**
     * Partially updates an existing resource.
     * @param {number|string} id - The resource ID.
     * @param {Object} data - The partial resource data.
     * @returns {Promise} A promise that resolves with the response.
     */
    patch(id, data) {
        return this.#api.http.patch(`${this.#path}/${id}`, data);
    }

    /**
     * Deletes a resource.
     * @param {number|string} id - The resource ID.
     * @returns {Promise} A promise that resolves with the response.
     */
    delete(id) {
        return this.#api.http.delete(`${this.#path}/${id}`);
    }
}
