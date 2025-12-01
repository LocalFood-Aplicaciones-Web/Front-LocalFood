/**
 * @class ColleagueResource
 * @summary Resource representing colleague data from API.
 */
export class ColleagueResource {
    /**
     * @param {string|number} id - The colleague ID.
     * @param {string} name - The colleague's name.
     * @param {string} email - The colleague's email address.
     * @param {string} phone - The colleague's phone number.
     * @param {Object} address - The colleague's address.
     */
    constructor({id, name, email, phone, address}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }
}
