// Set Map
var myMap = L.map("map", {
    center: [41.0017, -104.0532],
    // center: [37.5452, -77.5407], // University of Richmond
    zoom: 3,
    layers: [lightMap]
});

// Light Map
var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    maxZoom: 18,
    id: "mapbox/light-v10",
    accessToken: LI_MAPBOX
}).addTo(myMap);

var site = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Retrieve Data
d3.json(site).then(function (response) {

    // Print Response
    console.log(response);

    // Create Group for Markers
    var markers = L.markerClusterGroup();

    // Loop through Data
    for (var i = 0; i < response["features"].length; i++) {

        // Set Location
        var earthquake = response["features"][i].geometry[1];

        console.log(earthquake)

        // // Check for location property
        // if (location) {

        //     // Add a new marker to the cluster group and bind a pop-up
        //     markers.addLayer(L.marker([location.coordinates[0], location.coordinates[1]]))
        // };

    }

    // Add our marker cluster layer to the map
    // myMap.addLayer(markers);

    console.log("IS THIS WORKING?");

});
