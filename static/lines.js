function draw_line(data) {

    var location = d3.select('#line-chart')
	location.selectAll("svg").remove()
    var lineWidth = document.getElementById("line-chart").offsetWidth;
    var lineHeight = document.getElementById("line-chart").offsetHeight - document.getElementById("line-chart").children[0].offsetHeight - 40;
    var margin = { top: 5, right: 10, bottom: 35, left: 50 },
        width = lineWidth - margin.left - margin.right,
        height = lineHeight - margin.top - margin.bottom - 10;

    var format = d3.format(",");
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([0, -1])
        .html(function (d) {
            return "<strong>Year: </strong><span class='details'>" + d.year + "<br></span>" +
                "<strong>Produce: </strong><span class='details'>" + format(d.value) + "</span>";
        })
        
    var svg = d3.select("#line-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .domain(data.map(d => d.year))
        .range([0, width])
        .padding(0.1);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d.value; })])
        .range([height, 0]);

    svg.append("g")
        .call( d3.axisLeft(y).tickFormat(d3.formatPrefix(".0", 1e6)));
       
    svg.call(tip);

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function (d) { return x(d.year) })
            .y(function (d) { return y(d.value) })
        )

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", function (d) { return x(d.year) })
        .attr("cy", function (d) { return y(d.value) })
        .attr("r", 3)
        .on('mouseover', function (d){
            tip.show(d);
        })
        .on('mouseout', function (d) {
            tip.hide(d);
        });

}