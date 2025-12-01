/**
 * @class AddColleagueCommand
 * @summary Command to add a new colleague.
 */
export class AddColleagueCommand {
    /**
     * Constructor
     * @param {string} name - The colleague's name.
     * @param {string} email - The colleague's email address.
     * @param {string} phone - The colleague's phone number.
     * @param {Object} address - The colleague's address.
     * @param {number} address.latitude - Latitude coordinate.
     * @param {number} address.longitude - Longitude coordinate.
     * @param {string} address.street - Street address.
     * @param {string} address.city - City.
     */
    constructor({name, email, phone = '', address}) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }
}
