window.addEventListener("load",function() {
    $.get("/allcrops-by-country", {'data': 'received'}, function(data) {
        draw_maps(data.geodata, data.yeild);
    });

    $.get("/top-producers", {'data': 'Wheat'}, function(data) {
        console.log(data);
    });

    $.get("/production-by-year", {'data': '4'}, function(data) {
        draw_line(data);
    });

    $.get("/crop-by-continent", {'data': 'Wheat'}, function(data) {
        console.log(data);
    });
});

function updateGraphs() {

    var crop = document.getElementById("crop-selector").value;
    console.log(crop)

    $.get("/top-producers", {'data': crop}, function (data) {
        console.log(data)
    });

    $.get("/production-by-year", {'data': '4'}, function (data) {
        draw_line(data);
    });

    $.get("/crop-by-continent", {'data': crop}, function (data) {
        console.log(data)
    });
}