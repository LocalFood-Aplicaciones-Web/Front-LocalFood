/**
 * @class Colleague
 * @summary Represents a colleague entity in the domain.
 */
export class Colleague {
    /**
     * @param {Object} params - The colleague parameters.
     * @param {string|number} params.id - The colleague ID.
     * @param {string} params.name - The colleague's name.
     * @param {string} params.email - The colleague's email address.
     * @param {string} params.phone - The colleague's phone number.
     * @param {Object} params.address - The colleague's address with lat/lng.
     * @param {number} params.address.latitude - Latitude coordinate.
     * @param {number} params.address.longitude - Longitude coordinate.
     * @param {string} params.address.street - Street address.
     * @param {string} params.address.city - City.
     */
    constructor({id = 0, name, email, phone = '', address, userId = null, groupId = null}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.userId = userId;
        this.groupId = groupId;
        this.address = address || {
            latitude: 0,
            longitude: 0,
            street: '',
            city: ''
        };
    }

    /**
     * Validates if the colleague entity has required fields.
     * @returns {boolean} True if valid, false otherwise.
     */
    isValid() {
        return this.name && this.email && this.address.latitude && this.address.longitude;
    }
}
