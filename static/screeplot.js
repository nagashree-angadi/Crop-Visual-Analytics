function find_elbow(data) {
    var values = new Array();
    for (var i = 0; i < data.length; i++) {
        values[i] = data[i].value
    }
    var cumulative_values = new Array();
    for (var i = 0; i < data.length; i++) {
        cumulative_values[i] = data[i].cumulative
    }
    //console.log(values)
    var derivatives = new Array();
    for (var j = 1; j < data.length - 1; j++) {
        derivatives[j] = values[j + 1] + values[j - 1] - 2 * values[j]
    }
    //console.log(derivatives)
    max_index = derivatives.indexOf(d3.max(derivatives))
    // console.log(max_index+1)
    return { 'index': max_index + 1, 'value': values[max_index], 'cumulat': cumulative_values[max_index] }
}

function draw_screeplot(data2) {
    var title = document.getElementById("pca-title")
    title.innerText = "SOIL DATA PCA SCREE PLOT"

    var barWidth = document.getElementById("bar-chart").offsetWidth;
    var barHeight = document.getElementById("bar-chart").offsetHeight -
        document.getElementById("bar-chart").children[0].offsetHeight - 40;

    var margin = { top: 1, right: 10, bottom: 40, left: 70 },
        width = barWidth - margin.left - margin.right,
        height = barHeight - margin.top - margin.bottom;

    var xScale = d3.scaleBand()
        .domain(data2.map(function (d) { return d.key; }))
        .range([0, width])
        .padding(0.1);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data2, function (d) { return d.cumulative; })])
        .range([height, 0]);

    // console.log(find_elbow(data2))
    var line = d3.line()
        .x(function (d) { return xScale(d.key); })
        .y(function (d) { return yScale(d.cumulative); })

    var location = d3.select('#bar-chart')
    location.selectAll("svg").remove()


    var svg = d3.select("#bar-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
        .style("text-anchor", "middle")
        .text("Component");

    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale))

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 25)
        .attr("x", 0 - (height / 2))
        .attr("dy", "10px")
        .style("text-anchor", "middle")
        .text("Explained-Variance");

    svg.append("path")
        .datum(data2)
        .attr("class", "line")
        .attr("d", line);

    svg.selectAll(".dot")
        .data(data2)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", function (d) { return xScale(d.key) })
        .attr("cy", function (d) { return yScale(d.cumulative) })
        .attr("r", 3);


    svg.selectAll(".bar")
        .data(data2)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return xScale(d.key); })
        .attr("y", function (d) { return yScale(d.value); })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) { return height - yScale(d.value); });

    svg.append("rect")
        .attr("class", "elbowbar")
        .attr("x", xScale(find_elbow(data2).index))
        .attr("y", yScale(find_elbow(data2).value))
        .attr("width", xScale.bandwidth())
        .attr("height", (height - yScale(find_elbow(data2).value)));

    // svg.append("circle")
    //     .attr("class", "elbow")
    //     .attr("cx", xScale(find_elbow(data2).index))
    //     .attr("cy", yScale(find_elbow(data2).cumulat))
    //     .attr("r", 6);



    // console.log(find_elbow(data2))

}