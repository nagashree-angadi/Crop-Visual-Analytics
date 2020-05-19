function draw_bar_chart(data)
{
    var margin = {top: 1, right: 10, bottom: 90, left: 70},
                width = 600 - margin.left - margin.right,
                height = 280 - margin.top - margin.bottom;

    var xScale = d3.scaleBand()
        .domain(data.map(function(d) { return d.Country; }))
        .range([0, width])
        .padding(0.1);


    var yScale = d3.scaleLinear()
        .domain([d3.min(data, function(d) { return d.Value; }), d3.max(data, function(d) { return d.Value; })])
        .range([height, 0])


    var location = d3.select('#bar-chart')
    location.selectAll("svg").remove()

    var svg = d3.select("#bar-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    var tooltip = d3.select("#bar-chart").append("div").attr("class", "tooltip");

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

    // svg.append("text")
    //     .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 60) + ")")
    //     .style("text-anchor", "middle")
    //     .text("Country");

    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale).tickFormat(d3.formatPrefix(".0", 1e6)));


    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Production");


    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return xScale(d.Country); })
        .attr("y", function (d) { return yScale(d.Value); })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) { return height - yScale(d.Value); })

        .on("mousemove", function(d){
            d3.select(this).style('fill', 'cadetblue')
            var xposSub = document.getElementById("bar-chart").getBoundingClientRect().left;
          var xpos = d3.event.x - xposSub
          var ypos = d3.event.y
          tooltip.style("left" ,xpos + "px")
          tooltip.style("top", ypos + "px")
            tooltip.html((d.Country) + "<br>" + (d.Value));
          tooltip.style("display", "block");
        })
        .on("mouseout", function(d){
            d3.select(this).style('fill', 'steelblue')
            tooltip.style("display", "none");
        });
}