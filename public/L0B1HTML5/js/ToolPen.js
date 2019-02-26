//畫筆

var colorPen = {
    Color: 'rgb(255,0,0)', //畫筆顏色
    Width: 3,   //畫筆寬度
    Opacity: 1.0,   //畫筆透明度
    Drag: false,
    Down: {X: 0, Y: 0}, //滑鼠點擊的座標
    Move: {X: 0, Y: 0}, //滑鼠移動的座標
    Line: {X: [], Y: []},   //存入畫線的所有座標
    LineList: []    //保存所有畫完的線的資訊(id、大小位置、所在頁數、所有座標)
}


function StartPen() {

    // colorPen.Down.X = event.clientX;
    // colorPen.Down.Y = event.clientY;
    colorPen.Down.X = event.type == 'touchstart' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
    colorPen.Down.Y = event.type == 'touchstart' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

    GalleryStopMove();
    colorPen.Drag = true;
    NewCanvas();
    var canvasPad = $('#canvas')[0];
    canvasPad.id = 'canvasPad';
    canvasPad.width = $(window).width();
    canvasPad.height = $(window).height();

    var ID = newguid();

    $(canvasPad).on('mousemove', function() { canvasPadMove(canvasPad, ID); });
    $(canvasPad).on('mouseup', function() { canvasPadUp(canvasPad, ID); });

    $(canvasPad).on('touchmove', function() { canvasPadMove(canvasPad, ID); });
    $(canvasPad).on('touchend', function() { canvasPadUp(canvasPad, ID); });

}

function canvasPadMove(canvas, id) {

    // colorPen.Move.X = event.clientX;
    // colorPen.Move.Y = event.clientY;
    colorPen.Move.X = event.type == 'touchmove' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
    colorPen.Move.Y = event.type == 'touchmove' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

    var cxt = canvas.getContext('2d');
    // resizeCanvas(canvas, cxt);

    if (colorPen.Drag) {

        cxt.strokeStyle = colorPen.Color;
        cxt.lineWidth = colorPen.Width;

        cxt.moveTo(colorPen.Down.X, colorPen.Down.Y);
        cxt.lineTo(colorPen.Move.X, colorPen.Move.Y);
        cxt.stroke();
        //將( txtCanvas.Move.X , txtCanvas.Move.Y )取代起始點
        colorPen.Down.X = colorPen.Move.X;
        colorPen.Down.Y = colorPen.Move.Y;

        //將畫線的座標都存入colorPen.Line裡面
        var x = (Number(colorPen.Move.X) - MainObj.CanvasL) / MainObj.Scale;
        var y = (Number(colorPen.Move.Y) - MainObj.CanvasT) / MainObj.Scale;
        var list = {X: x, Y: y};
        colorPen.Line.X.push(list.X);
        colorPen.Line.Y.push(list.Y);
    }
}

//canvasPad為畫板
//newCanvas為畫完後呈現的結果
function canvasPadUp(canvas, id) {
    var canvasList = {};
    canvasList.points = [];
    for (var i = 0; i < colorPen.Line.X.length; i++) {

        canvasList.points.push({X: colorPen.Line.X[i], Y: colorPen.Line.Y[i]});
    }

    colorPen.Drag = false;

    //將線的座標由小至大排序，才能知道canvas的大小
    var ListX = colorPen.Line.X.sort(function(a,b) { return a - b; });
    ListX = ListX.filter(function(x) {
        if (x) {
            return x;
        }
    })
    var minX = ListX[0];
    var maxX = ListX[ListX.length - 1];

    var ListY = colorPen.Line.Y.sort(function(a,b) { return a - b; });
    ListY = ListY.filter(function(x) {
        if (x) {
            return x;
        }
    })
    var minY = ListY[0];
    var maxY = ListY[ListY.length - 1];

    NewCanvas();
    var newCanvas = $('#canvas')[0];
    newCanvas.id = id;

    $(newCanvas).addClass('pen');

    var width = maxX - minX + colorPen.Width * 2;
    var height = maxY - minY + colorPen.Width * 2;
    var left = minX - colorPen.Width;
    var top = minY - colorPen.Width;

    //width、height都+colorPen.Width*2的原因是
    //原本的大小不包含線的寬度
    //如果沒有加上兩倍的寬度，會截到線
    //left、top也是一樣的原理
    newCanvas.width = width * MainObj.Scale;
    newCanvas.height = height * MainObj.Scale;

    var newCxt = newCanvas.getContext('2d');
    // resizeCanvas(newCanvas, newCxt);

    newCxt.globalAlpha = colorPen.Opacity;
    newCxt.drawImage(canvas, -(left * MainObj.Scale + MainObj.CanvasL), -(top * MainObj.Scale + MainObj.CanvasT));

    $(newCanvas).css({
        'left': left * MainObj.Scale + MainObj.CanvasL,
        'top': top * MainObj.Scale + MainObj.CanvasT,
        'pointer-events': 'none'
    })

    $('#canvasPad').remove();

    if (ToolBarList.AddWidgetState == 'IRSpen') {
        $(newCanvas).addClass('IRSpen');
    }
    if (!isIRS) {
        canvasList = {
            id: id,
            type: 'pen',
            object: {
                width: width,
                height: height,
                left: left,
                top: top,
                penwidth: colorPen.Width,
                color: colorPen.Color,
                opacity: Number(colorPen.Opacity)
            },
            page: MainObj.NowPage,
            points: canvasList.points,
            isIRS: false
        };
    
        colorPen.LineList.push(canvasList);
    }
    

    if ($('#discussCanvas')[0] == undefined) {
        GalleryStartMove();
    }

    colorPen.Line = {X: [], Y: []};

    var syncXML = toSyncXML();
    var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
    rmcall(message);

    // alert(message);

}

//回來此頁面時，若原本有畫筆，則在重新建一個canvas畫出來
//gotoPage最後執行
function DrawPen(page) {

    $('.pen').remove();

    $(colorPen.LineList).each(function() {
        if (this.page == page) {
            // console.log(this.id);

            if ($('#' + this.id)[0] == undefined) {

                NewCanvas();
                var canvas = $('#canvas')[0];

                var width = this.object.width * MainObj.Scale;
                var height = this.object.height * MainObj.Scale;
                var left = this.object.left * MainObj.Scale + MainObj.CanvasL;
                var top = this.object.top * MainObj.Scale + MainObj.CanvasT;

                canvas.id = this.id;
                canvas.width = width;
                canvas.height = height;
                $(canvas).css({
                    'left': left,
                    'top': top,
                    'opacity': this.object.opacity,
                    'pointer-events': 'none'
                })

                $(canvas).addClass('pen');

                var cxt = canvas.getContext('2d');
                // resizeCanvas(canvas, cxt);

                for (var i = 1; i < this.points.length; i++) {

                    cxt.strokeStyle = this.object.color;
                    cxt.lineWidth = this.object.penwidth;

                    var x1 = this.points[i - 1].X * MainObj.Scale - left + MainObj.CanvasL;
                    var y1 = this.points[i - 1].Y * MainObj.Scale - top + MainObj.CanvasT;
                    var x2 = this.points[i].X * MainObj.Scale - left + MainObj.CanvasL;
                    var y2 = this.points[i].Y * MainObj.Scale - top + MainObj.CanvasT;

                    cxt.moveTo(x1, y1);
                    cxt.lineTo(x2, y2);
                    cxt.stroke();

                }
            }
        }
    });
}





