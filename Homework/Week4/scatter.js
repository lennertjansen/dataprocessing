/*
* Name: Lennert Jansen
* Student number: 10488952
* Date: 4 May 2018
* Scatterplot in JS
*
*/


// encapsulate entire script in function
window.onload = function() {

    // append segment to body containing author and assignment information
    authorInfo = d3.select("body")
                .append("p").text("Name: Lennert Jansen")
                .append("p").text("Student number: 10488952")
                .append("p").text("Course: Data processing, spring 2018")
                .append("p").append("a").text("Link to source (OECD)").attr("href", "https://stats.oecd.org/BrandedView.aspx?oecd_bv_id=region-data-en&doi=data-00531-en");

    // get data using API queries
    var dataAPI2012 = "https://stats.oecd.org/SDMX-JSON/data/CITIES/US106+US107+US114+US012+US122+US124+US125+US128+US134+US135+US014+US146+US190+US196+US202+US209+US210+US242+US245+US250+US259+US003+US033+US045+US048+US055+US069+US084+US103+US115+US117+US133+US141+US147+US149+US154+US155+US159+US160+US161+US170+US174+US178+US180+US181+US186+US195+US205+US212+US213+US223+US227+US233+US234+US237+US241+US251+US252+US261+US035+US038+US039+US044+US060+US065+US070+US077+US081+US089+US097.POP_CORE+POP_DENS_CORE+GDP_PC+LABOUR_PRODUCTIVITY+UNEMP_R/all?startTime=2012&endTime=2012&dimensionAtObservation=allDimensions"

    // queue the querying process to avoid problems as a result of asynchronicity
    d3.queue()
        .defer(d3.request, dataAPI2012)
        .awaitAll(doFunction);

};

function doFunction(error, response) {
    if (error) throw error;

    // parse API string into correct JSON format
    var jsonData2012 = JSON.parse(response[0].responseText);

    // create empty object to store data in
    data2012 = [];

    // organise the scattered JSON objects
    for (let i = 0; i < 70; i++){

        index0 = i + ":" + "0:0"; // index for gdp per capita
        index1 = i + ":" + "1:0"; // index for unemployment rate
        index2 = i + ":" + "2:0"; // index for population
        index3 = i + ":" + "3:0"; // index for population density
        index4 = i + ":" + "4:0"; // index for labour productivity

        // create object in which a single city's info will be stored
        cityObject0 = {
            "name": jsonData2012.structure.dimensions.observation[0].values[i]["name"],
            "gdp_pc": jsonData2012.dataSets[0].observations[index0][0],
            "unemp_r": jsonData2012.dataSets[0].observations[index1][0],
            "pop_core": jsonData2012.dataSets[0].observations[index2][0],
            "pop_dens_core": jsonData2012.dataSets[0].observations[index3][0],
            "labour_productivity": jsonData2012.dataSets[0].observations[index4][0]
        };


        // push city object to data dictionary
        data2012.push(cityObject0);

    };

    // create variable for the DOM element body
    var body = d3.select('body');

    // create list of objects for the dropdown menus
    var selectData = [  { "text" : "unemp_r", "label" : "Unemployment rate (%)"},
                        { "text" : "gdp_pc", "label" : "GDP per capita (USD 2010)"},
                        { "text" : "pop_core", "label" : "Population (persons)"},
                        { "text" : "pop_dens_core", "label" : "Poplation density (persons per km2)"},
                        { "text" : "labour_productivity", "label" : "Labour productivity (Ratio between GDP and total employment)"},
                    ];

    // create dropdown menu and corresponding span for y axis variables
    var span = body.append('span')
                    .text('Select y-axis variable: ');

    var yInput = body.append('select')
                     .attr('id','ySelect')
                     .on('change',yChange) // call yCange function on input
                     .selectAll('option')
                     .data(selectData)
                     .enter()
                     .append('option')
                     .attr('value', function (d) { return d.text })
                     .text(function (d) { return d.label ;});

    body.append('br') // break for space between menus

    // create dropdown menu and corresponding span for y axis variables
    var span = body.append('span')
                    .text('Select x-Axis variable: ');

    var yInput = body.append('select')
                      .attr('id','xSelect')
                      .on('change',xChange) // call xCange function on input
                      .selectAll('option')
                      .data(selectData)
                      .enter()
                      .append('option')
                      .attr('value', function (d) { return d.text })
                      .text(function (d) { return d.label ;})

    body.append('br') // break for space bottom menu and svg canvas

    // set dimensions for svg canvas including margins
    var margin = {
        top: 30,
        right: 210,
        bottom: 50,
        left: 70
    };
    outerWidth = 1050;
    outerHeight = 500;
    width = outerWidth - margin.left - margin.right;
    height = outerHeight - margin.top - margin.bottom;

    var formatPercent = d3.format('.2%');

    // specifications of scales for x and y coordinates
    var xScale = d3.scaleLinear()
                    .domain(d3.extent(data2012, function(d) {return d.gdp_pc})).nice()
                    .range([0, width]);

    var yScale = d3.scaleLinear()
                    .domain(d3.extent(data2012, function(d) {return d.unemp_r})).nice()
                    .range([height, 0]);

    // create scale for radii as a function of population of the city
    var rScale = d3.scaleLinear()
                    .domain(d3.extent(data2012, function(d) {return d.pop_core})).nice()
                    .range([5, 30]); // arbitrarily chosen min and max radii

    // create color scale for population density
    var colorScale = d3.scaleOrdinal()
                        .domain(d3.extent(data2012, function(d) {return d.pop_dens_core}))
                        .range([1, 2, 3]);

    // categorise population density into three categories and represent
    // using colorblind friendly sequential coloring
    function color(density){

        maxDens = d3.extent(data2012, function(d) {return d.pop_dens_core})[1];
        minDens = d3.extent(data2012, function(d) {return d.pop_dens_core})[0];

        if (density < (maxDens + minDens) * (1 / 3)){
            return "#fde0dd"; // low density
        }
        else if (density > (maxDens + minDens) * (2 / 3)){
            return "#c51b8a"; // high density
        }
        else {
            return "#fa9fb5"; // medium density
        }
    };

    // initialize axes
    var xAxis = d3.axisBottom()
                   .scale(xScale);

    var yAxis = d3.axisLeft()
                   .scale(yScale);

    // create svg element
    var svg = d3.select("body").append("svg")
                .attr("width", outerWidth)
                .attr("height", outerHeight)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," +
                margin.top + ")");

    // dwar x axis
    svg.append("g")
        .attr('id','xAxis')
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis);

    // write the first x axis label
    svg.append("text")
        .attr('id', 'xAxisLabel')
        .attr("class", "axisLabel")
        .attr("transform", "translate(0, " + height + ")")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("GDP per capita (USD 2010)");

    // draw y axis
    svg.append("g")
        .attr('id','yAxis')
        .attr("class", "y axis")
        .call(yAxis);

    // write the first y axis label
    svg.append("text")
        .attr('id', 'yAxisLabel')
        .attr("class", "axisLabel")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Unemployment rate (%)");

    // create info box for tip containing name, population and density
    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-20, 0]).html(function(d, i) {
         return "<strong>City:</strong> <span style='color:white'>" + d.name
          + "</span>" + "<br>" + "Population: " + d.pop_core + "<br>" +
      "Population density: " + d.pop_dens_core });

    svg.call(tip);

    // create circles for every data point with radii as function of population
    svg.selectAll("circle")
        .data(data2012)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", function(d) {
            return rScale(d.pop_core);
        })
        .attr("cx", function(d){
            return xScale(d.gdp_pc);
        })
        .attr("cy", function(d) {
            return yScale(d.unemp_r);
        })
        .style("fill", function(d) {
            return color(d.pop_dens_core);
        })
        .style("stroke", "black")
        .on("mouseover", tip.show) // ensure tip appears and disappears
        .on("mouseout", tip.hide);

    // create color density object for legend
    var colorDensity = {
        low: "#fde0dd",
        med: "#fa9fb5",
        high: "#c51b8a"
    };
    legendIndex = [1, 2, 3];

    // create legend in upper right corner as three colored squares
    svg.selectAll("legend")
        .data(legendIndex)
        .enter()
        .append("rect")
        .attr("class", "legend")
        .attr("y", function(d, i){
            return height - height + 100 - (i * 30);
        })
        .attr("x", width)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", function(d, i){
            if (height - height + 100 - (i * 30) == 100 )
                {return "#fde0dd"}
            else if (height - height + 100 - (i * 30) == 70)
                {return "#fa9fb5"}
            else {return "#c51b8a"}
        });

    // append descriptions of what a color represents in the plot
    svg.append("text")
        .attr("font-size", "10px")
        .attr("font-family", "arial")
        .attr("x", width - 10)
        .attr("y", 50)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text("High relative population density");

    svg.append("text")
        .attr("font-size", "10px")
        .attr("font-family", "arial")
        .attr("x", width - 10)
        .attr("y", 80)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text("Medium relative population density");

    svg.append("text")
        .attr("font-size", "10px")
        .attr("font-family", "arial")
        .attr("x", width - 10)
        .attr("y", 110)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text("Low relative population density");

    // append text beneath legend with clarification of what a radius represents
    svg.append("text")
        .attr("font-size", "8px")
        .attr("font-family", "arial")
        .attr("x", width)
        .attr("y", 140)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text("*The radii of the circles represent population");

    // change y axis variable, y scale and the y position of circles
    function yChange() {

        var value = this.value // get user generated input
        yScale.domain(d3.extent(data2012, function(d) { return d[value]}))
        yAxis.scale(yScale) // change scale and axis

        d3.select('#yAxis') // draw new y axis
            .transition().duration(1000)
            .call(yAxis)

        // create empty variable to store new label
        var newLabel = [];

        // iterate through list of objects with labels
        for (i = 0; i < selectData.length; i++){
            if (selectData[i].text == value)
                newLabel = selectData[i].label;
        };

        d3.select('#yAxisLabel') // change label
            .transition().duration(1000)
            .text(newLabel)

        d3.selectAll('circle') // smoothly move the circles in y direction
            .transition().duration(500)
            .delay(function(d, i) {
                return i * 100;
            })
            .attr('cy', function(d) {
                return yScale(d[value]);
            });

    };

    // change x axis variable, x scale and the x position of circles
    function xChange() {

        var value = this.value // get user generated input
        xScale.domain(d3.extent(data2012, function(d) { return d[value]}))
        xAxis.scale(xScale) // change scale and axis

        d3.select('#xAxis') // draw new x axis
            .transition().duration(1000)
            .call(xAxis)

        // create empty variable to store new label
        var newLabel = [];

        // iterate through list of objects with labels
        for (i = 0; i < selectData.length; i++){
            if (selectData[i].text == value)
                newLabel = selectData[i].label;
        };

        d3.select('#xAxisLabel') // change label
          .transition().duration(1000)
          .text(newLabel);

        d3.selectAll('circle') // smoothly move the circles in x direction
           .transition().duration(500)
           .delay(function (d,i) {
                return i * 100
            })
           .attr('cx',function (d) {
               return xScale(d[value])
           });
    };
};
