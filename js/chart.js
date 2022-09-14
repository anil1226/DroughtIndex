

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
                    return value.y < 0 ? '#FF5252' :  // draw negative values in red
                        value.y > 0 ? '#0583D2' :    // else, alternate values in blue and green
                            'green';
                },
                pointBorderWidth: 2,
                pointRadius: 4,
                pointBorderColor: function (context) {

                    var index = context.dataIndex;
                    
                    return index >= predictSize ? 'green' :  // draw negative values in red
                        //value.y > 0 ? 'blue' :    // else, alternate values in blue and green
                            'black';
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
                }
            }
        }
    };


    
    var myChart = new Chart(
    document.getElementById('myChart'),
    config
    );
}

