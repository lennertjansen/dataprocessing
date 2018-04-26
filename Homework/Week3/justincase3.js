// create two empty lists for JSON data to be stored within said lists
var countries = [];
var gdpPerCapita = [];

// retrieve data from JSON file for manipulation with D3
d3.json("2016_manual_copy.json", function(data) {

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

    // create SVG element and store it in a variable for future referencing
    var svg = d3.select("body")
                .append("svg")
                .attr("class", "chart")
                .attr("width", w  + (padding * 2))
                .attr("height", h + padding)
                .attr("transform", "translate(" + padding + "," + 0 + ")");

    // generate linear scale for height and create corresponding y axis function
    var yScale = d3.scale.linear()
                    .domain([d3.min(gdpPerCapita), d3.max(gdpPerCapita)])
                    .range([h - padding, padding]);
    var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");
                    //.ticks(??);

    // generate linear scale for height and create corresponding y axis function
    var xScale = d3.scale.ordinal()
                    .domain(countries)
                    .rangeRoundBands([0, w], .1);
    var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");
                    //.ticks(20);

    // calculate desired bar width
    barWidth = w / data.length;

    // create variable with desired properties of svg rect element
    var bar = svg.selectAll("g")
                    .data(data)
                    .enter()
                    .append("g")
                    .attr("transform", function(d, i) {
                         return "translate(" + (i * barWidth) + ",0)";
                     });

    // generate visual bar element for corresponding datum with desired spacing
    bar.append("rect")
        .attr("y", function(d) { return yScale(d.gdp_per_capita); })
        .attr("height", function(d) { return h - yScale(d.gdp_per_capita); })
        .attr("width", barWidth - barSpace);

    bar.append("text")
        .attr("x", barWidth / 2)
        .attr("y", function(d) { return yScale(d.gdp_per_capita) + 3; })
        .attr("dy", ".75em")
        .text(function(d) { return d.gdp_per_capita; });


    // generate visual element for the y axis by calling yAxis function
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + 40 + ",40)")
        .call(yAxis);

    // generate visual element for the x axis by calling xAxis function
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(40," + (h - padding) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");
});
