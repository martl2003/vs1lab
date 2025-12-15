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
class InMemoryGeoTagStore{


        constructor() {
        this._geoTags = [];
    }
    // TODO: ... your code here ...
    #tags = [];
    #RADIUS = 0.01; // ca. 1km

    addGeoTag(tag) {
        this.#tags.push(tag);
    }

    removeGeoTag(name) {
        this.#tags = this.#tags.filter(t => t.name !== name);
    }

    getNearbyGeoTags(lat, lon) {
        return this.#tags.filter(t =>
            Math.abs(t.latitude - lat) <= this.#RADIUS &&
            Math.abs(t.longitude - lon) <= this.#RADIUS
        );
    }

    searchNearbyGeoTags(lat, lon, keyword) {
        const lowerKeyword =keyword.toLowerCase();
        return this.getNearbyGeoTags(lat, lon).filter(t =>
            t.name.toLowerCase().includes(lowerKeyword) || t.hashtag.toLowerCase().includes(lowerKeyword)
        );
    }

}

module.exports = InMemoryGeoTagStore
