//leaflet options
var mapOptions = { center: [-0.5, 35.1], zoom: 3, maxZoom: 12, minZoom: 3, zoomSnap: 0.97, zoomControl: false, zoomsliderControl: true, scrollWheelZoom: false, };
//map create
var map = L.map('map', mapOptions);
//add zoom
var zoomHome = L.Control.zoomHome({ position: 'topleft' });
zoomHome.addTo(map); map.setZoom(3);

//add base maps light and dark
var Light = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    //attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
var dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 19,
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

// add world cover wms
var wmsLayer = L.tileLayer.wms('https://services.terrascope.be/wms/v2', {
    layers: 'WORLDCOVER_2020_MAP'
});


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

// get month value
function getMonthFromString(mon) {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1
}

// add spi layers
var countries;
var districts;
var opacVal = 0.8;

// load spi and chart on landing
loadLayers();
getBarChartData('0');

function loadLayers() {
    countries = L.geoJSON(level0, { style: style, onEachFeature: onEachFeature }).addTo(map);
    districts = L.geoJSON(null, { style: style, onEachFeature: onEachFeature }).addTo(map);
}

// geojson data properties proceessing
var allProps = [];
var barProps = [];
var spiData;
var barlblName;
var arr1 = Object.values(level1);

// bar chart data
function getBarChartData(level) {
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
    barProps = allProps.sort((a, b) => parseFloat(a.data) - parseFloat(b.data)).slice(0, 5);
    resetBarCanvas();
    barChartRender();
}

// map spi style
function style(feature) {
    return {
        
        weight: 2,
        opacity: 1,
        color: '#000000',
        //dashArray: '3',
        fillOpacity: opacVal,
        fillColor: getColor(feature.properties[latestmonth])
    };
}

function getColor(e) {
    return (e >= 1 ? '#16558F' : e > 0.5 && e < 1 ? '#0583D2' : e > 0 && e < 0.5 ? '#61B0B7' : e > -1 && e < -0.5 ? '#FF5252' : e > -0.5 && e < 0 ? '#FF7B7B' : e < -1 ? '#FF0000' : e = null ? '#FFFFFF' : '"#FFFFFF"')
}

// spi tooltip and actions
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
        fillOpacity: opacVal,
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
    map.fitBounds(e.target.getBounds(), {
    padding: [100, 100]});
    isoCode = layer.feature.properties.iso_a2;
    mapClicked(layer.feature.properties);
    getBarChartData('1');
}

// click on level 1
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

    //map.fitBounds(e.target.getBounds());

    lastClickedLayer = layer;
    resetCanvas();
    chartData(layer.feature.properties, '1');
    updateStats(layer.feature.properties, '1');
    PieCanvas(layer.feature.properties);
}

// population number formatter
function numFormatter(num) {
    if (num > 999 && num < 1000000) {
        return (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
    } else if (num > 1000000) {
        return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
    } else if (num < 900) {
        return num; // if value < 1000, nothing to do
    }
}

// stats function
function updateStats(props, level) {
    var cName;
    if (level == "0")
        cName = props.NAME;
    else if (level == "1")
        cName = props.name + ' (' + props.admin + ')';
    $("#lblName").text(cName);
    $("#lblPopu").text(numFormatter(props.Population));
}

var level0Props;
// on click of level 0
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
    showHide('chrBtns');
    level0Props = props;
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

// adding level 1 to map
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

// filtering country selection
function disFilter(feature) {
    if (feature.properties.iso_a2 === isoCode)
        return true
}


// legend of drought index
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


function showHide(element1) {
    var x = document.getElementById(element1);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

// refresh/reset clicked
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
    showHide('chrBtns');
    //showHide('exportCSV');
    getBarChartData('0');
    PieCanvas();
}

// changed month
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
    if (map.hasLayer(districts)) {
        if (isoCode != '0') { 
            addDisToMap();
            getBarChartData('1');
        }
    }
    
}

// fix dates of props
function datFix(val) {
    var month = val.substring(4, val.length);
    return month;
}

// month number to name
function toMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString('en-US', {
        month: 'short',
    });
}

// map layer menu
var baseMaps = {

    "Light": Light,
    "Dark": dark

};

var overlayMaps = {
    " ": {
        "World Cover": wmsLayer,
        //"spi": countries,
        //"spi Level1": districts
    }
};

var options = {
    // Make the "Landmarks" group exclusive (use radio inputs)
    //exclusiveGroups: ["Layers"],
    // Show a checkbox next to non-exclusive group labels for toggling all
    groupCheckboxes: false,
    position: 'topleft',
    collapsed: false
};

var layerControl = L.control.groupedLayers(baseMaps, overlayMaps, options);
map.addControl(layerControl);


// change opacity
function updateOpacity(value) {
    
    countries.setStyle({ fillOpacity: value });
    districts.setStyle({ fillOpacity: value });
    opacVal = value;
} 

// legend for world cover
var wcLegend = L.control({ position: 'bottomright' });

wcLegend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML +=
        '<img src="world_cover.png" alt="legend" width="134" height="147">';
    return div;
};


map.on('overlayadd', function (eventLayer) {
    if (eventLayer.name === 'World Cover') {
        wcLegend.addTo(this);
    } 
});

map.on('overlayremove', function (eventLayer) {
    if (eventLayer.name === 'World Cover') {
        this.removeControl(wcLegend);
    } 
});

//if clicked ouside the country boundary
map.on('click', function (e) {
    var popLocation = e.latlng;
    inOutCheck(popLocation);
});

var outSide = true;
function inOutCheck(cood) {
    districts.eachLayer(function (memberLayer) {
        if (memberLayer.contains(cood)) {
            outSide = false;
        }
        
    });

    if (outSide) {
        addDisToMap();
        resetCanvas();
        chartData(level0Props, '0');
        updateStats(level0Props, '0');
        PieCanvas(level0Props);
    }
        
    outSide = true;
}