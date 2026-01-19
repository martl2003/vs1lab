// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 * 
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 * 
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary
const store = require('../models/geotag-examples');

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
    res.render('index', { taglist: store._geoTags, lat: '', lon: '' });
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

// TODO: ... your code here ...
router.post('/tagging', (req, res) => {
    const { latitude, longitude, name, hashtag } = req.body;

    const tag = new GeoTag(name, latitude, longitude, hashtag);
    store.addGeoTag(tag);

    const results = store.getNearbyGeoTags(latitude, longitude);

    res.render('index', {
        taglist: results,
        lat: latitude,
        lon: longitude
    });
});



/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

// TODO: ... your code here ...
router.post('/discovery', (req, res) => {
    const { latitude, longitude, searchterm } = req.body;

    const results = searchterm
        ? store.searchNearbyGeoTags(latitude, longitude, searchterm)
        : store.getNearbyGeoTags(latitude, longitude);

    res.render('index', {
        taglist: results,
        lat: latitude,
        lon: longitude
    });
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

// TODO: ... your code here ...
router.get("/api/geotags", (req, res) => {
    const { latitude, longitude, searchterm } = req.query;

    let results;

    if (latitude && longitude) {
        // Umwandeln in Zahlen
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        if (searchterm) {
            results = store.searchNearbyGeoTags(lat, lon, searchterm);
        } else {
            results = store.getNearbyGeoTags(lat, lon);
        }
    } else if (searchterm) {
        // Keine Koordinaten, nur Suche nach Keyword
        results = store.searchGeoTags(searchterm);
    } else {
        results = store._geoTags; // alle Tags
    }

    res.json(results);
});


/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.post("/api/geotags", (req, res) => {
    const { latitude, longitude, name, hashtag } = req.body;

    const tag = new GeoTag(name, latitude, longitude, hashtag);
    const addedTag = store.addGeoTag(tag);

    res.status(201).json(addedTag);

});

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.get("/api/geotags/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const tag = store.getGeoTagById(id);
    
    if(tag) {
        res.json(tag);  // JSON zurückgeben
    } else {
        res.status(404).json({ error: "GeoTag not found" });
    }

});

/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

// TODO: ... your code here ...
router.put("/api/geotags/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const {name, latitude, longitude, hashtag} = req.body;
    const tag = store.putTag(name, latitude, longitude, hashtag, id);
    
    if(tag) {
        res.json(tag);  // JSON zurückgeben
    } else {
        res.status(404).json({ error: "GeoTag not found" });
    }

});


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...

router.delete("/api/geotags/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const succes = store.removeTagById(id);

    if (succes) {
        res.sendStatus(204); // No Content
    } else {
        res.sendStatus(404); // Not Found
    }
})

module.exports = router;
