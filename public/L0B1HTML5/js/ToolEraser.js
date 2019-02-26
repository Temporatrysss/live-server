//橡皮擦

var Eraser = {
    Drag: false,
    Down: {X: 0, Y: 0},//滑鼠點擊的座標
    Move: {X: 0, Y: 0}//滑鼠移動的座標
}




function StartEraser() {
    // Eraser.Down.X = event.clientX;
    // Eraser.Down.Y = event.clientY;
    Eraser.Down.X = event.type == 'touchstart' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
    Eraser.Down.Y = event.type == 'touchstart' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

    GalleryStopMove();
    Eraser.Drag = true;
    NewCanvas();
    var canvasEraser = $('#canvas')[0];
    canvasEraser.id = 'canvasEraser';
    canvasEraser.width = $(window).width();
    canvasEraser.height = $(window).height();
    $(canvasEraser).css('z-index', '1000');

    $(canvasEraser).on('mousemove', function() { EraserMove(canvasEraser); });
    $(canvasEraser).on('mouseup', function() { EraserUp(canvasEraser); });

    $(canvasEraser).on('touchmove', function() { EraserMove(canvasEraser); });
    $(canvasEraser).on('touchend', function() { EraserUp(canvasEraser); });
}

function EraserMove(canvas) {
    if (Eraser.Drag) {

        // Eraser.Move.X = event.clientX;
        // Eraser.Move.Y = event.clientY;
        Eraser.Move.X = event.type == 'touchmove' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
        Eraser.Move.Y = event.type == 'touchmove' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

        var width = Eraser.Move.X - Eraser.Down.X;
        var height = Eraser.Move.Y - Eraser.Down.Y;

        var cxt = canvas.getContext('2d');
        // resizeCanvas(canvas, cxt);

        // IE不支援copy參數，所以只能清除重畫了
        cxt.clearRect(0, 0, canvas.width, canvas.height);

        cxt.lineWidth = 5; //線寬度
        cxt.setLineDash([15, 20]); //虛線
        cxt.strokeRect(Eraser.Down.X, Eraser.Down.Y, width, height);
        cxt.stroke();

        // cxt.globalCompositeOperation = 'copy'; //只顯示新畫的圖
    }
}

function EraserUp(canvas) {

    var X1 = FindMin(Eraser.Down.X, Eraser.Move.X), //橡皮擦左上角的X
        Y1 = FindMin(Eraser.Down.Y, Eraser.Move.Y), //橡皮擦左上角的Y
        X2 = FindMax(Eraser.Down.X, Eraser.Move.X), //橡皮擦右下角的X
        Y2 = FindMax(Eraser.Down.Y, Eraser.Move.Y), //橡皮擦右下角的Y
        Obj = []; //要刪除的線存在這裡

    //刪除畫筆
    for (var i = 0; i < colorPen.LineList.length; i++) {
        if (colorPen.LineList[i] != undefined) {
            if (colorPen.LineList[i].page == MainObj.NowPage) {

                $(colorPen.LineList[i].points).each(function() {
                    //若是線的其中一點座標有在橡皮擦的範圍內，則記錄到Obj裡

                    var Xpoint = this.X * MainObj.Scale + MainObj.CanvasL;
                    var Ypoint = this.Y * MainObj.Scale + MainObj.CanvasT;

                    if (Xpoint > X1 && Xpoint < X2 && Ypoint > Y1 && Ypoint < Y2) {
                        Obj.push(colorPen.LineList[i].id);
                    }
                });
            }
        }
    }

    var Point = {X1: X1, Y1: Y1, X2: X2, Y2: Y2};

    FindWidget(Obj, Point, txtNote.SaveList);
    FindWidget(Obj, Point, txtCanvas.SaveList);
    FindWidget(Obj, Point, InsertImg.SaveList);
    FindWidget(Obj, Point, Recoding.SaveList);

    if (Obj.length > 0) {
        confirmShow('是否確定刪除物件', function(res) {
            if (res) {
                //一次刪除有框到的線
                for (var objid = 0; objid < Obj.length; objid++) {
    
                    $('#' + Obj[objid]).remove();
    
                    DeleteList(Obj, colorPen.LineList, objid);  //畫筆             
                    DeleteList(Obj, txtNote.SaveList, objid);  //文字便利貼
                    DeleteList(Obj, txtCanvas.SaveList, objid);  //便利貼
                    DeleteList(Obj, InsertImg.SaveList, objid);  //插入圖片
                    DeleteList(Obj, Recoding.SaveList, objid);  //錄音
                }
            }
        })
    }

    $('#canvasEraser').remove();

    Eraser.Drag = false;
    GalleryStartMove();

    var syncXML = toSyncXML();
    var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
    rmcall(message);
}

//取得橡皮擦範圍內的物件(文字便利貼、便利貼、圖片、錄音)
function FindWidget(Obj, Point, list) {
    for(var i = 0; i < list.length; i++) {
        if (list[i] != undefined) {
            if (list[i].page == MainObj.NowPage) {
                var obj = list[i];
                var left, top, right, down;
                if (obj.type == 'txtCanvas' || obj.type == 'txtNote') {
                    left = Number(obj.left.split('px')[0]) * MainObj.Scale + MainObj.CanvasL;
                    top = Number(obj.top.split('px')[0]) * MainObj.Scale + MainObj.CanvasT;
                    right = Number(obj.width.split('px')[0]) * MainObj.Scale + left;
                    down = Number(obj.height.split('px')[0]) * MainObj.Scale + top;
                } else {
                    left = Number(obj.left.split('px')[0]);
                    top = Number(obj.top.split('px')[0]);
                    right = Number(obj.width.split('px')[0]) + left;
                    down = Number(obj.height.split('px')[0]) + top;
                }

                if (!(left > Point.X2 || right < Point.X1 || top > Point.Y2 || down < Point.Y1)) {
                    // console.log(obj);
                    Obj.push(obj.id);
                }
            }
        }
    }
}

//取兩點最大
function FindMax(a, b) {
    if (a > b) {
        return a;
    } else {
        return b;
    }
}

//取兩點最小
function FindMin(a, b) {
    if (a > b) {
        return b;
    } else {
        return a;
    }
}

//刪除有保存到list的各個Widget
function DeleteList(obj, list, objid) {
    for (var i = 0; i < list.length; i++) {
        //刪掉canvas之外，還要把原本有記錄到的刪掉
        if (list[i] != undefined) {
            if (list[i].id == obj[objid]) {
                delete list[i];
            }
        }
    }

    SaveCanvas();
    SaveNote();

    
}