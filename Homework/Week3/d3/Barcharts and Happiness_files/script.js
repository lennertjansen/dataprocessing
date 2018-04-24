// // test data set
// var dataset = [ 25, 7, 5, 26, 11, 8, 25, 14, 23, 19,
//                 14, 11, 22, 29, 11, 13, 12, 17, 18, 10,
//                 24, 18, 25, 9, 3 ];
//
var dataset = [];
for (var i = 0; i < 25; i++){
    var newNumber = Math.random() * 30;
    dataset.push(newNumber);
}

// example of d3's chaining properties
d3.select("body").selectAll("div")
    .data(dataset)
    .enter()
    .append("div")
    .attr("class", "bar")
    .style("height", function(d) {
    var barHeight = d * 5;
    return barHeight + "px";
    });
    // .append("p")
    // .text(function(d) {  // <-- Note tender embrace at left
    // return "I can count up to " + d;
    // })
    // .style("color", function(d) {
    // if (d > 15) {   //Threshold of 15
    //     return "red";
    // } else {
    //     return "black";
    // }
    // });
    //.text(function(d) { return d; });
    //.text("New Paragraph, bruh");

// d3.select("body").selectAll("div")
//     .data(dataset)
//     .enter()
//     .append("div")
//     .attr("class", "bar");


console.log(d3.selectAll("p"));
