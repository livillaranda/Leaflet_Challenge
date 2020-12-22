// Set Map
var myMap = L.map("map", {
    center: [41.0017, -104.0532],
    zoom: 4
});

// Map Layers
var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    maxZoom: 20,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    maxZoom: 20,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});

var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    maxZoom: 20,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
});

var satMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    maxZoom: 20,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
});

var terrainMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    maxZoom: 20,
    id: "mapbox/satellite-streets-v11",
    accessToken: API_KEY
});

satMap.addTo(myMap);

// Base Maps
var baseMaps = {
    "Light": lightMap,
    "Dark": darkMap,
    "Street": streetMap,
    "Satellite": satMap,
    "Satellite (Identifiers)": terrainMap
};

// Overlay Objects
var earthquakes = new L.LayerGroup();
var tectPlates = new L.LayerGroup();

// Overlays
var overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Plates": tectPlates
};

// Layers Added to Map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// Tectonic Plates Link
var tectPlatesLink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

d3.json(tectPlatesLink).then(function (plateData) {
    // Styling
    L.geoJson(plateData, {
        color: "orange",
        weight: 2.5
    }).addTo(tectPlates);
});

// Data Link
var site = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Retrieve Data
d3.json(site).then(function (data) {

    // Print Response
    console.log(data);

    // Styling
    function styleInformation(feature) {
        return {
            opacity: 1,
            fillOpacity: 0.75,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "white",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // Circle Radius
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        // Adjust Scale of Circle
        return magnitude * 3;
    }

    // Circle Colors
    function getColor(depth) {
        switch (true) {
            case depth > 100:
                return "#d73027";
            case depth > 80:
                return "#fc8d59";
            case depth > 60:
                return "#fee08b";
            case depth > 40:
                return "#d9ef8b";
            case depth > 20:
                return "#91cf60";
            default:
                return "#1a9850"
        }
    }

    // geoJSON Layer
    L.geoJson(data, {

        // Retrieve Data Points
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        // // Styling
        style: styleInformation,

        // Pop Up Marker
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "Location: " + feature.properties.place
            );
        }

    }).addTo(earthquakes);

    earthquakes.addTo(myMap);
    tectPlates.addTo(myMap);

    // Legend
    var legendLoc = L.control({
        position: "bottomleft"
    });

    legendLoc.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");

        var grades = [0, 20, 40, 60, 80, 100]

        var colors = [
            "#1a9850",
            "#91cf60",
            "#d9ef8b",
            "#fee08b",
            "#fc8d59",
            "#d73027"
        ]

        // Color Labels
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += [
                "Depth: " + "<i style='background: " + colors[i] + "'> </i>" + grades[i] + (grades[i + 1] ? " &ndash; " + grades[i + 1] + " km" + " <br> " : "+" + " km")
            ];
        }
        return div;
    };

    legendLoc.addTo(myMap);


});



// // Layers
// layers: [lightMap, tectPlates, earthquakes]