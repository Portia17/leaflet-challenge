let myMap = L.map("map", {
    center: [40.1755, -98.3173],
    zoom: 4
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
  
let quakedata= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function chooseColor(option) {
    if (option <= 10) return "LimeGreen";
    else if (option <=30) return "GreenYellow";
    else if (option <=50) return "Yellow";
    else if (option <=70) return "Orange";
    else if (option <=90) return "DarkOrange";
    else return "Red";
}

d3.json(quakedata).then(function(data){
    console.log(data)
    quakes=data.features
    console.log("quakes",quakes)

  // Loop through the data.
    for (let i = 0; i < quakes.length; i++) {

        let lon = quakes[i].geometry.coordinates[0];
        let lat= quakes[i].geometry.coordinates[1];
        let magnitude= quakes[i].properties.mag;
        let deapth= quakes[i].geometry.coordinates[2];
        L.circle([lat, lon], {
            color: "Black",
            fillColor: chooseColor(deapth),
            fillOpacity: 0.75,
            radius: magnitude * 15000,
            weight: .5
        }).bindPopup(`<h1>Coordinates: ${lat}, ${lon}</h1> <hr> <h3>Magnitude: ${magnitude}, Deapth: ${deapth}</h3>`).addTo(myMap)
    }
    
    // let legend = L.control({ position: "bottomright" });
    // legend.onAdd = function (map) {
    //     colors = ["LimeGreen", "GreenYellow", "Yellow", "Orange", "DarkOrange", "Red"]

    //     var div = L.DomUtil.create('div', 'info legend');
    //     labels = ['<div>Deapth</div>'],
    //     deapths = ['-10-10','10-30','30-50','50-70','70-90','90+'];

    //     for (var i = 0; i < deapths.length; i++) {
    //             labels.push("<li style=\"background-color: " + colors[i] + "\"></li>");
    //     }
    //     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    //     return div;
    // }   
    // legend.addTo(map);
  
    // Adding the legend to the map
})

let legend = L.control({ position: "bottomright" });
legend.onAdd = function (map) {
    colors = ["LimeGreen", "GreenYellow", "Yellow", "Orange", "DarkOrange", "Red"]

    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<div>Deapth</div>'],
    deapths = ['-10-10','10-30','30-50','50-70','70-90','90+'];

    for (var i = 0; i < deapths.length; i++) {
            labels.push("<li style=\"background-color: " + colors[i] + "\"></li>");
    }
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
}   
legend.addTo(map);