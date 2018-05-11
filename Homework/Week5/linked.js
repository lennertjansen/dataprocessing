/*
* Name: Lennert Jansen
* Student number: 10488952
* Date: 8 May 2018
* Linked Views: combining two interactive data visualisations
*
*/

window.onload = function() {

    // append segment to body containing author and assignment information
    authorInfo = d3.select("body")
                .append("p").text("Name: Lennert Jansen")
                .append("p").text("Student number: 10488952")
                .append("p").text("Course: Data processing, spring 2018")
                //.append("p").append("a").text("Link to source (OECD)").attr("href", "https://stats.oecd.org/BrandedView.aspx?oecd_bv_id=region-data-en&doi=data-00531-en");

    // get data using API queries
    var dataAPI1 = "https://stats.oecd.org/SDMX-JSON/data/CITIES/US106+US107+US114+US012+US122+US124+US125+US128+US134+US135+US014+US146+US190+US196+US202+US209+US210+US242+US245+US250+US259+US003+US033+US045+US048+US055+US069+US084+US103+US115+US117+US133+US141+US147+US149+US154+US155+US159+US160+US161+US170+US174+US178+US180+US181+US186+US195+US205+US212+US213+US223+US227+US233+US234+US237+US241+US251+US252+US261+US035+US038+US039+US044+US060+US065+US070+US077+US081+US089+US097.POP_CORE+POP_DENS_CORE+GDP_PC+LABOUR_PRODUCTIVITY+UNEMP_R/all?startTime=2012&endTime=2012&dimensionAtObservation=allDimensions" // contains data concerning GDP, population density and unemployment for 70 US cities

    var dataAPI2 = "https://stats.oecd.org/SDMX-JSON/data/CITIES/US106+US107+US114+US012+US122+US124+US125+US128+US134+US135+US014+US146+US190+US196+US202+US209+US210+US242+US245+US250+US259+US003+US033+US045+US048+US055+US069+US084+US103+US115+US117+US133+US141+US147+US149+US154+US155+US159+US160+US161+US170+US174+US178+US180+US181+US186+US195+US205+US212+US213+US223+US227+US233+US234+US237+US241+US251+US252+US261+US035+US038+US039+US044+US060+US065+US070+US077+US081+US089+US097.POP_0_14+POP_15_64+POP_65MORE/all?startTime=2012&endTime=2012&dimensionAtObservation=allDimensions" // contains data concerning the population by age group for 70 US cities

    d3.queue()
        .defer(d3.request, dataAPI1)
        .defer(d3.request, dataAPI2)
        .awaitAll(makeScatter);
};


// loads data and creates scatterplot
function makeScatter(error, response){

    // error check
    if (error) throw error;

    // parse API key for scatterplot into JSON format
    var jsonDataScatter = JSON.parse(response[0].responseText);

    // create empty object for scatterplot data
    dataScatter = [];

    // organise the scattered JSON objects
    for (let i = 0; i < 70; i++){

        index0 = i + ":" + "0:0"; // index for gdp per capita
        index1 = i + ":" + "1:0"; // index for unemployment rate
        index2 = i + ":" + "2:0"; // index for population
        index3 = i + ":" + "3:0"; // index for population density
        index4 = i + ":" + "4:0"; // index for labour productivity

        // create object in which a single city's info will be stored
        cityObjectScatter = {
            "name": jsonDataScatter.structure.dimensions.observation[0].values[i]["name"],
            "gdp_pc": jsonDataScatter.dataSets[0].observations[index0][0],
            "unemp_r": jsonDataScatter.dataSets[0].observations[index1][0],
            "pop_core": jsonDataScatter.dataSets[0].observations[index2][0],
            "pop_dens_core": jsonDataScatter.dataSets[0].observations[index3][0],
            "labour_productivity": jsonDataScatter.dataSets[0].observations[index4][0]
        };

    // push city object to data dictionary
    dataScatter.push(cityObjectScatter);

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

    // set dimensions for scatterplot's side of svg canvas
    var scatterMargin = {
        top: 30,
        right: 105,
        bottom: 50,
        left: 35
    };
    scatterOuterWidth = 525;
    scatterOuterHeight = 500;
    scatterWidth = scatterOuterWidth - scatterMargin.left - scatterMargin.right;
    scatterHeight = scatterOuterHeight - scatterMargin.top - scatterMargin.bottom;

    // apply desired formatting for percentages
    var formatPercent = d3.format('.2%');

    // create svg element for scatterplot
    var scatterSvg = d3.select("body").append("svg")
        .attr("width", scatterOuterWidth)
        .attr("height", scatterOuterHeight)
        .append("g")
        .attr("transform", "translate(" + scatterMargin.left + ", "
        + scatterMargin.top + ")");

    // specifications of scales for x and y coordinates
    var xScale = d3.scaleLinear()
                    .domain(d3.extent(dataScatter, function(d) {return d.gdp_pc})).nice()
                    .range([0, scatterWidth]);

    var yScale = d3.scaleLinear()
                    .domain(d3.extent(dataScatter, function(d) {return d.unemp_r})).nice()
                    .range([scatterHeight, 0]);

    // create scale for radii as a function of population of the city
    var rScale = d3.scaleLinear()
                    .domain(d3.extent(dataScatter, function(d) {return d.pop_core})).nice()
                    .range([5, 20]); // arbitrarily chosen min and max radii

    // initialize axes
    var xAxis = d3.axisBottom()
        .scale(xScale);
    var yAxis = d3.axisLeft()
        .scale(yScale);

    // draw axes
    scatterSvg.append("g")
        .attr('id', 'xAxis')
        .attr('class', 'x axis')
        .attr("transform", "translate(0, " + scatterHeight + ")")
        .call(xAxis);
    scatterSvg.append("g")
        .attr('id', 'yAxis')
        .attr('class', 'y axis')
        .call(yAxis);

    // write initial labels for x and y axes, respectively
    scatterSvg.append("text")
        .attr('id', 'xAxisLabel')
        .attr('class', "axisLabel")
        .attr("transform", "translate(0 " + scatterHeight + ")")
        .attr("x", scatterWidth)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("GDP per capita (USD 2010)");
    scatterSvg.append("text")
        .attr('id', 'yAxisLabel')
        .attr('class', 'axisLabel')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Unemployment rate(%)');

    // create info box for tip containing name, population and density
    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-20, 0]).html(function(d, i) {
         return "<strong>City:</strong> <span style='color:white'>" + d.name
          + "</span>" + "<br>" + "Population: " + d.pop_core + "<br>" +
      "Population density: " + d.pop_dens_core });

    scatterSvg.call(tip);

    // create cricles for every datum in scatterData
    scatterSvg.selectAll('circle')
        .data(dataScatter)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', function(d) {
            return rScale(d.pop_core);
        })
        .attr('cx', function(d) {
            return xScale(d.gdp_pc);
        })
        .attr('cy', function(d) {
            return yScale(d.unemp_r);
        })
        .style("fill", function(d) {
            return color(dataScatter, d.pop_dens_core);
        })
        .style("stroke", "black")
        .on("mouseover", tip.show) // ensure tip appears and disappears
        .on("mouseout", tip.hide)
        .on("click", function(d){
            makePie(response[1], d.name);
        });

        // change y axis variable, y scale and the y position of circles
        function yChange() {

            var value = this.value // get user generated input
            yScale.domain(d3.extent(dataScatter, function(d) { return d[value]}))
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
            xScale.domain(d3.extent(dataScatter, function(d) { return d[value]})).nice()
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

// Hmmmmmmmm, pie
function makePie(dataAPI2, name){

    d3.select('#pieChart').remove();

    // parse API key for scatterplot into JSON format
    var jsonDataPie = JSON.parse(dataAPI2.responseText);

    // create empty object for scatterplot data
    dataPie = [];

    // organise the JSON objects
    for (let i = 0; i < 70; i++){

        index0 = i + ":" + "0:0"; // population, Total, Old (65more)
        index1 = i + ":" + "1:0"; // population, Total, Youth (0-14)
        index2 = i + ":" + "2:0"; // population, Total, Working age (15-64)

        // create object in which a single city's info will be stored
        cityObjectPie = {
            "name": jsonDataPie.structure.dimensions.observation[0].values[i]["name"],
            "pop_65_more": jsonDataPie.dataSets[0].observations[index0][0],
            "pop_0_14": jsonDataPie.dataSets[0].observations[index1][0],
            "pop_15_64": jsonDataPie.dataSets[0].observations[index2][0],
        };

        // push city object to pie chart data dictionary
        dataPie.push(cityObjectPie);

    };

    // set dimensions for scatterplot's side of svg canvas
    var pieMargin = {
        top: 30,
        right: 105,
        bottom: 50,
        left: 35
    };
    pieOuterWidth = 525;
    pieOuterHeight = 500;
    pieWidth = pieOuterWidth - pieMargin.left - pieMargin.right;
    pieHeight = pieOuterHeight - pieMargin.top - pieMargin.bottom;
    radius = Math.min(pieWidth, pieHeight) / 2;

    console.log(dataPie[0])

    var cityName = name;
    var cityData = [];

    for (i = 0; i < dataPie.length; i++){
        if (dataPie[i].name == cityName)
            cityData = [
                {"age_cat" : "Young (0 to 14)", "pop" : dataPie[i].pop_0_14},
                {"age_cat" : "Working (15 to 64)", "pop" : dataPie[i].pop_15_64},
                {"age_cat" : "Senior (65 and over)", "pop" : dataPie[i].pop_65_more},
            ];
    };

    console.log(cityData);

    // apply desired formatting for percentages
    var formatPercent = d3.format('.2%');

    // create svg element for scatterplot
    var pieSvg = d3.select("body").append("svg")
        .attr('id', 'pieChart')
        .attr("width", pieOuterWidth)
        .attr("height", pieOuterHeight);

    g = pieSvg.append("g").attr('transform', "translate(" + pieWidth / 2 + ", " + pieHeight / 2 +")");

    var color = d3.scaleOrdinal(["#fde0dd", "#fa9fb5", "#c51b8a"]);

    var pie = d3.pie()
        .sort(null)
        .value(function(d) {
            return d.pop;
        });

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(20);

    var label = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var arc = g.selectAll(".arc")
        .data(pie(cityData))
        .enter()
        .append("g")
        .attr("class", "arc");

    // create info box for tip containing name, population and density
    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-20, 0]).html(function(d, i) {
         return "<strong>Age Group:</strong> <span style='color:white'>" + d.data.age_cat
          + "</span>" + "<br>" + "Population: " + d.data.pop});

    pieSvg.call(tip);

    arc.append("path")
        .attr("d", path)
        .attr("fill", function(d) {
            return color(d.data.age_cat);
        })
        .on("mouseover", tip.show) // ensure tip appears and disappears
        .on("mouseout", tip.hide);

    arc.append("text")
        .attr("class", "sliceLabel")
        .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
        .attr("dy", "0.35em")
        .text(function(d) { return d.data.age_cat; });

    pieSvg.append("text")
        .attr("class", "pieLabel")
        .attr("x", pieWidth / 2)
        .attr("y", (radius * 2.5))
        .text(cityName)


};

// categorise population density into three categories and represent
// using colorblind friendly sequential coloring
function color(data, density) {

    maxDens = d3.extent(data, function(d) {return d.pop_dens_core})[1];
    minDens = d3.extent(data, function(d) {return d.pop_dens_core})[0];

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
