var canvas = document.getElementById('canvas1');
var context1 = canvas.getContext('2d');
var canvas2 = document.getElementById("layer");
var context2 = canvas.getContext("2d");
var selectedItem = '';
var selectedMethod = '';
var rulers = new Array();
var compasses = new Array();
var labels = new Array();
var drawing = [rulers, compasses, labels];
var drawid = 0;
var radiusx=0;



$('#ir').click(function() {
    selectedMethod = 'r';
    selectedItem = 'a';
});


$('#ic').click(function() {
    selectedMethod = 'c';
    selectedItem = 'c';
});


$('#il').click(function() {
    selectedMethod = 'l';
    selectedItem = 'l';
});

$('#im').click(function() {
    selectedMethod = 'm';
    selectedItem = 'a';
});


function setL(evt) {
    var mousePos = getMousePos(canvas, evt);
	
    $('#xx').val(mousePos.x / 50);
    $('#yy').val(mousePos.y / 50);

}

function setA(evt) {
    var mousePos = getMousePos(canvas, evt);

    $('#x1').val(mousePos.x / 50);
    $('#y1').val(mousePos.y / 50);

}

function setB(evt) {
    var mousePos = getMousePos(canvas, evt);
    $('#x2').val(mousePos.x / 50);
    $('#y2').val(mousePos.y / 50);

}

function setX(evt) {
    var mousePos = getMousePos(canvas2, evt);

    $('#x1').val(mousePos.x / 50);
    $('#y1').val(mousePos.y / 50);
}
function setY(evt) {
    var mousePos = getMousePos(canvas2, evt);

    $('#x2').val(mousePos.x / 50);
    $('#y2').val(mousePos.y / 50);

}

function setC(evt) {
    var mousePos = getMousePos(canvas, evt);

    $('#x').val(mousePos.x / 50);
    $('#y').val(mousePos.y / 50);

}

function setR(evt) {
    var mousePos = getMousePos(canvas, evt);

    $('#radius').val(Math.sqrt(($('#x').val() - (mousePos.x / 50)) * ($('#x').val() - (mousePos.x / 50)) + ($('#y').val() - (mousePos.y / 50)) * ($('#y').val() - (mousePos.y / 50))).toFixed(2));
    if (Math.atan((mousePos.x / 50 - $('#x').val()) / (mousePos.y / 50 - $('#y').val())) >= 0) {
        if (mousePos.y / 50 <= $('#y').val()) {
            //2nd quadrant
            $('#sa').val((270 - Math.atan((mousePos.x / 50 - $('#x').val()) / (mousePos.y / 50 - $('#y').val())) / Math.PI * 180).toFixed(2));
        } else {
            //4th quadrant
            $('#sa').val((90 - Math.atan((mousePos.x / 50 - $('#x').val()) / (mousePos.y / 50 - $('#y').val())) / Math.PI * 180).toFixed(2));
        }
    } else {
        if (mousePos.y / 50 <= $('#y').val()) {
            //1st quadrant
            $('#sa').val((270 - Math.atan((mousePos.x / 50 - $('#x').val()) / (mousePos.y / 50 - $('#y').val())) / Math.PI * (180)).toFixed(2));

        } else {
            //3rd quadrant
            $('#sa').val((90 - Math.atan((mousePos.x / 50 - $('#x').val()) / (mousePos.y / 50 - $('#y').val())) / Math.PI * (180)).toFixed(2));

        }
    }
}


function setAngle(evt) {
    var mousePos = getMousePos(canvas, evt);
    if (Math.atan((mousePos.x / 50 - $('#x').val()) / (mousePos.y / 50 - $('#y').val())) >= 0) {
        if (mousePos.y / 50 <= $('#y').val()) {
            $('#ea').val((270 - Math.atan((mousePos.x / 50 - $('#x').val()) / (mousePos.y / 50 - $('#y').val())) / Math.PI * 180).toFixed(2));
        } else {
            $('#ea').val((90 - Math.atan((mousePos.x / 50 - $('#x').val()) / (mousePos.y / 50 - $('#y').val())) / Math.PI * 180).toFixed(2));
        }
    } else {
        if (mousePos.y / 50 <= $('#y').val()) {
            $('#ea').val((270 - Math.atan((mousePos.x / 50 - $('#x').val()) / (mousePos.y / 50 - $('#y').val())) / Math.PI * 180).toFixed(2));

        } else {
            $('#ea').val((90 - Math.atan((mousePos.x / 50 - $('#x').val()) / (mousePos.y / 50 - $('#y').val())) / Math.PI * 180).toFixed(2));

        }
    }
}

//padding around grid

function init() {

    var p = 0;
    //size of canvas
    var bw = 800,
        bh = 500;
    var cw = bw + (p * 2) + 1;
    var ch = bh + (p * 2) + 1;

    context1.beginPath();
    for (var x = 0; x <= bw; x += 50) {
        context1.moveTo(0.5 + x + p, p);
        context1.lineTo(0.5 + x + p, bh + p);
    }


    for (var x = 0; x <= bh; x += 50) {
        context1.moveTo(p, 0.5 + x + p);
        context1.lineTo(bw + p, 0.5 + x + p);
    }

    context1.strokeStyle = "blue";
    context1.stroke();

    $('#ruler').hide();
    $('#compass').hide();
    $('#label').hide();

    $('#toolbox').show();
    $('#shape').hide();
}


function compass() {

    //arc(center coordinates,radius,start angle,end angle,anticlockwise)
    var x = document.getElementById('x').value * 50;
    var y = document.getElementById('y').value * 50;
    var radius = document.getElementById('radius').value * 50;
    var startAngle = document.getElementById('sa').value;
    var endAngle = document.getElementById('ea').value;
    var counterClockwise = false;
    if (document.getElementById('rotation1').checked) {
        var counterClockwise = document.getElementById('rotation1').value;
    }
    var clc = document.getElementById('clc').value;
    context1.beginPath();
    startAngle = startAngle * Math.PI / 180;
    endAngle = endAngle * Math.PI / 180;
    context1.strokeStyle = clc;
    context1.arc(x, y, radius, startAngle, endAngle, counterClockwise);
    context1.stroke();

    var arc = {
        index: drawid,
        x: (x / 50).toFixed(2),
        y: (y / 50).toFixed(2),
        radius: (radius / 50).toFixed(2),
        starta: (startAngle * 180 / Math.PI).toFixed(2),
        enda: (endAngle * 180 / Math.PI).toFixed(2),
        rotation: counterClockwise
    };
    compasses.push(arc);
    drawid++;

}

function ruler() {

    var x1 = document.getElementById('x1').value * 50;
    var y1 = document.getElementById('y1').value * 50;
    var x2 = document.getElementById('x2').value * 50;
    var y2 = document.getElementById('y2').value * 50;
    var e1 = document.getElementById('e1').value * 50;
    var e2 = document.getElementById('e2').value * 50;

    var rcolor = document.getElementById('clr').value;
    context1.strokeStyle = rcolor;
    if (e1 > 0) {
        var m0 = (y1 - y2) / (x1 - x2);

        var x0 = x1 - (e1 / Math.sqrt(m0 * m0 + 1));

        //line parallel to y axis
        if (x1 == x2) {
            y0 = y1 - e1;
        } 
		else {
            var test = (y1 - y2) / (x1 - x2) * (x0 - x1);
            if (test < 0)
                var y0 = y1 - Math.abs(test);
            else
                var y0 = y1 + Math.abs(test);
        }

        x1 = x0;
        y1 = y0;

    }

    if (e2 > 0) {
        var m1 = (y1 - y2) / (x1 - x2);
        var x3 = x2 + (e2 / Math.sqrt(m1 * m1 + 1));

        //line parallel to y axis
        if (x1 == x2) {
            y0 = y1 - e1;

        } else {
            var ext = m1 * (x3 - x2);

            if (ext > 0)
                var y3 = y2 + Math.abs(ext);
            else
                var y3 = y2 - Math.abs(ext);

        }

        x2 = x3;
        y2 = y3;

    }
    context1.beginPath();
    context1.moveTo(x1, y1);
    context1.lineTo(x2, y2);
    context1.stroke();

    var line = {
        index: drawid,
        xs: x1 / 50,
        ys: y1 / 50,
        xe: x2 / 50,
        ye: y2 / 50
    };
    rulers.push(line);
    drawid++;

}

function label() {

    var context1 = canvas.getContext("2d");
    var x = document.getElementById('xx').value * 50;
    var y = document.getElementById('yy').value * 50;
    var text = document.getElementById('txt').value;
    context1.font = "15px Arial";
    context1.fillText(text, x, y);

    var label = {
        index: drawid,
        xp: (x / 50).toFixed(2),
        yp: (y / 50).toFixed(2),
        message: text
    };
    labels.push(label);
    drawid++;
}

function test()
{
	context2.moveTo(0,0);
	context2.lineTo(120,100);
	context2.stroke();
}

function measurelength()
{
	$('#im').css("opacity", "1");
	$('#ruler').show();
    $('#ir').css("opacity", "0.4");
    $('#compass').hide();
    $('#ic').css("opacity", "0.4");
    $('#label').hide();
    $('#il').css("opacity", "0.4");
	$('pickA').hide();
	$('pickB').hide();
	
	var x1 = document.getElementById('x1').value * 50;
    var y1 = document.getElementById('y1').value * 50;
    var x2 = document.getElementById('x2').value * 50;
    var y2 = document.getElementById('y2').value * 50;
    var e1 = document.getElementById('e1').value * 50;
    var e2 = document.getElementById('e2').value * 50;

    
    if (e1 > 0) {
        var m0 = (y1 - y2) / (x1 - x2);

        var x0 = x1 - (e1 / Math.sqrt(m0 * m0 + 1));

        //line parallel to y axis
        if (x1 == x2) {
            y0 = y1 - e1;
        } 
		else {
            var test = (y1 - y2) / (x1 - x2) * (x0 - x1);
            if (test < 0)
                var y0 = y1 - Math.abs(test);
            else
                var y0 = y1 + Math.abs(test);
        }

        x1 = x0;
        y1 = y0;

    }

    if (e2 > 0) {
        var m1 = (y1 - y2) / (x1 - x2);
        var x3 = x2 + (e2 / Math.sqrt(m1 * m1 + 1));

        //line parallel to y axis
        if (x1 == x2) {
            y0 = y1 - e1;

        } else {
            var ext = m1 * (x3 - x2);

            if (ext > 0)
                var y3 = y2 + Math.abs(ext);
            else
                var y3 = y2 - Math.abs(ext);

        }

        x2 = x3;
        y2 = y3;

    }
	context2.beginPath();
    context2.moveTo(x1, y1);
    context2.lineTo(x2, y2);
    context2.stroke();

	y1=y1/50;
	y2=y2/50;
	x1=x1/50;
	x2=x2/50;
	
    writeMessage(canvas2,"Length :"+Math.sqrt((y1 - y2)*(y1 - y2)+(x1 - x2)*(x1 - x2)));
	
}

function lockradius()
{
	var val = $('#radius').value;
	radiusx = val;
	document.getElementById("radius").readOnly = true;
	
}

function clearCanvas()
{
	context1.clearRect(0,0,canvas.width,canvas.height);
	context2.clearRect(0,0,canvas2.width,canvas2.height);
	init();
}

function writeMessage(canvas, message) {
    context1.clearRect(canvas.width - 198, 0, canvas.width, canvas.height - 451);
    context1.font = '12pt Calibri';
    context1.fillStyle = 'black';
    context1.fillText(message, canvas.width - 190, 25);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function showRuler() {
    $('#ruler').show();
    $('#ir').css("opacity", "1");
    $('#compass').hide();
    $('#ic').css("opacity", "0.4");
    $('#label').hide();
    $('#il').css("opacity", "0.4");
    $('#pickA').hide();
    $('#pickB').hide();
	$('#im').css("opacity", "0.4");
}

function showCompass() {
    $('#compass').show();
    $('#ic').css("opacity", "1");
    $('#ruler').hide();
    $('#ir').css("opacity", "0.4");
    $('#label').hide();
    $('#il').css("opacity", "0.4");
    $('#pickC').hide();
	$('#im').css("opacity", "0.4");
}

function showLabel() {
    $('#label').show();
    $('#il').css("opacity", "1");
    $('#ruler').hide();
    $('#ir').css("opacity", "0.4");
    $('#compass').hide();
    $('#ic').css("opacity", "0.4");
    $('#pickL').hide();
	$('#im').css("opacity", "0.4");
}



function showPanel1() {
    $('#toolbox').show();
    $('#shape').hide();
}

function showPanel2() {
    $('#toolbox').hide();
    $('#shape').show();

}