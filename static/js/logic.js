let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function createPopup(feature, layer) {
    layer.bindPopup(`<h3> ${feature.properties.place}, ${feature.geometry.coordinates[1]}°N, ${feature.geometry.coordinates[0]}°W, ${feature.geometry.coordinates[2]} km deep</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }
    function chooseColor(option) {
        if (option <= 10) return "LimeGreen";
        else if (option <=30) return "GreenYellow";
        else if (option <=50) return "Yellow";
        else if (option <=70) return "Orange";
        else if (option <=90) return "DarkOrange";
        else return "Red";
    }


  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: createPopup, 
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
                color: "Black",
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.75,
                radius: feature.properties.mag * 5,
                weight: .5
            });
    }
  });


  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    let baseMaps = {
      "Topographic Map": topo,
      Earthquakes: earthquakes
    };
  
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [
        40.015, -105.27
      ],
      zoom: 5,
      layers: [topo, earthquakes]
    });
  

    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function (map) {
        colors = ["LimeGreen", "GreenYellow", "Yellow", "Orange", "DarkOrange", "Red"]

        var div = L.DomUtil.create('div', 'info legend');
        deapths = ['-10-10','10-30','30-50','50-70','70-90','90+'];
        let legendInfo = "<h2>Deapths</h2>" +
          "<div class='labels'>"+
            "<ul class='legend-labels'>"+
              "<li style='background-color:LimeGreen;><span style='background-color:LimeGreen;'></span>-10-10</li>"+
              "<li style='background-color:GreenYellow;><span style='background-color:GreenYellow;'></span>10-30</li>"+
              "<li style='background-color:Yellow;><span style='background-color:Yellow;'></span>30-50</li>"+
              "<li style='background-color:Orange;><span style='background-color:Orange;'></span>50-70</li>"+
              "<li style='background-color:DarkOrange;><span style='background-color:DarkOrange;'></span>70-90</li>"+
              "<li style='background-color:Red;><span style='background-color:Red;'></span>90+</li>"+
            "</ul>"+
          "</div>"
        
        div.innerHTML = legendInfo;
        return div;
    }


    legend.addTo(myMap);
  
}

