//動態平移

Scroll = {
	Interval: 0,
	Drag: false,
	MouseDown: { X: 0, Y: 0},
	MouseMove: { X: 0, Y: 0},
	Paging: null,
	MoveNow: { X: 0, Y: 0 }
}




function ScrollSet(obj, page) {
	var scale = MainObj.Scale;
    var Left = obj.Left * scale + MainObj.CanvasL;
    var Top = obj.Top * scale + MainObj.CanvasT;
    var Width = obj.Width * scale;
    var Height = obj.Height * scale;

    $('#canvas')[0].class = 'canvasObj';
    var canvasID = obj.Identifier;

    $('#canvas')[0].id = canvasID;
    $('#' + canvasID)[0].width = Width;
    $('#' + canvasID)[0].height = Height;
    $('#' + canvasID).css({ 'left': Left, 'top': Top });

    var canvas = $('#' + canvasID)[0];
    var cxt = canvas.getContext('2d');
    resizeCanvas(canvas, cxt);

    var img = new Image();
    img.onload = function() {
        
        obj.move = 0;
        if (obj.Looping == 'true') {

        	if (obj.Orientation == 'horizontal') {
        		obj.Scale = Height / img.height;
        		Width = img.width * obj.Scale;
        	} else {
        		obj.Scale = Width / img.width;
				Height = img.height * obj.Scale;
        	}

        	cxt.drawImage(img, 0, 0, Width, Height);
        	// obj.Scale = Width / img.width;
        	clearInterval(Scroll.Interval);
        	Scroll.Interval = setInterval(function() {
	            obj.move = ScrollLoop(obj, img, Width, Height);
	        }, Number(obj.PlayingInterval));

        	canvas.addEventListener('mousedown', function() { LoopingDown(obj, img, canvas, Width, Height) }, false);
			canvas.addEventListener('mousemove', function() { LoopingMove(obj, img, canvas, Width, Height) }, false);
			canvas.addEventListener('mouseup', function() { LoopingUp(obj, img, canvas, Width, Height) }, false);
			canvas.addEventListener('mouseout', function() { LoopingUp(obj, img, canvas, Width, Height) }, false);

			canvas.addEventListener( "touchmove", function() { LoopingMove(obj, img, canvas, Width, Height) }, false ); //手指移動事件
		    canvas.addEventListener( "touchstart", function() { LoopingDown(obj, img, canvas, Width, Height) }, false ); //手指點擊事件
		    canvas.addEventListener( "touchend", function() { LoopingUp(obj, img, canvas, Width, Height) }, false );     //手指放開事件
		    canvas.addEventListener( "touchcancel", function() { LoopingUp(obj, img, canvas, Width, Height) }, false );    //手指離開事件

        } else {
        	if (obj.Paging == 'false') {
	        	if (obj.Orientation == 'horizontal') {
	        		obj.Scale = Height / img.height;
	        		Width = img.width * obj.Scale;
	        	} else {
	        		obj.Scale = Width / img.width;
					Height = img.height * obj.Scale;
	        	}
	        	cxt.drawImage(img, 0, 0, Width, Height);
	        	cxt.globalCompositeOperation = 'copy';

	        } else if (obj.Paging == 'true') {
	        	if (obj.Orientation == 'horizontal') {
	        		Width = Width * obj.Size;
	        		obj.Scale = Width / img.width;
	        	} else {
	        		Height = Height * obj.Size;
	        		obj.Scale = Height / img.height;
	        	}
	        	obj.ScrollPage = 0;
	        	cxt.drawImage(img, 0, 0, Width, Height);
	        	cxt.globalCompositeOperation = 'copy';
	        }

	        canvas.addEventListener('mousedown', function() { ManualDown(obj, img, canvas, Width, Height) }, false);
			canvas.addEventListener('mousemove', function() { ManualMove(obj, img, canvas, Width, Height) }, false);
			canvas.addEventListener('mouseup', function() { ManualUp(obj, img, canvas, Width, Height) }, false);
			canvas.addEventListener('mouseout', function() { ManualUp(obj, img, canvas, Width, Height) }, false);

			$(canvas).on('touchstart', function() {ManualDown(obj, img, canvas, Width, Height)});
			$(canvas).on('touchmove', function() {ManualMove(obj, img, canvas, Width, Height)});
			$(canvas).on('touchend', function() {ManualUp(obj, img, canvas, Width, Height)});
			$(canvas).on('touchcancel', function() {ManualUp(obj, img, canvas, Width, Height)});
		    // canvas.addEventListener( "touchstart", function() { ManualDown(obj, img, canvas, Width, Height) }, false ); //手指點擊事件
			// canvas.addEventListener( "touchmove", function() { ManualMove(obj, img, canvas, Width, Height) }, false ); //手指移動事件
		    // canvas.addEventListener( "touchend", function() { ManualUp(obj, img, canvas, Width, Height) }, false );     //手指放開事件
		    // canvas.addEventListener( "touchcancel", function() { ManualUp(obj, img, canvas, Width, Height) }, false );    //手指離開事件

        }

        if (obj.RectList != undefined) {
        	var Div = document.createElement('div');
			Div.id = 'ScrollDiv' + obj.Identifier;

			//div放在原本動態平移的位置
			$('#' + obj.Identifier).after(Div);
			
			$('#' + Div.id).attr('class', 'canvasObj');
			$('#' + Div.id).css({
		        'position': 'absolute',
		        'left': Left,
		        'top': Top,
		        'width': Width,
		        'height': Height
		    });
		    $('#' + obj.Identifier).css({
		        'left': 0,
		        'top': 0,
		    });
			$('#' + Div.id).append($('#' + obj.Identifier)[0]);

			obj.ImameW = img.width * obj.Scale;

        	for (var i = 0; i < obj.RectList.length; i++) {
	        	var IntroObj = FindIntroObj(obj.RectList[i], page);

	        	if (obj.Paging == 'false') {
		        	IntroObj.Width = obj.RectList[i].W * obj.Scale / scale;
		        	IntroObj.Height = obj.RectList[i].H * obj.Scale / scale;
		        	IntroObj.Left = obj.RectList[i].X * obj.Scale;
		        	IntroObj.Top = obj.RectList[i].Y * obj.Scale;
		        } else if (obj.Paging == 'true') {
		        	if (obj.Orientation == 'horizontal') {
						IntroObj.Width = obj.RectList[i].W * obj.Scale / scale;
			        	IntroObj.Height = obj.RectList[i].H / scale;
			        	IntroObj.Left = obj.RectList[i].X * obj.Scale;
			        	IntroObj.Top = obj.RectList[i].Y;
		        	} else {
			        	IntroObj.Width = obj.RectList[i].W / scale;
			        	IntroObj.Height = obj.RectList[i].H * obj.Scale / scale;
			        	IntroObj.Left = obj.RectList[i].X;
			        	IntroObj.Top = obj.RectList[i].Y * obj.Scale;
		        	}
		        }

	        	NewCanvas(IntroObj);
	        	$('#' + Div.id).append($('#canvas')[0]);
	        	$('#canvas').css({'transform': 'rotate(' + obj.Rotate + 'deg)'});
	            checkRect(IntroObj);
	            var canvasIntro = $('#' + IntroObj.Identifier);
	            obj.RectList[i].L = IntroObj.Left;
	            canvasIntro.css({
			        'left': IntroObj.Left,
			        'top': IntroObj.Top
			    });
	        }
        }
    }
    img.src = 'Resource/' + obj.XFileName;
}

// 取得自訂感應區的功能
function checkRect(obj) {
	switch (obj.FormatterType) {
		case 'HyperLinkObject':
			HyperLinkSet(obj);
			break;
		case 'IntroductionObject':
			IntroCanvasSet(obj);
			break;
	}
}

//自動平移
function ScrollLoop(obj, img, width, height) {
	var scale = MainObj.Scale;
    var Left = obj.move;
    var Top = obj.move;

    var canvas = $('#' + obj.Identifier)[0];
    if (canvas != undefined) {
	    var cxt = canvas.getContext('2d');
	    // resizeCanvas(canvas, cxt);

	    if (obj.Orientation == 'horizontal') {
	    	switch (obj.MoveDirection) {
	    		//往左
	    		case 'left':
	    			Left--;
	    			IntroHorizontal(obj, -1);
	    			break;
	    		//往右
	    		case 'right':
	    			Left++;
	    			IntroHorizontal(obj, 1);
	    			break;
	    	}
			Drawhorizontal(obj, cxt, img, Left, width, height);
	    	return Left;
	    } else {
	    	switch (obj.MoveDirection) {
	    		//往上
	    		case 'up':
	    			Top--;
	    			IntroVertical(obj, -1);
	    			break;
	    		//往下
	    		case 'down':
	    			Top++;
	    			IntroVertical(obj, 1);
	    			break;
	    	}
			Drawvertical(obj, cxt, img, Top, width, height);
	    	return Top;
	    }
	}
}

//畫橫向平移
function Drawhorizontal(obj, cxt, img, move, width, height) {
	if (obj.RectList != undefined) {
		if (move == -Math.floor(obj.ImameW)) {
			var newElement = $('#ScrollDiv' + obj.Identifier)[0].nextElementSibling;
			$('#ScrollDiv' + obj.Identifier).remove();
			NewCanvas(obj);
			if (newElement) {
				$(newElement).before($('#canvas'));
			}
			ScrollSet(obj, MainObj.NowPage);
			return;
		}
	}

	//有些圖片為去背的，這樣會導致圖片畫上去時上下重疊，因此先clear前一狀態
	cxt.clearRect(0, 0, width, height);
	
	cxt.save();
	cxt.translate(move, 0);
	cxt.drawImage(img, 0, 0, width, height);
	cxt.restore();
	if (move < -width || move > width) move = 0;
	cxt.save();
	if (move < 0) {
		cxt.translate(width + move, 0);
	} else if (-move < 0) {
		cxt.translate(-width + move, 0);
	}
	cxt.globalCompositeOperation = 'source-over';
	cxt.drawImage(img, 0, 0, width, height);
	cxt.restore();
}

//畫直向平移
function Drawvertical(obj, cxt, img, move, width, height) {

	//有些圖片為去背的，這樣會導致圖片畫上去時上下重疊，因此先clear前一狀態
	cxt.clearRect(0, 0, width, height);

	cxt.save();
	cxt.translate(0, move);
	cxt.drawImage(img, 0, 0, width, height);
	cxt.restore();
	if (move < -height || move > height) move = 0;
	cxt.save();
	if (move < 0) {
		cxt.translate(0, height + move);
	} else if (-move < 0) {
		cxt.translate(0, -height + move);
	}
	cxt.globalCompositeOperation = 'source-over';
	cxt.drawImage(img, 0, 0, width, height);
	cxt.restore();
}

function LoopingDown(obj, img, canvas, width, height) {
	Scroll.Drag = true;
	clearInterval(Scroll.Interval);

	// Scroll.MouseDown.X = event.layerX;
	// Scroll.MouseDown.Y = event.layerY;

	var isPhone = event.type == 'touchstart' || event.type == 'touchmove' || event.type == 'touchend' || event.type == 'touchcancel';
	if (isPhone) {
		if (event.targetTouches.length) {
			Scroll.MouseMove.X = event.targetTouches[0].pageX;
			Scroll.MouseMove.Y = event.targetTouches[0].pageY;
		}
	} else {
		Scroll.MouseMove.X = event.layerX ? event.layerX : event.originalEvent.layerX;
		Scroll.MouseMove.Y = event.layerY ? event.layerY : event.originalEvent.layerY;
	}
	
    // Scroll.MouseDown.X = event.type == 'touchstart' ? event.targetTouches[0].pageX - $(canvas).offset().left : (event.layerX ? event.layerX : event.originalEvent.layerX);
	// Scroll.MouseDown.Y = event.type == 'touchstart' ? event.targetTouches[0].pageY - $(canvas).offset().top : (event.layerY ? event.layerY : event.originalEvent.layerY);
}

function LoopingMove(obj, img, canvas, width, height) {
	if (Scroll.Drag) {

		// Scroll.MouseMove.X = event.layerX;
		// Scroll.MouseMove.Y = event.layerY;
    	// console.log(Scroll.MouseMove.X + ',' + Scroll.MouseMove.Y);

		var isPhone = event.type == 'touchstart' || event.type == 'touchmove' || event.type == 'touchend' || event.type == 'touchcancel';
		if (isPhone) {
			if (event.targetTouches.length) {
				Scroll.MouseMove.X = event.targetTouches[0].pageX;
				Scroll.MouseMove.Y = event.targetTouches[0].pageY;
			}
		} else {
			Scroll.MouseMove.X = event.layerX ? event.layerX : event.originalEvent.layerX;
			Scroll.MouseMove.Y = event.layerY ? event.layerY : event.originalEvent.layerY;
		}

    	// Scroll.MouseMove.X = event.type == 'touchmove' ? event.targetTouches[0].pageX - $(canvas).offset().left : (event.layerX ? event.layerX : event.originalEvent.layerX);
		// Scroll.MouseMove.Y = event.type == 'touchmove' ? event.targetTouches[0].pageY - $(canvas).offset().top : (event.layerY ? event.layerY : event.originalEvent.layerY);

    	//速度比照滑鼠速度
    	Scroll.MoveNow.X = Math.abs(Scroll.MouseMove.X - Scroll.MouseDown.X);
    	Scroll.MoveNow.Y = Math.abs(Scroll.MouseMove.Y - Scroll.MouseDown.Y);
		if (Scroll.MoveNow.X > 50) Scroll.MoveNow.X = 50;
		if (Scroll.MoveNow.Y > 50) Scroll.MoveNow.Y = 50;

    	var cxt = canvas.getContext('2d');
    	// resizeCanvas(canvas, cxt);

    	if (obj.Orientation == 'horizontal') {
    		if (Scroll.MouseMove.X > Scroll.MouseDown.X) {
    			obj.move = obj.move + Scroll.MoveNow.X;
    			IntroHorizontal(obj, Scroll.MoveNow.X);
    			if (obj.move > width) obj.move = 0;
    		} else if (Scroll.MouseMove.X < Scroll.MouseDown.X) {
    			obj.move = obj.move - Scroll.MoveNow.X;
    			IntroHorizontal(obj, - Scroll.MoveNow.X);
    			if (obj.move < -width) obj.move = 0;
    		}
	    	Drawhorizontal(obj, cxt, img, obj.move, width, height);
	    	Scroll.MouseDown.X = Scroll.MouseMove.X;

	    } else if (obj.Orientation == 'vertical') {
	    	if (Scroll.MouseMove.Y > Scroll.MouseDown.Y) {
    			obj.move = obj.move + Scroll.MoveNow.Y;
    			IntroVertical(obj, Scroll.MoveNow.Y);
    			if (obj.move > height) obj.move = 0;
    		} else if (Scroll.MouseMove.Y < Scroll.MouseDown.Y) {
    			obj.move = obj.move - Scroll.MoveNow.Y;
    			IntroVertical(obj, - Scroll.MoveNow.Y);
    			if (obj.move < -height) obj.move = 0;
    		}
	    	Drawvertical(obj, cxt, img, obj.move, width, height);
	    	Scroll.MouseDown.Y = Scroll.MouseMove.Y;
	    }
    	// console.log(obj.move);
	}
}

function LoopingUp(obj, img, canvas, width, height) {
	Scroll.Drag = false;
	if (obj.Looping == 'true') {
		clearInterval(Scroll.Interval);
		Scroll.Interval = setInterval(function() {
	        obj.move = ScrollLoop(obj, img, width, height);
	    }, Number(obj.PlayingInterval));
	}
}

function ManualDown(obj, img, canvas, width, height) {
	event.stopPropagation();
	event.preventDefault();

	// Scroll.MouseDown.X = event.layerX;
	// Scroll.MouseDown.Y = event.layerY;

	var isPhone = event.type == 'touchstart' || event.type == 'touchmove' || event.type == 'touchend' || event.type == 'touchcancel';
	if (isPhone) {
		if (event.targetTouches.length) {
			Scroll.MouseDown.X = event.targetTouches[0].pageX;
			Scroll.MouseDown.Y = event.targetTouches[0].pageY;
		}
	} else {
		Scroll.MouseDown.X = event.layerX ? event.layerX : event.originalEvent.layerX;
		Scroll.MouseDown.Y = event.layerY ? event.layerY : event.originalEvent.layerY;
	}
    // Scroll.MouseDown.X = isPhone ? ((event.targetTouches.length ? event.targetTouches[0].pageX : Scroll.MouseMove.X) - $(canvas).offset().left) : (event.layerX ? event.layerX : event.originalEvent.layerX);
	// Scroll.MouseDown.Y = isPhone ? ((event.targetTouches.length ? event.targetTouches[0].pageY : Scroll.MouseMove.Y) - $(canvas).offset().top) : (event.layerY ? event.layerY : event.originalEvent.layerY);
	Scroll.Drag = true;
}

function ManualMove(obj, img, canvas, width, height) {
	event.stopPropagation();
	event.preventDefault();
	if (Scroll.Drag) {

		// Scroll.MouseMove.X = event.layerX;
		// Scroll.MouseMove.Y = event.layerY;
		// console.log(Scroll.MouseMove.X + ',' + Scroll.MouseMove.Y);

		var isPhone = event.type == 'touchstart' || event.type == 'touchmove' || event.type == 'touchend' || event.type == 'touchcancel';
		if (isPhone) {
			if (event.targetTouches.length) {
				Scroll.MouseMove.X = event.targetTouches[0].pageX;
				Scroll.MouseMove.Y = event.targetTouches[0].pageY;
			}
		} else {
			Scroll.MouseMove.X = event.layerX ? event.layerX : event.originalEvent.layerX;
			Scroll.MouseMove.Y = event.layerY ? event.layerY : event.originalEvent.layerY;
		}
    	// Scroll.MouseMove.X = isPhone ? ((event.targetTouches.length ? event.targetTouches[0].pageX : 0) - $(canvas).offset().left) : (event.layerX ? event.layerX : event.originalEvent.layerX);
		// Scroll.MouseMove.Y = isPhone ? ((event.targetTouches.length ? event.targetTouches[0].pageY : 0) - $(canvas).offset().top) : (event.layerY ? event.layerY : event.originalEvent.layerY);
		
		//速度比照滑鼠速度
    	Scroll.MoveNow.X = Math.abs(Scroll.MouseMove.X - Scroll.MouseDown.X);
		Scroll.MoveNow.Y = Math.abs(Scroll.MouseMove.Y - Scroll.MouseDown.Y);
		if (Scroll.MoveNow.X > 50) Scroll.MoveNow.X = 50;
		if (Scroll.MoveNow.Y > 50) Scroll.MoveNow.Y = 50;

    	var cxt = canvas.getContext('2d');
    	// resizeCanvas(canvas, cxt);

    	if (obj.Orientation == 'horizontal') {
    		if (Scroll.MouseMove.X > Scroll.MouseDown.X) {
    			obj.move = obj.move + Scroll.MoveNow.X;
    			if (obj.move > 0) {
    				obj.move = obj.move - Scroll.MoveNow.X;
    				IntroHorizontal(obj, 0);
    			} else {
    				IntroHorizontal(obj, Scroll.MoveNow.X);
    			}
    			Scroll.Paging = 'L';
    		} else if (Scroll.MouseMove.X < Scroll.MouseDown.X) {
    			obj.move = obj.move - Scroll.MoveNow.X;
    			if (obj.move < $(canvas).width() - width) {
    				obj.move = obj.move + Scroll.MoveNow.X;
    				IntroHorizontal(obj, 0);
    			} else {
    				IntroHorizontal(obj, - Scroll.MoveNow.X);
    			}
    			Scroll.Paging = 'R';
    		}
	    	Drawhorizontal(obj, cxt, img, obj.move, width, height);
	    	Scroll.MouseDown.X = Scroll.MouseMove.X;

	    } else if (obj.Orientation == 'vertical') {
			if (Scroll.MouseMove.Y > Scroll.MouseDown.Y) {
				obj.move = obj.move + Scroll.MoveNow.Y;
				if (obj.move > 0) {
					obj.move = obj.move - Scroll.MoveNow.Y;
					IntroVertical(obj, 0);
				} else {
					IntroVertical(obj, Scroll.MoveNow.Y);
				}
				Scroll.Paging = 'T';
			} else if (Scroll.MouseMove.Y < Scroll.MouseDown.Y) {
				obj.move = obj.move - Scroll.MoveNow.Y;
				if (obj.move < $(canvas).height() - height) {
					obj.move = obj.move + Scroll.MoveNow.Y;
					IntroVertical(obj, 0);
				} else {
					IntroVertical(obj, - Scroll.MoveNow.Y);
				}
				Scroll.Paging = 'D';
			}
	    	Drawvertical(obj, cxt, img, obj.move, width, height);
	    	Scroll.MouseDown.Y = Scroll.MouseMove.Y;
	    }
    	// console.log(obj.move);
	}
}

function ManualUp(obj, img, canvas, width, height) {
	if (Scroll.Drag) {
		if (obj.Paging == 'true') {
			var cxt = canvas.getContext('2d');
			// resizeCanvas(canvas, cxt);
			//平移模式，判斷是往哪個方向移動
			switch (Scroll.Paging) {
				case 'L':
					obj.ScrollPage--;
					if (obj.ScrollPage < 0) {
						obj.ScrollPage = obj.Size;
						gotoPage(MainObj.NowPage - 1);
						return;
					}
					obj.move = -(canvas.width * obj.ScrollPage);
					Drawhorizontal(obj, cxt, img, obj.move, width, height);
					IntroHorizontal(obj);
					break;

				case 'R':
					obj.ScrollPage++;
					if (obj.ScrollPage >= obj.Size) {
						obj.ScrollPage = 0;
						gotoPage(MainObj.NowPage + 1);
						return;
					}
					obj.move = -(canvas.width * obj.ScrollPage);
					Drawhorizontal(obj, cxt, img, obj.move, width, height);
					IntroHorizontal(obj);
					break;

				case 'T':
					obj.ScrollPage--;
					if (obj.ScrollPage < 0) obj.ScrollPage = obj.Size;
					obj.move = -(canvas.height * obj.ScrollPage);
					Drawvertical(obj, cxt, img, obj.move, width, height);
					IntroVertical(obj);
					break;

				case 'D':
					obj.ScrollPage++;
					if (obj.ScrollPage >= obj.Size) obj.ScrollPage = 0;
					obj.move = -(canvas.height * obj.ScrollPage);
					Drawvertical(obj, cxt, img, obj.move, width, height);
					IntroVertical(obj);
					break;
			}
		}
	}

	Scroll.Drag = false;
	
}

//取得自訂感應區物件
function FindIntroObj(obj, page) {
	var HamaObj = HamaList[page].Objects;
	for (var i = 0; i < HamaObj.length; i++) {

		if (HamaObj[i].Identifier == obj.RectID) {
			return HamaObj[i];
		}
	}
}

//自訂感應區橫向平移
function IntroHorizontal(obj, num) {
	if (obj.RectList != undefined) {
		for (var i = 0; i < obj.RectList.length; i++) {

			var canvas = $('#' + obj.RectList[i].RectID);
			var Width = $('#' + obj.Identifier)[0].width;
			var Left = canvas[0].offsetLeft + num;

			if (obj.Looping == 'true') {

				if (canvas[0].offsetLeft < 0 && num < 0) {
					Left = obj.ImameW;
				// } else if (canvas[0].offsetLeft + canvas[0].width > Width && num > 0) {
				} else if (obj.move + Math.floor(obj.RectList[i].L) < 5 && obj.move + Math.floor(obj.RectList[i].L) >= -5 && num > 0) {
					// Left = 0 - canvas[0].width;
					Left = 0;
				}

			} else if (obj.Paging == 'false') {
				if (canvas[0].offsetLeft < 0 && num < 0) {
					canvas.css('display', 'none');
				} else if (canvas[0].offsetLeft == 0 && num == 0 && canvas[0].offsetLeft + canvas[0].width > Width) {
					canvas.css('display', 'block');
					Left = obj.RectList[i].X * obj.Scale;
				}
				
			} else if (num == null) {	//平移模式滑鼠放開重新定位感應區
				Left = (obj.RectList[i].X * obj.Scale) - (Width * obj.ScrollPage);
				if (Left < 0 || Left + canvas[0].width > Width) {
					canvas.css('display', 'none');
				} else {
					canvas.css('display', 'block');
				}
			}
			canvas.css('left', Left);
		}
	}
}

//自訂感應區直向平移
function IntroVertical(obj, num) {
	if (obj.RectList != undefined) {
		for (var i = 0; i < obj.RectList.length; i++) {
			var canvas = $('#' + obj.RectList[i].RectID);
			var Height = $('#' + obj.Identifier)[0].height;
			var Top = canvas[0].offsetTop + num;

			if (obj.Looping == 'true') {
				if (canvas[0].offsetTop < 0 && num < 0) {
					Top = Height;
				} else if (canvas[0].offsetTop + canvas[0].height > Height && num > 0) {
					Top = 0 - canvas[0].height;
				}

			} else if (obj.Paging == 'false') {
				if (canvas[0].offsetTop < 0 && num < 0) {
					canvas.css('display', 'none');
				} else if (canvas[0].offsetTop == 0 && num == 0 && canvas[0].offsetTop + canvas[0].height > Height) {
					canvas.css('display', 'block');
					Top = obj.RectList[i].Y * MainObj.Scale;
				}

			} else if (num == null) {	//平移模式滑鼠放開重新定位感應區
				Top = (obj.RectList[i].Y * obj.Scale) - (Height * obj.ScrollPage);
				if (Top < 0 || Top + canvas[0].height > Height) {
					canvas.css('display', 'none');
				} else {
					canvas.css('display', 'block');
				}
			}
			canvas.css('top', Top);
		}
	}
}

function ScrollReset() {
	clearInterval(Scroll.Interval);
}