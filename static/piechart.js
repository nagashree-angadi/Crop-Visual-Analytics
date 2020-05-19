function draw_pie_chart(data) {
	var margin = { top: 0, right: 0, bottom: 0, left: 0 };

	var width = 280 - margin.left - margin.right;
	var height = 280 - margin.top - margin.bottom;
	var fullWidth = width + margin.left + margin.right;
	var fullHeight = height + margin.top + margin.bottom;
	var radius = Math.min(width, height) / 2;

	var color = d3.scaleOrdinal(d3.schemeCategory20b);

	var location = d3.select('#pie-chart')
	location.selectAll("svg").remove()

	var svg = d3.select("#pie-chart").append("svg")
		.attr("width", fullWidth)
		.attr("height", fullHeight);

	var g = svg.append("g")
		.attr("transform", "translate(" + (fullWidth / 2) + "," + (fullHeight / 2) + ")")
		.attr("class", "chartGroup");

	var donutWidth = (width / 4);

	var arc = d3.arc()
		.innerRadius(donutWidth)
		.outerRadius(radius);

	var pie = d3.pie()
		.value(function (d) { return d.Value })
		.sort(null);

	var tooltip = d3.select('#pie-chart')
		.append('div')
		.attr('class', 'tooltip')

	tooltip.append('div')
		.attr('class', 'Continent');
	tooltip.append('div')
		.attr('class', 'Value');
	tooltip.append('div')
		.attr('class', 'percent');



	var path = g.selectAll('path')
		.data(pie(data))
		.enter()
		.append('path')
		.attr('d', arc)
		.attr('fill', function (d, i) {
			return color(d.data.Continent);
		})
		.each(function (d) { this._current = d; });

	path.on('mousemove', function (d) {
		var xposSub = document.getElementById("pie-chart").getBoundingClientRect().left;
		var xpos = d3.event.x - xposSub
		var ypos = d3.event.y - 400
		tooltip.style("left", xpos + "px")
		tooltip.style("top", ypos + "px")
		var total = d3.sum(data.map(function (d) {
			return (d.enabled) ? d.Value : 0;
		}));
		var percent = Math.round((d.data.Value / total) * 100)
		tooltip.select('.Continent').html(d.data.Continent);
		tooltip.select('.Value').html(d.data.Value);
		tooltip.select('.percent').html(percent + '%');
		tooltip.style('display', 'inline-block');
	});



	path.on('mouseout', function (d) {
		tooltip.style('display', 'none');

	});

	var legendRectSize = 10;
	var legendSpacing = 5;

	var legend = g.selectAll('.legend')
		.data(color.domain())
		.enter()
		.append('g')
		.attr('class', 'legend')
		.attr('transform', function (d, i) {
			var height = legendRectSize + legendSpacing;
			var offset = height * color.domain().length / 2;
			var horz = -2 * legendRectSize;
			var vert = i * height - offset;
			return 'translate(' + horz + ',' + vert + ')';
		});

	legend.append('rect')
		.attr('width', legendRectSize)
		.attr('height', legendRectSize)
		.style('fill', color)
		.style('stroke', color)

		.on('click', function (Continent) {
			var rect = d3.select(this);
			var enabled = true;
			var totalEnabled = d3.sum(data.map(function (d) {
				return (d.enabled) ? 1 : 0;
			}));

			if (rect.attr('class') === 'disabled') {
				rect.attr('class', '');
			} else {
				if (totalEnabled < 2) return;
				rect.attr('class', 'disabled');
				enabled = false;
			}

			pie.value(function (d) {
				if (d.Continent === Continent) d.enabled = enabled;
				return (d.enabled) ? d.Value : 0;
			});

			path = path.data(pie(data));

			path.transition()
				.duration(750)
				.attrTween('d', function (d) {
					var interpolate = d3.interpolate(this._current, d);
					this._current = interpolate(0);
					return function (t) {
						return arc(interpolate(t));
					};
				});
		});


	legend.append('text')
		.attr('x', legendRectSize + legendSpacing)
		.attr('y', legendRectSize - legendSpacing)
		.attr('style', 'font-size: 10')
		.attr('alignment-baseline', 'middle')
		.text(function (d) { return d; });

}