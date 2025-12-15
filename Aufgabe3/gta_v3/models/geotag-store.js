// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class GeoTagStore{


    /**
     * The internal array is private by convention
     */
    constructor() {
        this._geoTags = [];
    }

    /**
     * Add a geotag to the store
     * @param {Object} geoTag
     */
    addGeoTag(geoTag) {
        this._geoTags.push(geoTag);
    }

    /**
     * Remove geotags by name
     * @param {string} name
     */
    removeGeoTag(name) {
        this._geoTags = this._geoTags.filter(
            tag => tag.name !== name
        );
    }

    /**
     * Return all geotags within a given radius of a location
     * @param {Object} location { lat, lng }
     * @param {number} radius radius in kilometers
     * @returns {Array}
     */
    getNearbyGeoTags(location, radius) {
        return this._geoTags.filter(tag => {
            const distance = this._distanceInKm(
                location.lat,
                location.lng,
                tag.lat,
                tag.lng
            );
            return distance <= radius;
        });
    }

    /**
     * Return all nearby geotags matching a keyword
     * @param {Object} location { lat, lng }
     * @param {number} radius radius in kilometers
     * @param {string} keyword
     * @returns {Array}
     */
    searchNearbyGeoTags(location, radius, keyword) {
        const lowerKeyword = keyword.toLowerCase();

        return this.getNearbyGeoTags(location, radius).filter(tag =>
            tag.name.toLowerCase().includes(lowerKeyword) //||
            //tag.hashtag.toLowerCase().includes(keyword)
        );
    }

    /**
     * Haversine formula to compute distance between two geo coordinates
     */
    _distanceInKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth radius in km
        const dLat = this._toRad(lat2 - lat1);
        const dLon = this._toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this._toRad(lat1)) *
            Math.cos(this._toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    _toRad(value) {
        return value * Math.PI / 180;
    }
}
    // TODO: ... your code here ...



module.exports = GeoTagStore
