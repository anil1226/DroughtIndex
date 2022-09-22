//leaflet options
var mapOptions = { center: [-0.5, 35.1], zoom: 3, maxZoom: 12, minZoom: 3, zoomSnap: 0.97, zoomControl: false, zoomsliderControl: true, scrollWheelZoom: false, };
//map create
var map = L.map('map', mapOptions);
//add zoom
var zoomHome = L.Control.zoomHome({ position: 'topleft' });
zoomHome.addTo(map); map.setZoom(3);
//add base map
var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
//calc latest month in data
var arr0 = Object.values(level0);
var allprops = arr0[3][1].properties;
var monthsfi = [];
$.each(allprops, function (key, value) {
    if (key.startsWith("c") && !key.startsWith("cat")) {
        monthsfi.push({ key, value });
        monthsfi.join();
    }
});
var latestmonth = monthsfi[monthsfi.length - 1].key;
var latestmonthsp = datFix(latestmonth).split('_');
//set month selection value and max
document.getElementById("monthsel").value = "20" + latestmonthsp[1] + "-0" + getMonthFromString(latestmonthsp[0]) + "";
document.getElementById("monthsel").max = "20" + latestmonthsp[1] + "-0" + getMonthFromString(latestmonthsp[0]) + "";

$("#lblMonth").text(latestmonthsp[0] + " " + latestmonthsp[1]); 


function getMonthFromString(mon) {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1
}

var countries;
var districts;

loadLayers();
getBarChartData('0');

function loadLayers() {
    countries = L.geoJSON(level0, { style: style, onEachFeature: onEachFeature }).addTo(map);
    districts = L.geoJSON(null, { style: style, onEachFeature: onEachFeature }).addTo(map);
}

var allProps = [];
var barProps = [];
var spiData;
var barlblName;
var arr1 = Object.values(level1);

//console.log(arr1);

function getBarChartData(level) {
    debugger;
    if (level == '0') {
        spiData = arr0[3];
        barlblName = 'NAME';
    }
    else if (level == '1') {
        spiData = arr1[3].filter(function (el) {
            return el.properties.iso_a2 === isoCode;
        });
        barlblName = 'name';
    }
    allProps = [];
    for (var i = 0; i < spiData.length; i++) {
        if ("properties" in spiData[i]) {
            allProps.push({ lable: spiData[i].properties[barlblName], data: spiData[i].properties[latestmonth] });
            allProps.join();
        }
    }
    debugger;
    barProps = allProps.sort((a, b) => parseFloat(a.data) - parseFloat(b.data)).slice(0, 5);
    resetBarCanvas();
    barChartRender();
}


function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: '#000000',
        //dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties[latestmonth])
    };
}

function getColor(e) {
    return (e >= 1 ? '#16558F' : e > 0.5 && e < 1 ? '#0583D2' : e > 0 && e < 0.5 ? '#61B0B7' : e > -1 && e < -0.5 ? '#FF5252' : e > -0.5 && e < 0 ? '#FF7B7B' : e < -1 ? '#FF0000' : e = null ? '#FFFFFF' : '"#FFFFFF"')
}

function onEachFeature(feature, layer) {



    layer.bindTooltip("<b style='color: #000000;font-size: 18px;'>" + feature.properties.NAME + "</b><br/><b style='font-size: 14px;'>" + Math.round(feature.properties[latestmonth] * 100) / 100 + " (" + latestmonthsp[0] + " " + latestmonthsp[1] + ")</b><br/><b style='font-size: 14px;'>Population: " + numFormatter(feature.properties.Population) + "</b>",
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



    layer.bindTooltip("<b style='color: #000000;font-size: 18px;'>" + feature.properties.name + "</b><br/><b style='font-size: 14px;'>" + Math.round(feature.properties[latestmonth] * 100) / 100 + " (" + latestmonthsp[0] + " " + latestmonthsp[1] + ")</b><br/><b style='font-size: 14px;'>Population: " + numFormatter(feature.properties.Population) + "</b>",
        {
            //direction: 'right',
            permanent: false,
            sticky: true,
            offset: [10, 0],
            opacity: 3,

            //className: 'leaflet-tooltip-own'
        });
    layer.on({
        click: clickDis
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
var isoCode = '0';
function zoomToFeature(e) {

    var layer = e.target;
    document.getElementById("map").style.height = "70%";
    setTimeout(function () { map.invalidateSize() }, 100);
    map.fitBounds(e.target.getBounds());
    isoCode = layer.feature.properties.iso_a2;
    mapClicked(layer.feature.properties);
    getBarChartData('1');
}

function clickDis(e) {


    if (lastClickedLayer) {
        districts.resetStyle(lastClickedLayer);
    }
    var layer = e.target;
    layer.setStyle({
        weight: 4,
        color: '#000000',
        dashArray: '',
        fillOpacity: 0.4,
        fillColor: '#77dd77',

    });

    lastClickedLayer = layer;
    resetCanvas();
    chartData(layer.feature.properties, '1');
    updateStats(layer.feature.properties, '1');
    PieCanvas(layer.feature.properties);
}

function numFormatter(num) {
    if (num > 999 && num < 1000000) {
        return (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
    } else if (num > 1000000) {
        return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
    } else if (num < 900) {
        return num; // if value < 1000, nothing to do
    }
}

function updateStats(props, level) {
    var cName;
    if (level == "0")
        cName = props.NAME;
    else if (level == "1")
        cName = props.name + ' (' + props.admin + ')';
    $("#lblName").text(cName);
    $("#lblPopu").text(numFormatter(props.Population));
}

function mapClicked(props) {
    addDisToMap();
    map.removeLayer(countries);    
    showHide("refreshButton");
    resetCanvas();
    chartData(props, '0');
    updateStats(props, '0');
    PieCanvas(props);
    showHide("chartArea");
    showHide('h4Pop');
}

function resetCanvas() {
    $('#myChart').remove(); // this is my <canvas> element
    $('#chartArea').append('<canvas id="myChart"><canvas>');
}
function resetBarCanvas() {
    $('#barChart').remove(); // this is my <canvas> element
    $('#barChartArea').append('<canvas id="barChart"><canvas>');
}
function PieCanvas(props) {
    $('#pieChart').remove(); // this is my <canvas> element
    $('#pieChartArea').append('<canvas id="pieChart"><canvas>');
    if (props)
        pieChartRender(props);
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


function showHide(element1) {
    var x = document.getElementById(element1);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function refClicked() {
    document.getElementById("map").style.height = "100%";
    setTimeout(function () { map.invalidateSize() }, 100);
    map.setView([-0.5, 35.1], 3);
    map.removeLayer(districts);
    isoCode = '0';
    countries.addTo(map);
    showHide("refreshButton");
    showHide("chartArea");
    $("#lblName").text('Africa and Middle East');
    showHide('h4Pop');
    getBarChartData('0');
    PieCanvas();
}

function monChanged() {
    var e = document.getElementById("monthsel");
    var splitt = e.value.split('-');
    var result = monthsfi.find(item => item.key.includes(toMonthName(splitt[1]) + "_" + splitt[0].slice(-2)));
    latestmonth = result.key;
    latestmonthsp = datFix(latestmonth).split('_');
    $("#lblMonth").text(latestmonthsp[0] + " " + latestmonthsp[1]); 
    if (map.hasLayer(countries)) {
        countries.remove();
        loadLayers();
        getBarChartData('0');
    }
    debugger;
    if (map.hasLayer(districts)) {
        if (isoCode != '0') { 
            addDisToMap();
            getBarChartData('1');
        }
    }
    
}

function datFix(val) {
    var month = val.substring(4, val.length);
    return month;
}
function toMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString('en-US', {
        month: 'short',
    });
}


