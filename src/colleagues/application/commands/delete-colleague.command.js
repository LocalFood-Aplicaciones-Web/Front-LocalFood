/**
 * @class DeleteColleagueCommand
 * @summary Command to delete a colleague.
 */
export class DeleteColleagueCommand {
    /**
     * Constructor
     * @param {string|number} id - The colleague's ID to delete.
     */
    constructor({id}) {
        this.id = id;
    }
}
