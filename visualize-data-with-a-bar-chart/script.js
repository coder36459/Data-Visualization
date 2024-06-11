"use strict";
const source = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

function app(data) {
	const dateValue = data;
	console.log(dateValue);
}

fetch(source).then(response => response.json()).then(data => {app(data.data)});
