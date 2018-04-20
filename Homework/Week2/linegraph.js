/*
* Name: Lennert Jansen
* Student number: 10488952
* Date of submission: 20 april 2018
*
*
*/

function reqListener()
{
    //var rawdata = document.getElementById("rawdata").innerHTML.split("\n");
    var rawdata = this.responseText.split("\n");

    // slice rows
    var rows = rawdata.slice(1);
    rows.pop();

    // create empty lists for dates and temperatures
    var dates = [];
    var temperatures = [];

    // determine row length
    let rowsLength = rows.length;

    // iterate through lst of dates and temperatures and extract info into
    // seperate lists
    for (let iter = 0; iter < rowsLength; iter++){

        let stringLength = rows[iter].length;

        rows[iter] = rows[iter].replace(/\s/g, "");

        dateString = rows[iter].substr(0, 8);
        var dash = "-";
        dates[iter] = new Date([dateString.slice(0, 4), dash, dateString.slice(4, 6)
            , dash, dateString.slice(6)].join(''));

        temperatures[iter] = Number(rows[iter].substr(9, stringLength - 1));

    }

    // create list for month labels
    months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep",
        "Oct", "Nov", "Dec"]
    var xAxisLength = months.length

    // create list for temperature labels
    celsius = [];
    for (let iter = 25; iter >= -5;){
        celsius.push(iter);
        iter = iter - 5;
    }
    var yAxisLength = celsius.length

    // create canvas element
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');

    // select origin of y axis arbitrarily
    yAxisOrigin = [300, 20];

    // create two coordinate variables so we can track where the last line was
    // drawn
    var [x, y] = yAxisOrigin;

    // create variables for lengths of x and y axis segments
    var yAxisSegment = 70;
    var xAxisSegment = 80;

    // create y axis
    for (let iter = 0; iter < yAxisLength; iter++){

        y = yAxisOrigin[1] + (iter * yAxisSegment);

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
        ctx.lineTo(x, y + yAxisSegment);
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

        x = xAxisOrigin[0] + (iter * xAxisSegment);

        ctx.beginPath();
        ctx.moveTo(x, y + 10);
        ctx.lineTo(x, y);
        ctx.lineTo(x + xAxisSegment, y);
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

    // determine lengths of x and y axis
    var xScale = x + xAxisSegment - xAxisOrigin[0];
    var yScale = xAxisOrigin[1] - yAxisOrigin[1];

    // determine point on y axis where zero degrees centigrade is
    var yZero = xAxisOrigin[1] - yAxisSegment;

    // determine starting point of linegraph
    var fromPoint = [yAxisOrigin[0], yZero - (temperatures[0] * (yAxisSegment / 50))];

    // draw line by iteratively calculating next point by determining relative
    // position from the origin of x and y axes
    for (i = 1; i < 366; i++){

        toPoint = [fromPoint[0] + (xScale * (1 / 365)), yZero - (temperatures[i] * (yAxisSegment / 50))];
        ctx.beginPath();
        ctx.moveTo(fromPoint[0], fromPoint[1]);
        ctx.lineTo(toPoint[0], toPoint[1]);
        ctx.stroke();

        fromPoint = toPoint;
    }
}

// create XML HTTP request
var request = new XMLHttpRequest()
var getgit = "https://lennertjansen.github.io/dataprocessing/Homework/Week2/rawdata.txt"

request.addEventListener("load", reqListener);
request.open("GET", getgit);
request.send();
