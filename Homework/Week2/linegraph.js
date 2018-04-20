/*
* Name: Lennert Jansen
* Student number: 10488952
* Date of submission: 20 april 2018
*
*
*/

function reqListener()
{
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
    for (let iter = 25; iter >= -5;){
        celsius.push(iter);
        iter = iter - 5;
    }
    var yAxisLength = celsius.length

    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');

    yAxisOrigin = [300, 20];

    var [x, y] = yAxisOrigin;

    //y axis
    for (let iter = 0; iter < yAxisLength; iter++){

        y = yAxisOrigin[1] + (iter * 70);

        if (iter == yAxisLength - 1){
            ctx.beginPath();
            ctx.moveTo(x - 10, y);
            ctx.lineTo(x, y);
            ctx.font = '10px courier';
            ctx.textAlign = 'end'
            ctx.fillText(celsius[iter], x - 10, y + 3);
            ctx.stroke();
            break;
        }

        ctx.beginPath();
        ctx.moveTo(x - 10, y);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y + 70);
        ctx.font = '10px courier';
        ctx.textAlign = 'end'
        ctx.fillText(celsius[iter], x - 10, y + 3);
        ctx.stroke();
    }

    //y axis label
    yAxisCenter = [x, (yAxisOrigin[1] + y) / 2];
    ctx.font = '18px courier';
    ctx.save();
    ctx.translate(yAxisCenter[0], yAxisCenter[1]);
    ctx.rotate(-90 * (Math.PI / 180));
    ctx.textAlign = 'center';
    ctx.fillText('Temperature in degrees centigrade (C)', 0, -50);
    ctx.restore();
    ctx.stroke();


    xAxisOrigin = [x, y];

    // x axis
    for (let iter = 0; iter < xAxisLength; iter++){

        x = xAxisOrigin[0] + (iter * 80);

        ctx.beginPath();
        ctx.moveTo(x, y + 10);
        ctx.lineTo(x, y);
        ctx.lineTo(x + 80, y);
        ctx.font = '15px courier';
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-Math.PI / 4);
        ctx.textAlign = 'right';
        ctx.fillText(months[iter], -10, 17);
        ctx.restore();
        ctx.stroke();
    }

    //x axis label
    xAxisCenter = [((x - xAxisOrigin[0]) / 2) + yAxisOrigin[0], y];
    ctx.font = '18px courier';
    ctx.save();
    ctx.translate(xAxisCenter[0], xAxisCenter[1]);
    ctx.rotate(0 * (Math.PI / 180));
    ctx.textAlign = 'center';
    ctx.fillText('Months of the year 2017', 0, 100);
    ctx.restore();
    ctx.stroke();

    var xScale = x + 80 - xAxisOrigin[0];
    var yScale = xAxisOrigin[1] - yAxisOrigin[1];

    var yZero = xAxisOrigin[1] - 70;

    var fromPoint = [yAxisOrigin[0], yZero - (temperatures[0] * (70 / 50))];

    for (i = 1; i < 366; i++){

        toPoint = [fromPoint[0] + (xScale * (1 / 365)), yZero - (temperatures[i] * (70 / 50))];
        ctx.beginPath();
        ctx.moveTo(fromPoint[0], fromPoint[1]);
        ctx.lineTo(toPoint[0], toPoint[1]);
        ctx.stroke();

        fromPoint = toPoint;
    }
}

var requester = new XMLHttpRequest()
var getgitit = "https://lennertjansen.github.io/dataprocessing/Homework/Week2/rawdata.txt"

requester.addEventListener("load", reqListener);
requester.open("GET", getgitit);
requester.send();
