// Create our initial map object
// Set the longitude, latitude, and the starting zoom level
var myMap = L.map("map").setView([38, -96], 4);

// Add a tile layer (the background map image) to our map
// Use the addTo method to add objects to our map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

function getColor(d) {
  return d > 5 ? '#8B0000' :
        d > 4  ? '#FF0000' :
        d > 3  ? '#FF4500' :
        d > 2  ? '#FF8C00' :
        d > 1  ? '#FFD700' :
                '#ADFF2F';
}

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson" 

// / Grab the data with d3
d3.json(url, function(response) {

  console.log(response.features.length)
  // Loop through data
  for (var i = 0; i < response.features.length; i++) {

    // Set the data location property to a variable
    var lng = response.features[i].geometry.coordinates[0];
    var lat = response.features[i].geometry.coordinates[1];
    var mag = response.features[i].properties.mag;
    var place = response.features[i].properties.place;
    // console.log(mag);

  //   // Check for location property
    if (lat) {
      // Add a new marker to the cluster group and bind a pop-up
      // console.log(lat);
      L.circle([lat, lng],{
        color: getColor(mag),
        fillColor: getColor(mag),
        fillOpacity: 0.75,
        radius: mag*20000,
      })
      .bindPopup(("<h3>" + place + "</h3> <hr> <h3>Magnitude: " + mag + "</h3>"))
      .addTo(myMap);
    }
  }
});

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (myMap) {

  var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5]

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
        '<li class="square" style="background:' + getColor(grades[i]+1) + '">' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+') +'</li> ';
  }
  return div;
};

legend.addTo(myMap);