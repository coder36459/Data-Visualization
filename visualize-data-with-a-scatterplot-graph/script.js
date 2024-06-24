"use strict";
const source = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
function app(data) {
	const w = 800;
	const h = 460;
	const p = 50;
	const t = (d, i) => new Date(d.Seconds * 1e3);
	const tip = d3.select("body").append("div").attr("id", "tooltip");
	const xScale = d3.scaleLinear().domain([d3.max(data, (d, i) => d.Year + 1), d3.min(data, (d, i) => d.Year - 1)]).range([w - p, p]);
	const yScale = d3.scaleLinear().domain([d3.min(data, t), d3.max(data, t)]).range([p, h - p]);
	const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("04d"));
	const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
	const svg = d3.select("body").append("svg").attr("width", w).attr("height", h).style("background", "pink");
	svg.selectAll("circle").data(data).enter().append("circle").attr("class", "dot")
	.attr("data-xvalue", (d, i) => d.Year)
	.attr("cx", (d, i) => xScale(d.Year))
	.attr("data-yvalue", t)
	.attr("cy", (d, i) => yScale(new Date(d.Seconds * 1e3)))
	.attr("r", 6)
	.attr("fill", (d, i) => d.Doping != "" ? "purple" : "navy")
	.on("mouseover", (e, i) => {
		tip.transition().style("visibility", "visible").attr("data-year", i.Year);
		tip.html("Year: " + i.Year + ", " + "Time: " + i.Time)
		.style("left", (event.pageX + 16) + "px")
		.style("top", (event.pageY + 7) + "px")
		.style("background", i.Doping != "" ? "rgb(255,167,255)" : "rgb(167,167,255)")
	})
	.on("mouseout", (e, i) => {
		tip.transition().style("visibility", "hidden")
	});
	svg.append("g").attr("transform", "translate(0, " + (h - p) + ")").attr("id", "x-axis").call(xAxis);
	svg.append("g").attr("transform", "translate(" + p + ",0)").attr("id", "y-axis").call(yAxis);
	svg.append("circle").attr("cx", w - 200).attr("cy", h - 300).attr("r", 9).attr("width", 9).attr("height", 9).attr("fill", "purple");
	svg.append("text").attr("x", w - 180).attr("y", h - 295).text("Yes").attr("id", "legend");
	svg.append("circle").attr("cx", w - 200).attr("cy", h - 270).attr("r", 9).attr("width", 9).attr("height", 9).attr("fill", "navy");
	svg.append("text").attr("x", w - 180).attr("y", h - 265).text("No");
}
fetch(source).then(response => response.json()).then(data => {d3.select("body").append("div").attr("id", "title").text("Visualize Data with a Scatterplot Graph");app(data)});
