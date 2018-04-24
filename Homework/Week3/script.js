// test data set
var dataset = [ 5, 10, 15, 20, 25 ];

// var dataset = [];
// for (var i = 0; i < 25; i++){
//     var newNumber = Math.random() * 30;
//     dataset.push(newNumber);
// }

// // example of d3's chaining properties
// d3.select("body").selectAll("p")
//     .data(dataset)
//     .enter()
//     // .append("div")
//     // .attr("class", "bar")
//     // .style("height", function(d) {
//     // var barHeight = d * 5;
//     // return barHeight + "px";
//     // });
//     .append("p")
//     // .append("svg");
//     .text(function(d) {  // <-- Note tender embrace at left
//     return "I can count up to " + d;
//     });
//     // .style("color", function(d) {
//     // if (d > 15) {   //Threshold of 15
//     //     return "red";
//     // } else {
//     //     return "black";
//     // }
//     // });
//     //.text(function(d) { return d; });
//     //.text("New Paragraph, bruh");
//
// // d3.select("body").selectAll("div")
// //     .data(dataset)
// //     .enter()
// //     .append("div")
// //     .attr("class", "bar");

d3.select("body")
    .append("svg");

// svg.selectAll("circle")
//     .data(dataset)
//     .enter()
//     .append("circle");
