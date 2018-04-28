/*
* PLEASE READ DISCLAIMER.txt
*
*
* Name: Lennert Jansen
* Student number: 10488952
* Data Processing, Spring 2018
* Homework assignment week 3
* Interactive barchart in Javascript
*/


// create two empty lists for JSON data to be stored within said lists
var countries = [];
var gdpPerCapita = [];

// retrieve data from JSON file for manipulation with D3
d3.json("2016_top19_correct.json", function(data) {

    // store JSON data in seperate lists created above
    for (var iter = 0; iter < data.length; iter++){

        countries.push(data[iter]["Country"])
        gdpPerCapita.push(Number(data[iter]["gdp_per_capita"]))

    }

    // set svg canvas specifications
    var w = 960;
    var h = 500;
    var barSpace = 1;
    var padding = 40;

    // generate linear scale for height and create corresponding y axis function
    var yScale = d3.scale.linear()
                    .domain([d3.min(gdpPerCapita), d3.max(gdpPerCapita)])
                    .range([h - padding, 0]);
    var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");

    // generate linear scale for height and create corresponding y axis function
    var xScale = d3.scale.ordinal()
                    .domain(countries)
                    .rangeRoundBands([2, w + padding]);
    var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");

    // create d3.tip variable and return its label for every bar element
    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                        return "<strong>GDP per capita:</strong> <span style='color:red'>" + d + "</span>";
                })

    // create svg canvas element with margins and store in variable for later
    var svg = d3.select("body")
                .append("svg")
                .attr("class", "chart")
                .attr("width", w  + (padding * 3))
                .attr("height", h + (padding * 2));

    // call tip functionality
    svg.call(tip);

    // generate visual element for the y axis by calling yAxis function
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + padding*0.95 + ",1)")
        .call(yAxis);

    // generate visual element for the x axis by calling xAxis function and
    // include rotated labels at every tick for every country
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(40," + (h + barSpace) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(40)")
        .style("text-anchor", "start");

        // create a bar (or rect) for every datum
        svg.selectAll("rect")
           .data(gdpPerCapita)
           .enter()
           .append("rect")
           .attr("class", "chart")
           .attr("x", function(d, i){
                return (i * ((w + (padding)) / data.length)) + padding
            }) // calculate x coordinate of rect
            .attr("y", function(d, i){
                    return yScale(d)
            }) // calculate y coordinate of rect
            .attr("width", w / data.length - barSpace) // determine bar width
            .attr("height", function (d){
                return h - yScale(d);
            }) // determine bar height
            .on('mouseover', tip.show) // ensure tip appears and disappears
            .on('mouseout', tip.hide);

    // append text for x axis label
    var xAxisLabel = svg.append("text")
                        .attr("x", (w  + (padding * 3)) / 2)
                        .attr("y", h + (padding * 1.75) )
                        .style("text-anchor", "middle")
                        .text("Country");
});
