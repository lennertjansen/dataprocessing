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

    var formatPercent = d3.format(".0%");


    // create SVG element and store it in a variable for future referencing
    // var svg = d3.select("body")
    //             .append("svg")
    //             .attr("class", "chart")
    //             .attr("width", w  + (padding * 2))
    //             .attr("height", h + padding);

    // generate linear scale for height and create corresponding y axis function
    var yScale = d3.scale.linear()
                    //.domain([d3.min(gdpPerCapita), d3.max(gdpPerCapita)])
                    .domain([d3.min(gdpPerCapita), d3.max(gdpPerCapita)])
                    //.range([h - padding, padding]);
                    .range([h - padding, 0]);
    var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");
                    //.ticks(??);

    // generate linear scale for height and create corresponding y axis function
    var xScale = d3.scale.ordinal()
                    .domain(countries)
                    //.rangeRoundBands([0, w], .1);
                    .rangeRoundBands([2, w + padding]);
    var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");
                    //.ticks(20);

    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                        return "<strong>GDP per capita:</strong> <span style='color:red'>" + d + "</span>";
                        //return (d);
                })

    var svg = d3.select("body")
                .append("svg")
                .attr("class", "chart")
                .attr("width", w  + (padding * 2) + 40)
                .attr("height", h + padding + 40);

    svg.call(tip);

    // // placing a bar for every data value with 'd'
    // svg.selectAll("rect")
    //    .data(gdpPerCapita)
    //    .enter()
    //    .append("rect")
    //    .on('mouseover', tip.show)
    //    .on('mouseout', tip.hide)
    // // calculating the width of every bar
    //     .attr("x", function(d, i){
    //         return (i * ((w + (padding)) / data.length)) + padding
    //     })
    //     // and height
    //     .attr("y", function(d, i){
    //             return yScale(d)
    //     })
    //     // calculating the width of my whole graphic
    //     .attr("width", w / data.length - barSpace)
    //     // and its height
    //     .attr("height", function (d){
    //         return h - yScale(d);
    //         })
    //     // filling the bars with color
    //     .attr("fill", function(d) {
    //                 return "rgb(213, 0, " + (d * 10) + ")";
    //     });



    // generate visual element for the y axis by calling yAxis function
    svg.append("g")
        .attr("class", "y axis")
        //.attr("transform", "translate(" + 40 + ",40)")
        .attr("transform", "translate(" + padding*0.95 + ",1)")
        .call(yAxis);

    // generate visual element for the x axis by calling xAxis function
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

        // placing a bar for every data value with 'd'
        svg.selectAll("rect")
           .data(gdpPerCapita)
           .enter()
           .append("rect")
           .attr("class", "chart")
        // calculating the width of every bar
            .attr("x", function(d, i){
                return (i * ((w + (padding)) / data.length)) + padding
            })
            // and height
            .attr("y", function(d, i){
                    return yScale(d)
            })
            // calculating the width of my whole graphic
            .attr("width", w / data.length - barSpace)
            // and its height
            .attr("height", function (d){
                return h - yScale(d);
                })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
            // filling the bars with color
            // .attr("fill", function(d) {
            //             return "rgb(213, 0, " + (d * 10) + ")";
            // });

    // svg.selectAll(".bar")
    //     .data(data)
    //     .enter().append("rect")
    //     .attr("class", "bar")
    //     .attr("x", function(d) { return x(d.Country); })
    //     .attr("width", xScale.rangeBand())
    //     .attr("y", function(d) { return yScale(d.gdp_per_capita); })
    //     .attr("height", function(d) { return height - yScale(d.gdp_per_capita); })

});
