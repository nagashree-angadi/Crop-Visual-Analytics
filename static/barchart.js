function draw_bar_chart(input) {

    var title = document.getElementById("pca-title")
    title.innerText = "TOP 10 PRODUCERS OF CROP"

    var format = d3.format(",");
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([0, -1])
        .html(function (d) {
            return "<strong>Year: </strong><span class='details'>" + d.key + "<br></span>" +
                "<strong>Produce: </strong><span class='details'>" + format(d.value) + "</span>";
        })
    
    data = input.chart_data
    country = input.country
    var barWidth = document.getElementById("bar-chart").offsetWidth;
    var barHeight = document.getElementById("bar-chart").offsetHeight -
        document.getElementById("bar-chart").children[0].offsetHeight - 40;

    var margin = { top: 1, right: 20, bottom: 80, left: 58 },
        width = barWidth - margin.left - margin.right,
        height = barHeight - margin.top - margin.bottom;

    var xScale = d3.scaleBand()
        .domain(data.map(function (d) { return d.key; }))
        .range([0, width])
        .padding(0.1);

    var yScale = d3.scaleLinear()
        .domain([d3.min(data, function (d) { return d.value; }), d3.max(data, function (d) { return d.value; })])
        .range([height, 0]);

    var color = d3.scaleOrdinal(d3.schemeCategory20b)
        .domain([d3.min(data, function (d) { return d.value; }), d3.max(data, function (d) { return d.value; })]);

    var location = d3.select('#bar-chart')
    location.selectAll("svg").remove();
    location.selectAll("div").remove();

    var svg = d3.select("#bar-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(40)")
        .style("text-anchor", "start");

    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale).tickFormat(d3.formatPrefix(".0", 1e6)));

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return xScale(d.key); })
        .attr("y", function (d) { return yScale(d.value); })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
            h = height - yScale(d.value)
            if(h == 0)
                h = 1; 
            return h;
        })
        .attr("fill", function (d){ return color(d.value); })
        .on('click', function (d) {
            updateLineChart(d.key, country);
            updatePieChart(d.key);
        })
        .on('mouseover', function (d){
            tip.show(d);
        })
        .on('mouseout', function (d) {
            tip.hide(d);
        });
}