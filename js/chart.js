

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
            cData.push({ x: "" +datFix(key), y:""+value});
        cData.join();
        }
    });
    var predictSize = Object.keys(cData).length - 6;

    const config = {
        type: 'line',
        data: {
            datasets: [{
                label: cLabel,
                backgroundColor: 'rgb(0, 0, 0)',
                borderColor: 'rgb(0, 0, 0)',
                data: cData,
                pointBackgroundColor: function (context) {
                    
                    var index = context.dataIndex;
                    var value = context.dataset.data[index];
                    return index >= predictSize ? 'green' : index < predictSize & value.y < 0 ? '#FF5252' :  // draw negative values in red
                        index < predictSize & value.y > 0 ? '#0583D2' :    // else, alternate values in blue and green
                            'black';
                    
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
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'x',
                    }
                },
            }
        }
    };


    
    var myChart = new Chart(
    document.getElementById('myChart'),
    config
    );
}

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

function pieChartRender(props) {
    // <block:setup:1>
    const data = {
        labels: [
            'Forest',
            'Builtup',
            'Water','Cropland'
        ],
        datasets: [{
            label: 'My First Dataset',
            data: [props.Forest, props.Builtup, props.Water, props.Cropland],
            backgroundColor: [
                'darkgreen',
                'yellow',
                '#2B65EC','#CD7F32'
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

