/**
 * @class ColleagueModel
 * @summary Domain model representing a colleague with business logic.
 */
export class ColleagueModel {
    /**
     * Calculates the distance between two coordinates using Haversine formula.
     * @param {number} lat1 - First latitude
     * @param {number} lon1 - First longitude
     * @param {number} lat2 - Second latitude
     * @param {number} lon2 - Second longitude
     * @returns {number} Distance in kilometers
     */
    static calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        
        return Math.round(distance * 100) / 100; // Round to 2 decimals
    }

    /**
     * Converts degrees to radians.
     * @param {number} deg - Degrees
     * @returns {number} Radians
     */
    static toRad(deg) {
        return deg * (Math.PI / 180);
    }

    /**
     * Validates if coordinates are valid.
     * @param {number} latitude - Latitude coordinate
     * @param {number} longitude - Longitude coordinate
     * @returns {boolean} True if valid
     */
    static isValidCoordinates(latitude, longitude) {
        return latitude >= -90 && latitude <= 90 && 
               longitude >= -180 && longitude <= 180;
    }

    /**
     * Validates email format.
     * @param {string} email - Email address
     * @returns {boolean} True if valid
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
