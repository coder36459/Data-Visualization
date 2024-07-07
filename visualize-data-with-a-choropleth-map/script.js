"use strict";
const source = {
	county: "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json",
	education: "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json",
};
const res = response => response.json();
function app(a, b) {
	const countyData = topojson.feature(a, a.objects.counties).features, educationData = b;
	const c = ["rgb(214,225,255)", "rgb(174,196,255)", "rgb(135,167,255)", "rgb(96,139,255)", "rgb(57,110,255)", "rgb(17,81,255)", "rgb(0,68,253)", "rgb(0,57,214)", "rgb(0,47,174)", "rgb(0,41,155)", "rgb(0,36,135)", "rgb(0,31,116)", "rgb(0,20,76)", "rgb(0,15,57)", "rgb(0,10,37)", "rgb(0,5,17)"];
	let i = 1, t = [], s = [];
	while (i < 17) {
		t.unshift(i);
		s.unshift(i * 5);
		i++;
	}
	function map() {
		const size = {"width": 950, "height": 640};
		const path = d3.geoPath();
		function search(num) {
			const n = educationData.findIndex(x => x.fips == num);
			return educationData[n].bachelorsOrHigher;
		}
		function colorMap(num) {
			let i = 15;
			while (i >= 0) {
				if (num <= s[i]) {
					return c[i]
				}
				i--;
			}
		}
		const tip = d3.select("body").append("div").attr("id", "tooltip");
		function edu(num) {
			const n = educationData.findIndex(x => x.fips == num);
			return educationData[n].area_name + ", " + educationData[n].state + ": " + educationData[n].bachelorsOrHigher + "%";
		}
		const svg = d3.select("body").append("svg").attr("width", size.width).attr("height", size.height);
		svg.selectAll("path")
		.data(countyData)
		.enter()
		.append("path")
		.attr("class", "county")
		.attr("data-fips", (d, i) => d.id)
		.attr("data-education", (d, i) => search(d.id))
		.attr("d", path)
		.attr("fill", (d, i) => colorMap(Math.floor(search(d.id))))
		.on("mouseover", (e, i) => {
			tip.transition().style("visibility", "visible").attr("data-education", search(i.id));
			tip.html(edu(i.id))
			.style("left", (event.pageX + 16) + "px")
			.style("top", (event.pageY + 7) + "px")
			.style("background", "rgb(204,204,204)")
		})
		.on("mouseout", (e, i) => {
			tip.transition().style("visibility", "hidden")
		});
	}
	function legend() {
		const size = {"width": 850, "height": 90, "padding": 50};
		const max = Math.max.apply(Math, educationData.map(x => x.bachelorsOrHigher));
		const min = Math.min.apply(Math, educationData.map(x => x.bachelorsOrHigher));
		function colorLegend(num) {
			let i = 15;
			while(i >= 0) {
				if (num <= t[i]) {
					return c[i];
				}
				i--;
			}
		}
		const legend = d3.select("body").append("svg").attr("width", size.width).attr("height", size.height).attr("id", "legend");
		legend.selectAll("rect")
		.data(t)
		.enter()
		.append("rect")
		.attr("x", (d, i) => 50 * d)
		.attr("y", 20)
		.attr("width", 50)
		.attr("height", 30)
		.attr("fill", (d, i) => colorLegend(d));
		const legendXScale = d3.scaleBand().domain(s).rangeRound([size.width,size.padding]);
		const legendAxis = d3.axisBottom(legendXScale).tickFormat((d) => d + "%").ticks(16);
		legend.append("g").attr("transform", "translate(0, " + (100 - size.padding) + ")").attr("id", "legend-axis").call(legendAxis);
	}
	function title() {
		const title = "Visualize Data with a Choropleth Map";
		d3.select("body").append("div").html(title).attr("id", "title");
	}
	function description() {
		const description = "";
		d3.select("body").append("div").html(description).attr("id", "description");
	}
	title();
	map();
	legend();
	description();
}
Promise.all([
  fetch(source.county).then(res),
  fetch(source.education).then(res),
]).then(data => {app(data[0],data[1])});
