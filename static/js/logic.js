var geojsonURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(geojsonURL, function(data){
    console.log(data)
});

function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    mapboxgl.accessToken = API_KEY;

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  
    // var darkmap = new mapboxgl.Map({
    //   container: 'map',
    //   style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
    //   center: [-115.1398,36.1699], // starting position [lng, lat]
    //   zoom: 4 // starting zoom
    // });

    // Create a baseMaps object to hold the darkmap layer
    var baseMaps = {
        "Dark Map": darkmap
    };

    // Create an overlayMaps object to hold the earthquakes layer
    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    // Create the map object with options
    var map = L.map("map", {
        center: [36.1699, -115.1398],
        zoom: 5,
        layers: [darkmap, earthquakes]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

    // Create a legend to display information about our map

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", 'info legend');
        var colors = ["rgb(0, 255, 0)","rgb(128, 255, 0)", "rgb(255, 128, 0)", "rgb(255, 128, 50)", "rgb(255, 0, 152)", "rgb(152, 0, 152)"];
        var limits = [0,1,2,3,4,5];
    //   var labels = [];
    //   loop through our intervals and generate a label
    //   with a colored square for each interval
    //    var legendInfo = "<h1> Earthquake Magnitude</h1>" 
  
      // div.innerHTML = legendInfo;
        console.log(limits)
        for (var i = 0; i < colors.length; i++) {
            div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
                limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
        }
        // div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    // Adding legend to the map
    legend.addTo(map);
}

function createMarkers(response) {

    // Pull out array of earthquake instances
    var earthquakes = response.features;

    // Initialize an array to hold earthquake markers
    var earthquakeMarkers = [];
  
    // Loop through the array of earthquakes
    for (var index = 0; index < earthquakes.length; index++) {

      var earthquake = earthquakes[index];
      
      // Pull the "coordinates" out from the data, then separate into longitude and latitude
      var coords = earthquake.geometry.coordinates;
      
      var lon = coords[0];
      var lat = coords[1];
      
      // Pull the "magnitude" property out from the data
      var magnitude = earthquake.properties.mag;
  
      // Assign value to fillColor variable according to level of magnitude
      var fillColor = "";
      
      if (magnitude >= 5) {
        fillColor = "rgb(152, 0, 152)";
      }
      else if (magnitude >= 4) {
        fillColor = "rgb(255, 0, 152)";
      }
      else if (magnitude >= 3) {
        fillColor = "rgb(255, 128, 50)";
      }
      else if (magnitude >= 2) {
        fillColor = "rgb(255, 128, 0)";
      }
      else if (magnitude >= 1) {
        fillColor = "rgb(128, 255, 0)";
      }
      else {
        fillColor = "rgb(0, 255, 0)";
      }

      // For each earthquake, create a marker and bind a popup with the earthquake's location and magnitude
      var earthquakeMarker = L.circleMarker([lat, lon], {
          color: "black",
          weight: .5,
          fillOpacity: 1,
          radius: magnitude * 3,
          fillColor: fillColor
      })
        .bindPopup("<h3>Location: " + earthquake.properties.place + "<h3><h3>Magnitude: " + magnitude + "<h3>");
  
      // Add the marker to the earthquakeMarkers array
      earthquakeMarkers.push(earthquakeMarker);
    }
  
    // Create a layer group made from the earthquake markers array, pass it into the createMap function
    createMap(L.layerGroup(earthquakeMarkers));
  }

// Read in All Earthquake data from the last 7 days, via the USGS geaojson file. Call createMarkers function when complete.
d3.json(geojsonURL, createMarkers);


