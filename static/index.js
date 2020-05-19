window.addEventListener("load", function () {
    // $.get("/crop-names", { 'data': 'received' }, function (cropNames) {
    //     data = cropNames.res
    //     var list = document.getElementById('crop-selector');
    //     for (i = 0; i < data.length; i++) {
    //         list.options[i] = new Option(data[i], data[i]);
    //     }
    // });

    $.get("/allcrops-by-country", { 'data': 'received' }, function (data) {
        draw_maps(data.geodata, data.yeild);
    });

    $.get("/top-producers", { 'data': '4' }, function (data) {
        draw_bar_chart(data)
    });

    $.get("/production-by-year", {'crop': 'Wheat' , 'country': '4'}, function (data) {
        draw_line(data);
    });

    $.get("/crop-by-continent", { 'data': 'Wheat' }, function (data) {
        draw_pie_chart(data)
    });
});

// function updateGraphs() {

//     var crop = document.getElementById("crop-selector").value;
//     console.log(crop)

//     $.get("/top-producers", { 'data': crop }, function (data) {
//         console.log(data)
//         draw_bar_chart(data)
//     });

//     // $.get("/production-by-year", { 'data': '4' }, function (data) {
//     //     draw_line(data);
//     // });

//     $.get("/crop-by-continent", { 'data': crop }, function (data) {
//         console.log(data)
//         draw_pie_chart(data)
//     });
// }

function updateLineChart(crop, country){
    $.get("/production-by-year", {'crop': crop , 'country': country}, function (data) {
        draw_line(data);
    });
}

function updateBarChart(country){
    $.get("/top-producers", { 'data': country }, function (data) {
        draw_bar_chart(data);
    });
}

function updatePieChart(crop){
    $.get("/production-by-year", { 'data': crop }, function (data) {
        draw_pie_chart(data);
    });
}

function screeplot()
{
    $.get("/soil_data_screeplot", {'data': 'received'}, function (soil_data) {
        data = JSON.parse(soil_data.chart_data)
        console.log(data)
        draw_screeplot(data)
    });
}