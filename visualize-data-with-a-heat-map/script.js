"use strict";
const source = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
function app(data) {
	const v = data.monthlyVariance;
	const bT = data.baseTemperature;
	const size = {"width": 950, "height": 460};
	const margin = {"top": 30, "right": 18, "bottom": 50, "left": 80};
	let x, y = [];
	for (x in v) {
		y.push(data.monthlyVariance[x].year);
	}
	const yMax = Math.max.apply(Math, y);
	const yMin = Math.min.apply(Math, y);
	const description = "Monthly Global Land-Surface Temperature from " + yMin + " to " + yMax + " (base temperature " + bT + " &degC)";
	const c = ["rgb(0,0,78)", "rgb(0,0,137)", "rgb(0,0,255)", "rgb(39,39,255)", "rgb(118,118,255)", "rgb(157,157,255)", "rgb(196,196,255)", "rgb(255,196,196)", "rgb(255,157,157)", "rgb(255,118,118)", "rgb(255,78,78)", "rgb(255,39,39)", "rgb(255,0,0)"];
	function color(num) {
		let n = num - 1;
		if (n > 14) {
			return c[1];
		}
		if (n < 1) {
			return c[0];
		}
		else {
			let i = 1;
			while(i < 13) {
				if (n <= i) {
					return c[i];
				}
			i++;
			}
		}
	}
	function convertToString(num) {
		const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		return month[num - 1];
	}
	const xScale = d3.scaleLinear().domain([(d3.max(v, (d, i) => d.year)) + 1,d3.min(v, (d, i) => d.year)]).range([size.width - margin.right, margin.left]);
	const yScale = d3.scaleTime().domain([new Date(0,0,0,0,0,0,0),new Date(0,12,0,0,0,0,0)]).range([margin.top, size.height - margin.bottom]);
	const tip = d3.select("body").append("div").attr("id", "tooltip");
	const svg = d3.select("body").append("svg").attr("width", size.width).attr("height", size.height).style("background", "#ccc");
	svg.selectAll("rect")
	.data(v)
	.enter()
	.append("rect")
	.attr("class", "cell")
	.attr("fill", (d, i) => color(Math.floor(bT + d.variance)))
	.attr("data-year", (d, i) => d.year)
	.attr("x", (d, i) => xScale(d.year))
	.attr("data-month", (d, i) => d.month - 1)
	.attr("y", (d, i) => yScale(new Date(0, d.month - 1, 0,0,0,0,0)))
	.attr("data-temp", (d, i) => bT + d.variance)
	.attr("width", 5)
	.attr("height", (size.height - 2 * margin.top)/12)
	.on("mouseover", (e, i) => {
		tip.transition().style("visibility", "visible").attr("data-year", i.year);
		tip.html("Year: " + i.year + "<br>Month: " + convertToString(i.month) + "<br>Variance: " + (i.variance).toFixed(2) + " &degC" + "<br>Temperature: " + (bT + i.variance).toFixed(2) + " &degC")
		.style("left", (event.pageX + 16) + "px")
		.style("top", (event.pageY + 7) + "px")
		.style("background", "rgb(204,204,204)")
	})
	.on("mouseout", (e, i) => {
		tip.transition().style("visibility", "hidden")
	});
	const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(20);
	svg.append("g").attr("transform", "translate(0, " + (size.height - margin.bottom) + ")").attr("id", "x-axis").call(xAxis);
	const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B")).ticks(12);
	svg.append("g").attr("transform", "translate(" + margin.left + ",0)").attr("id", "y-axis").call(yAxis);
	d3.select("body").append("div").attr("id", "description").html(description);
	let i = 1, t = [];
	while (i < 14) {
		t.push(i);
		i++;
	}
	const legend = d3.select("body").append("svg").attr("width", 400).attr("height", 90).attr("id", "legend");
	legend.selectAll("rect")
	.data(t)
	.enter()
	.append("rect")
	.attr("x", (d, i) => 50 + (i * 300)/13)
	.attr("y", 20)
	.attr("width", 24)
	.attr("height", 30)
	.attr("fill", (d, i) => color(d));
	const legendXScale = d3.scaleLinear().domain([14,1]).range([400 - 50, 50]);
	const legendAxis = d3.axisBottom(legendXScale).tickFormat(d3.format("d"));
	legend.append("g").attr("transform", "translate(0, " + (100 - 50) + ")").attr("id", "legend-axis").call(legendAxis);
}
fetch(source).then(response => response.json()).then(data => {d3.select("body").append("div").attr("id", "title").text("Visualize Data with a Heat Map");app(data)});
