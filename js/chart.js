

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
    

    const config = {
        type: 'line',
        data: {
            datasets: [{
                label: cLabel,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: cData
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            
        }
  };

var myChart = new Chart(
    document.getElementById('myChart'),
    config
    );
}

function datFix(val) {
    var month = val.substring(4, val.length);
    //const myArray = val.split("_");
    //console.log(month + myArray[2]);
    return month ;
}