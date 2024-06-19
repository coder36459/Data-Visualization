"use strict";
const source = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
function app(data) {
	const dateValue = data;
	const w = 800;
	const h = 460;
	const p = 50;
	const gdp = d3.max(dateValue, (d, i) => d[1]);
	const tip = d3.select("body").append("div").attr("id", "tooltip");
	const xScale = d3.scaleUtc().domain([d3.min(dateValue, (d, i) => new Date(d[0])), d3.max(dateValue, (d, i) => new Date(d[0]))]).range([p, w - p]);
	const yScale = d3.scaleLinear().domain([0, gdp]).range([h - p, p]);
	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScale);
	const dateScale = d3.scaleLinear().domain([0, (dateValue.length - 1)]).range([p, w - p]);
	const gdpScale = d3.scaleLinear().domain([0, gdp]).range([0, h - p - p]);
	const svg = d3.select("body").append("svg").attr("width", w).attr("height", h);
	svg.selectAll("rect").data(dateValue).enter().append("rect").attr("class", "bar").attr("fill", "violet")
	.attr("width", 3).attr("data-date", (d, i) => d[0]).attr("x", (d, i) => dateScale(i))
	.attr("height", (d, i) => gdpScale(d[1])).attr("data-gdp", (d, i) => d[1]).attr("y", (d, i) => h - p - gdpScale(d[1]))
	.on("mouseover", (d, i) => {
		let m = new Date(i[0]).getMonth(), q;
		if (m == 0) {q = " Q1"};
		if (m == 3) {q = " Q2"};
		if (m == 6) {q = " Q3"};
		if (m == 9) {q = " Q4"};
		tip.transition().style("visibility", "visible");
		tip.html(i[0] + q + "<br>" + new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(i[1]) + " Billion")
		.style("left", (event.pageX + 16) + "px")
		.style("top", (event.pageY + 7) + "px")
		.attr("data-date", i[0]);
		d.target.style.fill = "purple";
	})
	.on("mouseout", (d, i) => {
		tip.transition().style("visibility", "hidden");
		d.target.style.fill = "violet";
	});
	svg.append("g").attr("transform", "translate(0, " + (h - p) + ")").attr("id", "x-axis").attr("class", "tick").call(xAxis);
	svg.append("g").attr("transform", "translate(" + p + ",0)").attr("id", "y-axis").attr("class", "tick").call(yAxis);
}
fetch(source).then(response => response.json()).then(data => {const body = d3.select("body");body.append("div").attr("id", "title").text(data.name.substring(0, 22));body.append("div").attr("id", "duration").text("From " + data.from_date + " to " + data.to_date);app(data.data)});
