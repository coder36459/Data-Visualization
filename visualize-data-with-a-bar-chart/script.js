"use strict";
const source = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

function app(data) {
	const dateValue = data;
	const w = 800;
	const h = 600;
	const p = 50;
	const xScale = d3.scaleLinear().domain([0, d3.max(dateValue, (d, i) => i)]).range([p, w - p]);
	const yScale = d3.scaleLinear().domain([0, d3.max(dateValue, (d) => d[1])]).range([h - p, p]);
	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScale);
	const svg = d3.select("body").append("svg").attr("width", w).attr("height", h);
	svg.selectAll("rect").data(dateValue).enter().append("rect").attr("class", "bar").attr("data-date", (d) => d[0]).attr("data-gdp", (d) => d[1])
	svg.append("text").attr("id", "title")
	svg.append("g").attr("transform", "translate(0, " + (h - p) + ")").attr("id", "x-axis").call(xAxis);
	svg.append("g").attr("transform", "translate(" + p + ",0)").attr("id", "y-axis").call(yAxis);
}

fetch(source).then(response => response.json()).then(data => {app(data.data)});
