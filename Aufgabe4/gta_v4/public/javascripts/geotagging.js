import { MapManager } from './map-manager.js';
import { LocationHelper } from './location-helper.js';
// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener('DOMContentLoaded', () => {

    const tagForm = document.getElementById("tag-form");
    tagForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const json = Object.fromEntries(formData);

        await fetch("/api/geotags", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(json)
        });
    });

    const disForm = document.getElementById("discoveryFilterForm");
    disForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const dataObj = Object.fromEntries(formData); 

        
        const queryString = new URLSearchParams(dataObj).toString();
        const url = `/api/geotags?${queryString}`;

        const response = await fetch(url, { method: "GET" });
        const results = await response.json();

        mapManager.updateMarkers(
            dataObj.latitude,
            dataObj.longitude,
            results
        );

        console.log("Ergebnisse:", results);
    });

    const mapManager = new MapManager('map');

    function updateLocation() {
        const latTag = document.getElementById('latitude_input_tagging');
        const lonTag = document.getElementById('longitude_input_tagging');

        let tags = [];
        const tagsJSON = document.getElementById('map').dataset.tags;
        if (tagsJSON) tags = JSON.parse(tagsJSON);

        // if (latTag.value && lonTag.value) {
        //     mapManager.initMap(latTag.value, lonTag.value);
        //     mapManager.updateMarkers(latTag.value, lonTag.value, tags);
        //     return;
        // }

        LocationHelper.findLocation(pos => {
            console.log("Geolocation API is being called");
            
            latTag.value = pos.latitude;
            lonTag.value = pos.longitude;

            document.getElementById('latitude_input_discovery').value = pos.latitude;
            document.getElementById('longitude_input_discovery').value = pos.longitude;

            mapManager.initMap(pos.latitude, pos.longitude);
            mapManager.updateMarkers(pos.latitude, pos.longitude, tags);
        });
    }

    updateLocation();
});