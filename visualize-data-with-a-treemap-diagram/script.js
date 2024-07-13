"use strict";
const backgroundColor = ["rgb(255,137,255)", "rgb(233,216,250)", "rgb(255,216,255)", "rgb(255,197,228)",];
const color = ["rgba(176, 112, 235, 0.1)", "rgba(176, 112, 235, 0.2)", "rgba(176, 112, 235, 0.3)", "rgba(176, 112, 235, 0.4)", "rgba(176, 112, 235, 0.5)", "rgba(176, 112, 235, 0.6)", "rgba(176, 112, 235, 0.7)", "rgba(176, 112, 235, 0.8)", "rgba(176, 112, 235, 0.9)", "rgba(176, 112, 235, 1.0)", "rgb(75, 0, 130)",];
let scale = [];
let value = 1;
function select(x) {
	if (x == undefined) {
		value = 1;
		}
	else {
		document.body.innerHTML= "";
		value = x;
	}
	const source = {
		kickstarterPledges: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
		movieSales: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
		videoGameSales: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
	};
	const res = response => response.json();
	function app(a, b, c, n) {
		const kickstarterFundingData = a, movieData = b, videoGameSalesData = c;
		const description = "<p>Choose any set: <span onclick='select(1)'>Kickstarter Data</span>, <span onclick='select(2)'>Movies Data</span>, <span onclick='select(3)'>Video Game Data</span></p>";
		const size = {"width": 1000, "height": 500}
		const tip = d3.select("body")
		.append("div")
		.attr("id", "tooltip");
		function createTreemap(data) {
			const svg = d3.select("body")
			.append("svg")
			.attr("width", size.width)
			.attr("height", size.height)
			.attr("id", "treemap")
			const root = d3.hierarchy(data, (d) => d.children)
			.sum((d) => d.value)
			.sort((a, b) => (b.value - a.value));
			const treemap = d3.treemap()
			.size([size.width, size.height])
			.paddingInner(1)
			treemap(root);
			const dataTiles = root.leaves();
			const max = Math.max.apply(Math, dataTiles.map(x => x.data.value));
			const min = Math.min.apply(Math, dataTiles.map(x => x.data.value));
			const r = Math.round((max - min) / 10);
			scale = [];
			let i = 0;
			while (i < 10) {
				let sMax, sMin, sR;
				if (r > min) {
					if (max > 1e2 && min > 1e2) {
						sMin = Math.floor(min / 1e5) * 1e5;
						sMax = Math.round(max / 1e4) * 1e4;
						sR = Math.round((sMax - sMin) / 9 / 1e5) * 1e5;
					}
					else {
						sMin = Math.floor(min);
						sMax = Math.round(max);
						sR = Math.round((sMax - sMin) / 8.6);
					}
					scale.push(sMin + i * sR);
				}
				else {
					sMin = Math.floor(min / 1e6) * 1e6;
					sMax = Math.round(max / 1e6) * 1e6;
					sR = Math.round((sMax - sMin) / 9 / 1e6) * 1e6;
					scale.push(sMin + i * sR);
				}
				i++;
			}
			const tile = svg.selectAll("g")
			.data(dataTiles)
			.enter()
			.append("g")
			.attr("transform", (d) => "translate(" + d.x0 + ", " + d.y0 + ")")
			tile.append("rect")
			.attr("class", "tile")
			.attr("fill", (d) => {
				let j = 0;
				while (j <= 10) {
					if (scale[j] > parseInt(d.data.value)) {
						return color[j];
					}
					j++;
				}
			})
			.attr("data-name", (d) => d.data.name)
			.attr("data-category", (d) => d.data.category)
			.attr("data-value", (d) => d.data.value)
			.attr("width", (d) => d.x1 - d.x0)
			.attr("height", (d) => d.y1 - d.y0)
			.on("mouseover", (e, i) => {
				tip.transition()
				.attr("data-value", i.data.value)
				.style("visibility", "visible")
				tip.html(i.data.name + "<br>" + i.data.category + "<br>" + new Intl.NumberFormat("en-US").format(i.data.value))
				.style("left", (event.pageX + 16) + "px")
				.style("top", (event.pageY + 7) + "px")
				.style("color", color[10])
				.style("background", backgroundColor[0])
			})
			.on("mouseout", (e, i) => {
				tip.transition().style("visibility", "hidden")
			});
			tile.append("text")
			.text((d) => d.data.value.substring(0, 3))
			.attr("x", 3)
			.attr("y", 15)
		}
		function header() {
			const title = "Visualize Data with a Treemap Diagram";
			d3.select("body").append("div").html(title).attr("id", "title");
			d3.select("body").append("div").html(description).attr("id", "description");
		}
		function chooseTreemap(x) {
			function first(v) {
				document.body.style.backgroundColor = backgroundColor[v];
				createTreemap(kickstarterFundingData);
			}
			function second(v) {
				document.body.style.backgroundColor = backgroundColor[v];
				createTreemap(movieData);
			}
			function third(v) {
				document.body.style.backgroundColor = backgroundColor[v];
				createTreemap(videoGameSalesData);
			}
			x == 1 ? first(x) : x == 2 ? second(x) : third(x);
		}
		function legend() {
			const size = {"width": 850, "height": 90, "padding": 50};
			function colorLegend(num) {
				let k = 0;
				while(k <= 10) {
					if (num <= scale[k]) {
						return color[k];
					}
					k++;
				}
			}
			const legend = d3.select("body")
			.append("svg")
			.attr("width", size.width)
			.attr("height", size.height)
			.attr("id", "legend");
			legend.selectAll("rect")
			.data(scale)
			.enter()
			.append("rect")
			.attr("x", (d, i) => 80 * i + 50)
			.attr("y", 20)
			.attr("width", 80)
			.attr("height", 30)
			.attr("class", "legend-item")
			.attr("fill", (d, i) => colorLegend(d));
			const legendXScale = d3.scaleBand()
			.domain(scale)
			.rangeRound([size.padding,size.width]);
			const legendAxis = d3.axisBottom(legendXScale)
			.tickFormat((d) => new Intl.NumberFormat("en-US").format(d))
			.ticks(10);
			legend.append("g")
			.attr("transform", "translate(0, " + (100 - size.padding) + ")")
			.attr("id", "legend-axis")
			.call(legendAxis);
		}
		header();
		chooseTreemap(n);
		legend();
	}
	Promise.all([
	fetch(source.kickstarterPledges).then(res),
	fetch(source.movieSales).then(res),
	fetch(source.videoGameSales).then(res),
	]).then(data => {app(data[0],data[1],data[2],value);});
}
select();
