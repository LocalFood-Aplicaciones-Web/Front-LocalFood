/**
 * @class UpdateColleagueCommand
 * @summary Command to update an existing colleague.
 */
export class UpdateColleagueCommand {
    /**
     * Constructor
     * @param {string|number} id - The colleague's ID.
     * @param {string} name - The colleague's name.
     * @param {string} email - The colleague's email address.
     * @param {string} phone - The colleague's phone number.
     * @param {Object} address - The colleague's address.
     * @param {number} address.latitude - Latitude coordinate.
     * @param {number} address.longitude - Longitude coordinate.
     * @param {string} address.street - Street address.
     * @param {string} address.city - City.
     */
    constructor({id, name, email, phone = '', address}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }
}
