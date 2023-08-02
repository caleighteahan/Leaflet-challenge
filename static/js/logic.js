let myMap = L.map('map', {
    center: [19.4326, 99.1332],
    zoom: 3
});



L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(myMap);

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

d3.json(url).then(function (data) {
    
    function onEachFeature(feature, layer) {
        
        layer.bindPopup(
          "<h3> Location: " + feature.properties.place + "</h3><hr>" +
          "<p> Time: " + feature.properties.time + "</p>" +
          "<p> Magnitude: " + feature.properties.mag + "</p>" +
          "<p> Depth: " + feature.geometry.coordinates[2] + "</p>"
        );
      }
    function markerSize (mag) {
      return mag * 3;
    }


    function markerColor (depth) {
        if (depth > 100) {
            return "#ff3300";
          } else if (depth > 75) {
            return "#ff9900";
          } else if (depth > 50) {
            return "#ffcc00";
          } else if (depth > 35) {
            return "#66ff33";
          } else if (depth > 11) {
            return "#339933";
          } else {
            return "#3366cc";
          }
        };


    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
            radius: markerSize(feature.properties.mag),
            color: "white",
            weight: 1,
            fillColor: markerColor(feature.geometry.coordinates[2]),
            fillOpacity: 1
              });
            },
        onEachFeature: onEachFeature
        
    }).addTo(myMap);
    

    let legend = L.control({ position: "bottomright" });
    
    legend.onAdd = function() {
      
      let div = L.DomUtil.create("div", "info legend");
      let limits = ["> 100", "99-75", "74-50", "49-35", "34-11", "11 >"];
      let colors = ["#ff3300", "#ff9900", "#ffcc00", "#66ff33", "#339933", "#3366cc"];
      let labels = [];
      
      let legendInfo = "<h1>Earthquake Depth </h1>" + 
      "<div class=\"labels\">" +
      "<div class=\">100\">" + limits[0] + "</div>" +
        "<div class=\"99-75\">" + limits[1] + "</div>" +
         "<div class=\"74-50\">" + limits[2]+ "</div>" +
         "<div class=\"49-35\">" + limits[3] + "</div>" +
         "<div class=\"34-11\">" + limits[4] + "</div>" +
         "<div class=\"11>\">" + limits[5] + "</div>"
      "</div>";
  
      
  
      div.innerHTML = legendInfo;
      
      for (let i = 0; i < limits.length; i++) {
        let label = limits[i];
        let color = colors[i];
        let legendItem = '<i style="background-color:' + color + '"></i> ' + label + '<br>';
        div.innerHTML += legendItem;
      }

      //limits.forEach(function(limit, index) {
       // labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      //});
  
      //div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
    };
  
    
    legend.addTo(myMap);
   
    }
);