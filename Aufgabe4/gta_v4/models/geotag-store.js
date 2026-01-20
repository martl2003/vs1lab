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
        this._nextId = 1; // nächster verfügbarer Schlüssel
    }
    
    #tags = [];      // private Array
    #RADIUS = 1;  // private Konstante

    addGeoTag(tag) {
        tag.id = this._nextId++;
        this.#tags.push(tag);
        return tag;
    }

    getAllGeoTags() {
        return this.#tags;
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

    getGeoTagById(id) {
        return this.#tags.find(t => t.id === id);
    }

    putTag(name, lat, lon, hashtag, id) {
        const tag = this.#tags.find(t => t.id === id);
        if(!tag) return null;
        tag.latitude = lat;
        tag.longitude = lon;
        tag.name = name;
        tag.hashtag = hashtag;

        return tag;
    }

    removeTagById(id){
        const lengthBefore = this.#tags.length;
        this.#tags = this.#tags.filter(t => t.id !== id);
        return this.#tags.length < lengthBefore;
    }

}

module.exports = InMemoryGeoTagStore
