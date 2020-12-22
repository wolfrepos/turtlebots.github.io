
var circles = [];
var mymap = L.map('mapid').setView([56.838607, 60.605514], 13);
var line = new L.Polyline([], {
    color: 'red',
    weight: 17,
    opacity: 0.5,
    smoothFactor: 1,
    interactive: false
});

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function createCircle(x, y, id) {
    var circle = L.circleMarker([x, y]);
    circle.id = id;
    circle.setStyle({ color: "#0088cc" });

    circle.on('mouseover', function (e) { circle.setRadius(15); });
    circle.on('mouseout', function (e) { circle.setRadius(10); });

    circle.on('mousedown', function (e) {
        var route = document.getElementById("route-input").value.split(",");
        if (circle.selected === 1) {
          circle.selected = 0;

          document.getElementById("route-input").value = route.filter(x => x != circle.id.toString());
          redrawRoute();
        } else {
          circle.selected = 1;

          route.push(circle.id);
          document.getElementById("route-input").value = route.toString();
          redrawRoute();
        }
    });
    return circle;
}

function redrawRoute() {
    var route = document.getElementById("route-input").value.substring(1).split(',');

    var points = [];
    for (i = 0; i < route.length; ++i) {
        var circle = circles.find(x => x.id == route[i]);
        if (typeof circle != "undefined") {
            points.push(circle.getLatLng());
        }
    }
    line.setLatLngs(points);
    line.addTo(mymap);

    for (i = 0; i < circles.length; ++i) {
        if (route.includes(circles[i].id.toString())) {
            circles[i].selected = 1;
            circles[i].setStyle({ color: "#ff0000" });
        } else {
            circles[i].selected = 0;
            circles[i].setStyle({ color: "#0088cc" });
        }
    }
}

for (i = 0; i < 100; ++i) {
    var x = 56.838607 + rand(-0.05, 0.05);
    var y = 60.605514 + rand(-0.05, 0.05);
    var circle = createCircle(x, y, i);
    circles.push(circle);
    circle.addTo(mymap);
}

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1
}).addTo(mymap);