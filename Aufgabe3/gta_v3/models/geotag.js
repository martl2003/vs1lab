// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {

    constructor({ id, title, description, lat, lng, createdAt }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.lat = Number(lat);
    this.lng = Number(lng);
    this.createdAt = createdAt || new Date();
}
}


module.exports = GeoTag;
