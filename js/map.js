var mapOptions = { center: [-0.5, 35.1], zoom: 3, maxZoom: 12, minZoom: 3, zoomSnap: 0.97, zoomControl: false, zoomsliderControl: true, scrollWheelZoom: false, };
var map = L.map('map', mapOptions);

var zoomHome = L.Control.zoomHome({ position: 'topleft' });
zoomHome.addTo(map); map.setZoom(3);

//var map = L.map('map').setView([-0.5, 35.1], 3);

var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var countries = L.geoJSON(level0, { style: style, onEachFeature: onEachFeature }).addTo(map);
var districts = L.geoJSON(null, { style: style, onEachFeature: onEachFeature }).addTo(map);

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: '#000000',
        //dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.c153Sep_22)
    };
}

function getColor(e) {
    return (e >= 1 ? '#16558F' : e > 0.5 && e < 1 ? '#0583D2' : e > 0 && e < 0.5 ? '#61B0B7' : e > -1 && e < -0.5 ? '#FF5252' : e > -0.5 && e < 0 ? '#FF7B7B' : e < -1 ? '#FF0000' : e = null ? '#FFFFFF' : '"#FFFFFF"')
}

function onEachFeature(feature, layer) {



    layer.bindTooltip("<b style='color: #000000;font-size: 18px;'>" + feature.properties.NAME + "</b><br/><b style='font-size: 14px;'>" + Math.round(feature.properties.c153Sep_22 * 100) / 100 + " (Sep 2022)</b>",
        {
            //direction: 'right',
            permanent: false,
            sticky: true,
            offset: [10, 0],
            opacity: 3,

            //className: 'leaflet-tooltip-own'
        });

    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        preclick: resetStyle,
        click: zoomToFeature
    });
}

function onEachFeatureDis(feature, layer) {



    layer.bindTooltip("<b style='color: #000000;font-size: 18px;'>" + feature.properties.name + "</b><br/><b style='font-size: 14px;'>" + Math.round(feature.properties.c153Sep_22 * 100) / 100 + " (Sep 2022)</b>",
        {
            //direction: 'right',
            permanent: false,
            sticky: true,
            offset: [10, 0],
            opacity: 3,

            //className: 'leaflet-tooltip-own'
        });

}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 4,
        color: '#000000',
        dashArray: '',
        fillOpacity: 0.4,
        fillColor: '#ffffff00',

    });
}


function resetHighlight(e) {

    countries.resetStyle(this);

}

var lastClickedLayer;
var isoCode;
function zoomToFeature(e) {


    if (lastClickedLayer) {
        countries.resetStyle(lastClickedLayer);
    }
    var layer = e.target;


    map.fitBounds(e.target.getBounds());
    layer.setStyle({
        weight: 2,
        //color: '#00000',
        dashArray: '',
        fillOpacity: 0.4,
        fillColor: '#FFD300'
    });
    isoCode = layer.feature.properties.iso_a2;
    addDisToMap();
    lastClickedLayer = layer;



}

function resetStyle(e) {
    countries.resetStyle(e.target);
}


function addDisToMap() {
    //remove the layer from the map entirely
    if (map.hasLayer(districts)) {
        districts.remove();
    }
    //add the data layer and style based on attribute. 
    districts = L.geoJson(level1, {
        style: style, onEachFeature: onEachFeatureDis, filter: disFilter
        }).addTo(map);
}

function disFilter(feature) {
    if (feature.properties.iso_a2 === isoCode)
        return true
}


var info = L.control({ position: 'bottomleft' });

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info-legend'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    var rngs = ["> 1", "0.5 to 1", "0 to 0.5", "-0.5 to 0", "-1 to -0.5", "< -1"];
    var clrs = ["#16558F", "#0583D2", "#61B0B7", "#FF7B7B", "#FF5252", "#FF0000"];
    //var labels = '<div class="div-legend-css p-0" style="position: absolute; width: 150px;">';
    //labels = labels + '<b> Deviation in %, Water Year: 2020 - 21 </b>';
    var labels = '<b> Drought Index <br/><br/></b>';

    var topcss = "";
    for (var i = 0; i < rngs.length; i++) {
        topcss = i > 0 ? "margin-top: 1px;" : "";
        labels = labels + ' <div style="width:100%;display:inline-flex;' + topcss + '"><div style="height:20px; width:20px; background:' + clrs[i] + '"></div><span class="ml-2">' + (rngs[i]) + '</span></div> ';
    }
    //$('.div-legend-css').html(labels);
    //labels = labels + '</div >';

    this._div.innerHTML = labels;
};

info.addTo(map);
debugger;
var searchControl = new L.Control.Search({
    position: 'topright',
    layer: countries,
    propertyName: 'NAME',
    marker: false,
    moveToLocation: function (latlng, title, map) {
        //map.fitBounds( latlng.layer.getBounds() );
        var zoom = map.getBoundsZoom(latlng.layer.getBounds());
        map.setView(latlng, zoom); // access the zoom
    }
});

searchControl.on('search:locationfound', function (e) {

    //console.log('search:locationfound', );

    //map.removeLayer(this._markerSearch)

    e.layer.setStyle({ fillColor: '#3f0', color: '#0f0' });
    if (e.layer._popup)
        e.layer.openPopup();

}).on('search:collapsed', function (e) {

    countries.eachLayer(function (layer) {	//restore feature color
        countries.resetStyle(layer);
    });
});

map.addControl(searchControl);  //inizialize search control