window.addEventListener("load",function() {
    $.get("/allcrops-by-country", {'data': 'received'}, function(allcropsByCountry) {
            data = JSON.parse(allcropsByCountry.chart_data)
    });

    $.get("/top-producers", {'data': 'Wheat'}, function(topProducers) {
                data = JSON.parse(topProducers.chart_data)
    });

    $.get("/production-by-year", {'data': 'Wheat'}, function(productionByYear) {
                data = JSON.parse(productionByYear.chart_data)
    });

    $.get("/crop-by-continent", {'data': 'Wheat'}, function(cropByContinent) {
                data = JSON.parse(cropByContinent.chart_data)
    });
});

function updateGraphs() {

    var crop = document.getElementById("crop-selector").value;
    console.log(crop)

    $.get("/top-producers", {'data': crop}, function (topProducers) {
        data = JSON.parse(topProducers.chart_data)
    });

    $.get("/production-by-year", {'data': crop}, function (productionByYear) {
        data = JSON.parse(productionByYear.chart_data)
    });

    $.get("/crop-by-continent", {'data': crop}, function (cropByContinent) {
        data = JSON.parse(cropByContinent.chart_data)
    });
}