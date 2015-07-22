  
		var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
		var selectedItem='';		
		
        
		
		$('#pickL').click(function() {
		selectedItem = 'l';
		
		});
		
		$('#pickA').click(function() {
		selectedItem = 'a';
	
		});
		
		$('#pickB').click(function() {

		selectedItem = 'b';});
		
		$('#pickC').click(function() {
		selectedItem = 'c'; 
		
		});
		
		function setL(evt) 
		{
            var mousePos = getMousePos(canvas, evt);
			
			$('#xx').val(mousePos.x/50);
			$('#yy').val(mousePos.y/50);
		
		}
		
		function setA(evt) 
		{
            var mousePos = getMousePos(canvas, evt);
			
			$('#x1').val(mousePos.x/50);
			$('#y1').val(mousePos.y/50);
		
		}
		
		function setB(evt) 
		{
            var mousePos = getMousePos(canvas, evt);
			
			$('#x2').val(mousePos.x/50);
			$('#y2').val(mousePos.y/50);
		
		}
		
		function setC(evt) 
		{
            var mousePos = getMousePos(canvas, evt);
			
			$('#x').val(mousePos.x/50);
			$('#y').val(mousePos.y/50);
		
		}
		
        //padding around grid
    
        function init() 
		{
		init2();
            
            var p = 0;
            //size of canvas
            var bw = 800,
                bh = 500;
            var cw = bw + (p * 2) + 1;
            var ch = bh + (p * 2) + 1;
            
            context.beginPath();
            for (var x = 0; x <= bw; x += 50) {
                context.moveTo(0.5 + x + p, p);
                context.lineTo(0.5 + x + p, bh + p);
            }


            for (var x = 0; x <= bh; x += 50) {
                context.moveTo(p, 0.5 + x + p);
                context.lineTo(bw + p, 0.5 + x + p);
            }

            context.strokeStyle = "blue";
            context.stroke();
			
			$("#ruler").hide();
			$("#compass").hide();
			$("#label").hide();

			$('#toolbox').show();
			$('#shape').hide();
        }


        function compass() {
            
                //arc(center coordinates,radius,start angle,end angle,anticlockwise)
                var x = document.getElementById('x').value*50;
                var y = document.getElementById('y').value*50;
                var radius = document.getElementById('radius').value*50;
                var startAngle = document.getElementById('sa').value;
                var endAngle = document.getElementById('ea').value;
                var counterClockwise = false;
                if (document.getElementById('rotation1').checked) 
				{
                    var counterClockwise = document.getElementById('rotation1').value;
                }
                var clc = document.getElementById('clc').value;
                context.beginPath();
                startAngle = startAngle * Math.PI/180;
                endAngle = endAngle * Math.PI/180;
				context.strokeStyle = clc;
                context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
                context.stroke();
            
        }

        function ruler() {
          
                var x1 = document.getElementById('x1').value*50;
                var y1 = document.getElementById('y1').value*50;
                var x2 = document.getElementById('x2').value*50;
                var y2 = document.getElementById('y2').value*50;
				var e1 = document.getElementById('e1').value*50;
				var e2 = document.getElementById('e2').value*50;
				
                var rcolor = document.getElementById('clr').value;
                context.strokeStyle = rcolor;
				if(e1>0)
				{
				var m0 = (y1-y2)/(x1-x2);
				
				var x0 = x1 - (e1 / Math.sqrt(m0 * m0 + 1));
		
					//line parallel to y axis
					if(x1==x2)
					{
						y0=y1-e1;
					
					}
					else
					{
						var test = (y1-y2)/(x1-x2)*(x0-x1);
						if(test<0)
							var y0 = y1 - Math.abs(test);
						else
							var y0 = y1 + Math.abs(test);
					}
				
				x1=x0;
				y1=y0;
				
				}
				
				if(e2>0)
				{
				var m1 = (y1-y2)/(x1-x2);
				var x3 = x2+(e2/Math.sqrt(m1*m1+1));
				
					//line parallel to y axis
					if(x1==x2)
					{
						y0=y1-e1;
				
					}
					else
					{
					var ext = m1*(x3-x2);
					
					if(ext>0)
					var y3 = y2 + Math.abs(ext);
					else
					var y3 = y2 - Math.abs(ext);
					
					}
				
				x2=x3;
				y2=y3;
				
				}
				context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.stroke();
            
        }

        function label() {
            
            
                var context = canvas.getContext("2d");
                var x = document.getElementById('xx').value*50;
                var y = document.getElementById('yy').value*50;
                var text = document.getElementById('txt').value;
                context.font = "11px Arial";
                context.fillText(text, x, y);
            
        }

        function writeMessage(canvas, message) {
            
            context.clearRect(canvas.width - 198, 0, canvas.width, canvas.height - 451);
            context.font = '12pt Calibri';
            context.fillStyle = 'black';
            context.fillText(message, canvas.width - 190, 25);
        }

        function getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }
		
		function showRuler(	)
		{
			$("#ruler").show();
            $("#ir").css("opacity","1");
            $("#compass").hide();
            $("#ic").css("opacity","0.4");
			$("#label").hide();
            $("#il").css("opacity","0.4");
	
		}
		
		function showCompass()
		{
			$("#compass").show();
            $("#ic").css("opacity","1");
            $("#ruler").hide();
            $("#ir").css("opacity","0.4");
            $("#label").hide();
            $("#il").css("opacity","0.4");

		}
		
		function showLabel()
		{
			$('#label').show();
            $('#il').css("opacity","1");
            $('#ruler').hide();
            $('#ir').css("opacity","0.4");
            $('#compass').hide();
            $('#ic').css("opacity","0.4");

		}

		function showPanel1()
		{
			$('#toolbox').show();
			$('#shape').hide();
		}

		function showPanel2()
		{
			$('#toolbox').hide();
			$('#shape').show();
			
		}



		