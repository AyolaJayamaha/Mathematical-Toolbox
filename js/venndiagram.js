

function setlabel()
{
  
    var x = document.getElementById('xx').value * 50;
    var y = document.getElementById('yy').value * 50;
    var text = document.getElementById('setl').value;
	
	
   }

function settext()
{


 context3.font = "15px Arial";
    context3.fillText(text, x, y);


}

canvas3.addEventListener('mousedown', function(evt) 
{
        var mousePos = getMousePos(canvas3, evt);
		 $('#xcr').val(mousePos.x / 50);
		  $('#ycr').val(mousePos.y / 50);
		}
,false);
