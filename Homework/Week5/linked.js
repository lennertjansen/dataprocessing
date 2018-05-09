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

    makePie(response[1]);

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

    console.log(dataScatter);

};

// Hmmmmmmmm, pie
function makePie(dataAPI2){

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

    console.log(dataPie);

};
