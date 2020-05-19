function draw_line(data){

    var lineWidth = document.getElementById("line-chart").offsetWidth;
    var lineHeight = document.getElementById("line-chart").offsetHeight - document.getElementById("line-chart").children[0].offsetHeight - 40;
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = lineWidth - margin.left - margin.right ,
        height = lineHeight - margin.top - margin.bottom;

    var svg = d3.select("#line-chart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.date; }))
        .range([ 0, width ]);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.value; })])
        .range([ height, 0 ]);
        svg.append("g")
        .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.date) })
            .y(function(d) { return y(d.value) })
        )

}