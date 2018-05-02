/*
* Name: Lennert Jansen
* Student number: 10488952
* Date: 30 April 2018
* Scatterplot in JS
*
*/

// encapsulate entire script in function
window.onload = function() {

    // append segment to body containing author and assignment information
    authorInfo = d3.select("body")
                .append("p").text("Name: Lennert Jansen")
                .append("p").text("Student number: 10488952")
                .append("p").text("Description");

    // // get data using API queries
    // var popCityArea = "http://stats.oecd.org/SDMX-JSON/data/CITIES/US106+US107+US114+US012+US122+US124+US125+US128+US134+US135+US014+US146+US190+US196+US202+US209+US210+US242+US245+US250+US259+US003+US033+US045+US048+US055+US069+US084+US103+US115+US117+US133+US141+US147+US149+US154+US155+US159+US160+US161+US170+US174+US178+US180+US181+US186+US195+US205+US212+US213+US223+US227+US233+US234+US237+US241+US251+US252+US261+US035+US038+US039+US044+US060+US065+US070+US077+US081+US089+US097.POP_CORE/all?startTime=2013&endTime=2014&dimensionAtObservation=allDimensions" // total population of the city area in persons
    //
    // var popDensityCityArea = "http://stats.oecd.org/SDMX-JSON/data/CITIES/US106+US107+US114+US012+US122+US124+US125+US128+US134+US135+US014+US146+US190+US196+US202+US209+US210+US242+US245+US250+US259+US003+US033+US045+US048+US055+US069+US084+US103+US115+US117+US133+US141+US147+US149+US154+US155+US159+US160+US161+US170+US174+US178+US180+US181+US186+US195+US205+US212+US213+US223+US227+US233+US234+US237+US241+US251+US252+US261+US035+US038+US039+US044+US060+US065+US070+US077+US081+US089+US097.POP_DENS_CORE/all?startTime=2013&endTime=2014&dimensionAtObservation=allDimensions" // population of the city area in persons per km2
    //
    // var unemploymentRate = "http://stats.oecd.org/SDMX-JSON/data/CITIES/US106+US107+US114+US012+US122+US124+US125+US128+US134+US135+US014+US146+US190+US196+US202+US209+US210+US242+US245+US250+US259+US003+US033+US045+US048+US055+US069+US084+US103+US115+US117+US133+US141+US147+US149+US154+US155+US159+US160+US161+US170+US174+US178+US180+US181+US186+US195+US205+US212+US213+US223+US227+US233+US234+US237+US241+US251+US252+US261+US035+US038+US039+US044+US060+US065+US070+US077+US081+US089+US097.UNEMP_R/all?startTime=2013&endTime=2014&dimensionAtObservation=allDimensions" // unemployment as share of the labour force
    //
    // var labourProductivity = "http://stats.oecd.org/SDMX-JSON/data/CITIES/US106+US107+US114+US012+US122+US124+US125+US128+US134+US135+US014+US146+US190+US196+US202+US209+US210+US242+US245+US250+US259+US003+US033+US045+US048+US055+US069+US084+US103+US115+US117+US133+US141+US147+US149+US154+US155+US159+US160+US161+US170+US174+US178+US180+US181+US186+US195+US205+US212+US213+US223+US227+US233+US234+US237+US241+US251+US252+US261+US035+US038+US039+US044+US060+US065+US070+US077+US081+US089+US097.LABOUR_PRODUCTIVITY/all?startTime=2013&endTime=2014&dimensionAtObservation=allDimensions" // ratio between GDP and total employment

    var dataAPI2012 = "http://stats.oecd.org/SDMX-JSON/data/CITIES/US106+US107+US114+US012+US122+US124+US125+US128+US134+US135+US014+US146+US190+US196+US202+US209+US210+US242+US245+US250+US259+US003+US033+US045+US048+US055+US069+US084+US103+US115+US117+US133+US141+US147+US149+US154+US155+US159+US160+US161+US170+US174+US178+US180+US181+US186+US195+US205+US212+US213+US223+US227+US233+US234+US237+US241+US251+US252+US261+US035+US038+US039+US044+US060+US065+US070+US077+US081+US089+US097.POP_CORE+POP_DENS_CORE+GDP_PC+LABOUR_PRODUCTIVITY+UNEMP_R/all?startTime=2012&endTime=2012&dimensionAtObservation=allDimensions"

    var dataAPI2013 = "http://stats.oecd.org/SDMX-JSON/data/CITIES/US106+US107+US114+US012+US122+US124+US125+US128+US134+US135+US014+US146+US190+US196+US202+US209+US210+US242+US245+US250+US259+US003+US033+US045+US048+US055+US069+US084+US103+US115+US117+US133+US141+US147+US149+US154+US155+US159+US160+US161+US170+US174+US178+US180+US181+US186+US195+US205+US212+US213+US223+US227+US233+US234+US237+US241+US251+US252+US261+US035+US038+US039+US044+US060+US065+US070+US077+US081+US089+US097.POP_CORE+POP_DENS_CORE+GDP_PC+LABOUR_PRODUCTIVITY+UNEMP_R/all?startTime=2013&endTime=2013&dimensionAtObservation=allDimensions"

    d3.queue()
        .defer(d3.request, dataAPI2012)
        .defer(d3.request, dataAPI2013)
        .awaitAll(doFunction);

    function doFunction(error, response) {
        if (error) throw error;

        var jsonData2012 = JSON.parse(response[0].responseText);
        var jsonData2013 = JSON.parse(response[1].responseText);

        console.log(jsonData2012.dataSets[0].observations["0:0:0"][0]);
        console.log(jsonData2012.structure.dimensions.observation[0].values[69]["name"]);


        // create empty dict in which all relevant data for 2012 will be stored
        data2012 = [];

        for (let i = 0; i < 70; i++){

            iets0 = i + ":" + "0:0";
            iets1 = i + ":" + "1:0";
            iets2 = i + ":" + "2:0";
            iets3 = i + ":" + "3:0";
            iets4 = i + ":" + "4:0";

            // create object in which a single city's info will be stored
            cityObject = {
                "name": jsonData2012.structure.dimensions.observation[0].values[i]["name"],
                "GDP_PC": jsonData2012.dataSets[0].observations[iets0][0],
                "UNEMP_R": jsonData2012.dataSets[0].observations[iets1][0],
                "POP_CORE": jsonData2012.dataSets[0].observations[iets2][0],
                "POP_DENS_CORE": jsonData2012.dataSets[0].observations[iets3][0],
                "LABOUR_PRODUCTIVITY": jsonData2012.dataSets[0].observations[iets4][0]
            };

            data2012.push(cityObject);

        };

        console.log(data2012);

    };
};
