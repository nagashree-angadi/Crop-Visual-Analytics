function draw_maps(world, population) {
    var format = d3.format(",");

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([0, -1])
        .html(function (d) {
            return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" +
                "<strong>Total Produce: </strong><span class='details'>" + format(d.population) + "</span>";
        })

    var mapWidth = document.getElementById("map-chart").offsetWidth;
    var mapHeight = document.getElementById("map-chart").offsetHeight -
        document.getElementById("map-chart").children[0].offsetHeight - 40;

    var margin = { top: 0, right: 4, bottom: 4, left: 8 },
        width = mapWidth - margin.left - margin.right,
        height = mapHeight - margin.top - margin.bottom;

    var color = d3.scaleThreshold()
        .domain([4000000, 10000000, 50000000, 500000000, 900000000,
            1000000000, 5000000000, 9000000000, 10000000000, 40000000000])
        .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)",
            "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)",
            "rgb(8,48,107)", "rgb(3,19,43)"]);

    var path = d3.geoPath();

    var svg = d3.select("#map-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append('g')
        .attr('class', 'map');

    var projection = d3.geoMercator()
        .scale(130)
        .translate([width / 2, height / 1.5]);

    var path = d3.geoPath().projection(projection);

    svg.call(tip);

    var populationById = {};

    var data = topojson.feature(world, world.objects.countries)
    population.forEach(function (d) { populationById[d.id] = +d.value; });
    data.features.forEach(function (d) { d.population = populationById[parseInt(d.id)] });

    svg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr("d", path)
        .style("fill", function (d) { return color(populationById[parseInt(d.id)]); })
        .style('stroke', 'white')
        .style('stroke-width', 1.5)
        .style("opacity", 0.8)
        // tooltips
        .style("stroke", "white")
        .style('stroke-width', 0.3)
        .on('mouseover', function (d) {
            tip.show(d);
            d3.select(this)
                .style("opacity", 1)
                .style("stroke", "white")
                .style("stroke-width", 3);
        })
        .on('mouseout', function (d) {
            tip.hide(d);
            d3.select(this)
                .style("opacity", 0.8)
                .style("stroke", "white")
                .style("stroke-width", 0.3);
        })
        .on('click', function (d) {
            updateLineChart("Wheat", d.id);
            updateBarChart(d.id);
        });

    svg.append("path")
        .datum(topojson.mesh(data.features, function (a, b) { return a.id !== b.id; }))
        .attr("class", "names")
        .attr("d", path);
}