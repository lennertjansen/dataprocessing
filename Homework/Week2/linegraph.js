/*
* Name: Lennert Jansen
* Student number: 10488952
* Date of submission: 20 april 2018
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
    dates[iter] = new Date([dateString.slice(0, 4), dash, dateString.slice(4, 6)
        , dash, dateString.slice(6)].join(''));

    temperatures[iter] = Number(rows[iter].substr(9, stringLength - 1));

}

months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep",
    "Oct", "Nov", "Dec"]
var xAxisLength = months.length

celsius = [];
for (let iter = 250; iter >= -50;){
    celsius.push(iter);
    iter = iter - 50;
}
var yAxisLength = celsius.length

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

yAxisOrigin = [50, 20];

//y axis
for (let iter = 0; iter < yAxisLength; iter++){

    yAxisOrigin[1] = 20 + (iter * 50);

    if (iter == yAxisLength - 1){
        ctx.beginPath();
        ctx.moveTo(yAxisOrigin[0] - 10, yAxisOrigin[1]);
        ctx.lineTo(yAxisOrigin[0], yAxisOrigin[1]);
        ctx.font = '10px courier';
        ctx.textAlign = 'end'
        ctx.fillText(celsius[iter], yAxisOrigin[0] - 10, yAxisOrigin[1] + 3);
        ctx.stroke();
        break;
    }

    ctx.beginPath();
    ctx.moveTo(yAxisOrigin[0] - 10, yAxisOrigin[1]);
    ctx.lineTo(yAxisOrigin[0], yAxisOrigin[1]);
    ctx.lineTo(yAxisOrigin[0], yAxisOrigin[1] + 50);
    ctx.font = '10px courier';
    ctx.textAlign = 'end'
    ctx.fillText(celsius[iter], yAxisOrigin[0] - 10, yAxisOrigin[1] + 3);
    ctx.stroke();
}

xAxisOrigin = [yAxisOrigin[0], yAxisOrigin[1]];

// x axis
for (let iter = 0; iter < xAxisLength; iter++){
    
}

//
// // Second path
// ctx.beginPath();
// ctx.strokeStyle = 'green';
// ctx.moveTo(200, 20);
// ctx.lineTo(200, 300);
// ctx.stroke();
//
// // Third path
// ctx.beginPath();
// ctx.strokeStyle = 'purple';
// ctx.moveTo(200, 300);
// ctx.lineTo(20, 300);
// ctx.stroke();
//
// // Fourth path
// ctx.beginPath();
// ctx.strokeStyle = 'green';
// ctx.moveTo(20, 300);
// ctx.lineTo(20, 20);
// ctx.stroke();
//
// // Fith path
// ctx.beginPath();
// ctx.strokeStyle = 'black';
// ctx.moveTo(20, 20);
// ctx.lineTo(200, 300);
// ctx.stroke();

// // y axis
// ctx.beginPath();
// ctx.strokeStyle = 'black';
// ctx.moveTo(10, 10);
// ctx.lineTo(10, 510);
// ctx.stroke();
//
// // x axis
// ctx.beginPath();
// ctx.strokeStyle = 'black';
// ctx.moveTo(10, 510);
// ctx.lineTo(1100, 510);
// ctx.stroke();
//
// // dashed
// for (let iter = 0; iter <= 1100; iter++){
//     ctx.beginPath();
//     ctx.strokeStyle = 'black';
//     ctx.moveTo(10 + iter, 310);
//     ctx.lineTo(10 + iter + 1, 310);
//     ctx.stroke();
//
//     if ((iter + 1) % 10 == 0){
//         ctx.beginPath();
//         ctx.strokeStyle = 'white';
//         ctx.moveTo(10 + iter + 1, 310);
//         ctx.lineTo(10 + iter + 11, 310);
//         ctx.stroke();
//         iter = iter + 10;
//
//     }
// }

// ctx.beginPath();
// ctx.moveTo(200, 20);
// ctx.lineTo(20, 20);
// ctx.lineTo(120, 120);
// ctx.closePath();
// ctx.stroke();
