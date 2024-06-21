"use strict";
const source = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
function app(data) {
  const w = 800;
  const h = 460;
  const p = 50;
  const xScale = d3.scaleLinear().domain([d3.max(data, (d, i) => d.Year + 1), d3.min(data, (d, i) => d.Year - 1)]).range([w - p, p]);
  const yScale = d3.scaleLinear().domain([d3.max(data, (d, i) => d.Seconds * 1e3), d3.min(data, (d, i) => d.Seconds * 1e3)]).range([p, h - p]);
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
  const svg = d3.select("body").append("svg").attr("width", w).attr("height", h).style("background", "pink");
  svg.append("g").attr("transform", "translate(0, " + (h - p) + ")").attr("id", "x-axis").call(xAxis);
  svg.append("g").attr("transform", "translate(" + p + ",0)").attr("id", "y-axis").call(yAxis);
}
fetch(source).then(response => response.json()).then(data => {d3.select("body").append("div").attr("id", "title").text("Visualize Data with a Scatterplot Graph");app(data)});
