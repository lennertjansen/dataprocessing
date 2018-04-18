/*
*
*
*
*/

var rawdata = document.getElementById("rawdata").innerHTML.split("\n");

var rows = rawdata.slice(1);
rows.pop();

var dates = [];
var temperatures = [];

let rowsLength = rows.length;

for (let iter = 0; iter < rowsLength; iter++){

    let stringLength = rows[iter].length;

    rows[iter] = rows[iter].replace(/\s/g, "");

    dateString = rows[iter].substr(0, 8);
    var dash = "-";
    dates[iter] = new Date([dateString.slice(0, 4), dash, dateString.slice(4, 6), dash,
        dateString.slice(6)].join(''));

    temperatures[iter] = Number(rows[iter].substr(9, stringLength - 1));

}
