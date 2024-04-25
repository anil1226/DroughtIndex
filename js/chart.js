// line chart
var ExportData = [];
function chartData(props,level) {
    //cData = [{ x: '2016-12-25', y: 20 }, { x: '2016-12-26', y: 10 }];
    var cData = [];
    var cLabel;
    if (level == "0")
        cLabel = props.NAME;
    else if (level == "1")
        cLabel = props.name + ' (' + props.admin +')';
    
    $.each(props, function (key, value) {
        if (key.startsWith("c") && !key.startsWith("cat")) {
            cData.push({ x: "" + datFixN(key), y:""+value});
        cData.join();
        }
    });
    ExportData = cData;
    var predictSize = Object.keys(cData).length - 6;

    var startMonth = cData[predictSize].x;
    var endMonth = cData[predictSize+5].x;

    const config = {
        type: 'line',
        data: {
            datasets: [{
                label: cLabel,
                backgroundColor: 'rgb(0, 0, 0)',
                borderColor: 'rgb(0, 0, 0)',
                data: cData,
                pointBackgroundColor: function (context) {
                    
                    //var index = context.dataIndex;
                    //var value = context.dataset.data[index];
                    //return index >= predictSize ? 'green' : index < predictSize & value.y < 0 ? '#FF5252' :  // draw negative values in red
                    //    index < predictSize & value.y > 0 ? '#0583D2' :    // else, alternate values in blue and green
                    //        'black';
                    var index = context.dataIndex;
                    var value = context.dataset.data[index];
                    return value.y < 0 ? '#FF5252' :  // draw negative values in red
                        value.y > 0 ? '#0583D2' :    // else, alternate values in blue and green
                            'green';
                    
                },
                pointBorderWidth: 2,
                pointRadius: 4,
                pointBorderColor: function (context) {

                    var index = context.dataIndex;
                    var value = context.dataset.data[index];
                    return value.y < 0 ? '#FF5252' :  // draw negative values in red
                        value.y > 0 ? '#0583D2' :    // else, alternate values in blue and green
                            'green';
                }
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,

            scales: {
                x: {
                    type: 'time',
                    time: {
                        parser: 'MMM-yy',
                        tooltipFormat: 'MMM-yy',
                        unit: 'month',
                        unitStepSize: 1,
                        displayFormats: {
                            'month': 'MMM-yy'
                        },
                        
                    },
                    title: {
                        display: true,
                        text: 'Month'
                    },
                    min: 'Jan-10'
                },
                y: {
                    title: {
                        display: true,
                        text: 'Index'
                    }
                }
            },
            plugins: {
                autocolors: false,
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: 0,
                            yMax: 0,
                            borderColor: 'rgb(0, 0, 0)',
                            borderWidth: 3,
                        },
                        box1: {
                            type: 'box',
                            xMin: startMonth,
                            xMax: endMonth,
                            yMin: -3,
                            yMax: 3,
                            backgroundColor: 'rgba(144, 238, 144, 0.50)',
                            
                        }
                    }
                },
                legend: {
                    display: true,
                    labels: {
                        color: 'rgb(0, 0, 0)',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    }
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: false,
                        },
                        pinch: {
                            enabled: false
                        },
                        drag: {
                            enabled: true,
                            threshold: 12
                        },
                        mode: 'x',
                    },
                    //limits: {
                    //    x: { min: '01-2010' },

                    //}
                }
            }
        }
    };


    
    window.myLine = new Chart(
    document.getElementById('myChart'),
    config
    );
}

// bar chart
function barChartRender() { 

var barLbls = [];
var barData = [];
$.each(barProps, function (key,value) {
    barLbls.push(value.lable);
    barData.push(value.data);
});
const data = {
    labels: barLbls,
    datasets: [
        {
            label: 'Index',
            data: barData,
            borderColor: 'rgb(0, 0, 0)',
            backgroundColor: function (context) {

                var index = context.dataIndex;
                var value = context.dataset.data[index];
                return value < 0 ? '#FF5252' :  // draw negative values in red
                    value > 0 ? '#0583D2' :    // else, alternate values in blue and green
                        'green';
            },
        }
    ]
};
// </block:setup>
// <block:config:0>
const config = {
    type: 'bar',
    data: data,
    options: {
        indexAxis: 'y',
        // Elements options apply to all of the options unless overridden in a dataset
        // In this case, we are setting the border of each horizontal bar to be 2px wide
        elements: {
            bar: {
                borderWidth: 2,
            }
        },
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right', display: false
            },
            title: {
                display: true,
                text: 'Top 5 with extreme drought'
            }
        }
    },
};
// </block:config>


var barChart = new Chart(
    document.getElementById('barChart'),
    config
    );
}

// pie chart
function pieChartRender(props) {
    // <block:setup:1>
    const data = {
        labels: ['Shrub', 'Herb', 'Crop', 'Built', 'Bare', 'Water', 'Wetland', 'Moss', 'Forest', 'Snow', 'Others'],
        datasets: [{
          label: '%',
          data: [
            props.lc_shrub, 
            props.lc_herb, 
            props.lc_crop, 
            props.lc_built, 
            props.lc_bare, 
            props.lc_water, 
            props.lc_wetl, 
            props.lc_moss, 
            props.lc_for, 
            props.lc_snow, 
            props.lc_others
          ],
          backgroundColor: [
            '#2E8B57', // Shrub
            '#98FB98', // Herb
            '#D2B48C', // Crop
            '#D3D3D3', // Built
            '#F5DEB3', // Bare
            '#1E90FF', // Water
            '#556B2F', // Wetland
            '#7CFC00', // Moss
            '#228B22', // Forest
            '#FFFFFF', // Snow
            '#808080'  // Others (Grey)
          ],
          hoverOffset: 4
        }]
      };
      
    // </block:setup>

    // <block:config:0>
    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true, maintainAspectRatio: false,
            
        },
    };
    // </block:config>

    var pieChart = new Chart(
        document.getElementById('pieChart'),
        config
    );
}

// month in correct format
function datFixN(val) {
    var monYear = val.substring(4, val.length);
    var month = monYear.split('_');
    return month[0] + '-' + month[1];
}

// chart zoom
function resetZoom() {
    window.myLine.resetZoom();
}

// export data
function jsonToCSV() {
    debugger;
    //var json = $.parseJSON(ExportData);

    var csv = convertToCSV(ExportData);
    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff", csv]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "data.csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// array to csv
function convertToCSV(arr) {
    const array = [Object.keys(arr[0])].concat(arr)

    return array.map(it => {
        return Object.values(it).toString()
    }).join('\n')
}

