// API to url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

// Get query URL
d3.json(url, function(data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Function for each feature in features array
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  function circleRadius(size){
    return size*20000;
  }

  function circleColors(size){
    if (size <1){
      return "#B6F853"
    }
    else if (size < 2){
      return "#DEF213"
    }
    else if (size < 3){
      return "#F1DE14"
    }
    else if (size < 4){
      return "#F3B41B"
    }
    else{return "#F88153"}
  }

  // GeoJSON layer 
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(earthquakeData, latlng){
      return L.circle(latlng, {
        radius: circleRadius(earthquakeData.properties.mag),
        fillColor: circleColors(earthquakeData.properties.mag),
        fillOpacity: 1,
        weight: 1,
        color: "black"
      });
    },
    onEachFeature: onEachFeature
  });

  // earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var graymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  //baseMaps object to hold base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Gray Map": graymap
  };

  //overlay object to hold overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };
  

  // Create map
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);



//Create color function for legend
function getColor(d) {
  return d > 5 ? "#F85C53" :
         d > 4 ? "#F89A53" :
         d > 3 ? "#F3B41B" :
         d > 2 ? "#F1DE14" :
         d > 1 ? "#DEF213" :
                  "#B6F853";
}

// Add legend to the map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
      magnitude = [0, 1, 2, 3, 4, 5],
      labels = [];

  for (var i = 0; i < magnitude.length; i++) {
    div.innerHTML +=
        '<i style="background:' + getColor(magnitude[i] + 1) + '"></i> ' +
        magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
}
    return div;
};

legend.addTo(myMap);
}
