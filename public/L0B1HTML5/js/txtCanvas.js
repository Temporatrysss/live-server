//便利貼

var txtCanvas = {
    Move: {X: 0, Y: 0}, //mousedown
    Down: {X: 0, Y: 0}, //mousemove
    Drag: false,
    Line: {X: [], Y: []},   //存入畫線的所有座標
    canvasList: [],
    SaveList: []
}


function txtCanvasLayer() {

    var ID = newguid();

    var divBox = document.createElement('div');
    $('#HamastarWrapper').append(divBox);
    divBox.id = ID;
    $(divBox).attr('class', 'NoteBox');

    if (ToolBarList.AddWidgetState == 'IRStxtcanvas') {
        $(divBox).addClass('IRScanvas');
    }
    
    var div = document.createElement('div');
    $(divBox).append(div);
    div.id = 'Div' + ID;
    $(div).draggable({
        //如果有移動，則不觸發click事件
        stop: function(event, ui) {
            $(this).addClass('noclick');
            FindBoundary(ui, div);

            SaveCanvas();

            var syncXML = toSyncXML();
            var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
            rmcall(message);
        }
    });

    NewCanvas();
    var canvas = $('#canvas')[0];
    $(div).append(canvas);
    var cxt = canvas.getContext('2d');
    canvas.id = 'txtCanvas' + ID;
    $(canvas).attr('class', 'noteCanvas');

    // var Left = event.clientX;
    // var Top = event.clientY;

    var Left = event.type == 'touchstart' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
    var Top = event.type == 'touchstart' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

    var img = new Image();
    img.onload = function() {
        canvas.width = img.width * 2 * MainObj.Scale;
        canvas.height = img.height * MainObj.Scale;
        // resizeCanvas(canvas, cxt);
        cxt.drawImage(img, 0, 0, canvas.width, canvas.height);

        var newPosition = txtPosition(Left, Top, canvas);
        Left = newPosition[0];
        Top = newPosition[1];

        $('#' + div.id).css({
            'position': 'absolute',
            'width': canvas.width,
            'height': canvas.height,
            'left': Left,
            'top': Top
        })

        txtCloseSetting(div, ID);
        txtNarrowLayer(div, ID);
        CanvasNarrowSmall(divBox, img, ID);

        var canvasArea = txtCanvasArea(div, img, ID);

        //canvasArea畫畫
        $(canvasArea).on('mousedown', function() { txtCanvasDown(this, div) })
        $(canvasArea).on('mousemove', function() { txtCanvasMove(this) });
        $(canvasArea).on('mouseup', function() { txtCanvasUp(this, div) });
        $(canvasArea).on('mouseout', function() { txtCanvasUp(this, div) });

        $(canvasArea).on('touchstart', function() { txtCanvasDown(this, div) })
        $(canvasArea).on('touchmove', function() { txtCanvasMove(this) });
        $(canvasArea).on('touchend', function() { txtCanvasUp(this, div) });
        // $(canvasArea).on('mouseout', function() { txtCanvasUp(this, div) });

        //紀錄canvas縮放後的scale
        $(canvasArea).attr('ScaleW', 1);
        $(canvasArea).attr('ScaleH', 1);

        $(canvasArea).resizable({
            minHeight: canvas.height,
            minWidth: canvas.width,
            start: function() {
                $(window).off("resize", resizeInit);
            },
            resize: function() {
                var Width = Number(this.style.width.split('px')[0]);
                canvas.width = Width;
                cxt.drawImage(img, 0, 0, canvas.width, canvas.height);
                $('#' + div.id).css('width', Width);
                $(canvasArea).css({
                    'position': 'absolute',
                    'top': 0
                })
            },
            stop: function(event, ui) {
                var NewWidth = ui.size.width;
                var NewHeight = ui.size.height;

                $(canvasArea).attr('ScaleW', NewWidth / canvasArea.width);
                $(canvasArea).attr('ScaleH', NewHeight / canvasArea.height);

                SaveCanvas();
                $(window).resize(resizeInit);
            }
        });

        SaveCanvas();

        var syncXML = toSyncXML();
        var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
        rmcall(message);

    }
    img.src = 'ToolBar/txtcanvas.png';
}

//便利貼小圖設置
function CanvasNarrowSmall(div, img, id) {
    //note小圖
    var narrowDiv = document.createElement('div');
    $(div).append(narrowDiv);
    narrowDiv.id = 'narrowDiv' + id;
    $(narrowDiv).attr('class', 'narrowDiv');
    $(narrowDiv).css({
        'position': 'absolute',
        'width': img.width,
        'height': img.height
    })
    var smallImg = new Image();
    $(narrowDiv).append(smallImg);
    smallImg.onload = function() {
        smallImg.width = 50 * MainObj.Scale;
        smallImg.height = 50 * MainObj.Scale;
    }
    smallImg.src = 'ToolBar/note.png';
    $(narrowDiv).css({
        'display': 'none'
    });
    txtNarrowSetting(narrowDiv, id);
    $(narrowDiv).draggable({
        //如果有移動，則不觸發click事件
        stop: function(event, ui) {
            $(this).addClass('noclick');

            var left = ui.offset.left;
            var top = ui.offset.top;
            var width = 50 * MainObj.Scale;
            var height = 50 * MainObj.Scale;

            var canvasW = $('#CanvasGallery')[0].width + MainObj.CanvasL;
            var canvasH = $('#CanvasGallery')[0].height + MainObj.CanvasT;

            if (left < MainObj.CanvasL) {
                $(narrowDiv).css('left', MainObj.CanvasL);
            } else if (left + width > canvasW) {
                $(narrowDiv).css('left', canvasW - width);
            } else if (top < MainObj.CanvasT) {
                $(narrowDiv).css('top', MainObj.CanvasT);
            } else if (top + height > canvasH) {
                $(narrowDiv).css('top', canvasH - height);
            }

            $('#Div' + id).css({
                'left': $(narrowDiv)[0].offsetLeft,
                'top': $(narrowDiv)[0].offsetTop
            })

            SaveCanvas();

            var syncXML = toSyncXML();
            var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
            rmcall(message);

        }
    });
}

//便利貼畫圖區域設置
function txtCanvasArea(div, img, id) {
    //畫畫區域
    var canvasArea = document.createElement('canvas');
    var cxtArea = canvasArea.getContext('2d');
    canvasArea.width = img.width * 2 * MainObj.Scale;
    canvasArea.height = 190 * MainObj.Scale;
    canvasArea.id = id;
    $(canvasArea).attr('class', 'canvasArea');
    $(div).append(canvasArea);
    $(canvasArea).css({
        'position': 'absolute',
        'top': Math.floor(img.height * MainObj.Scale)
    })
    cxtArea.fillStyle = "#fdfdc8";
    cxtArea.fillRect(0, 0, canvasArea.width, canvasArea.height);

    // resizeCanvas(canvasArea, cxtArea);

    return canvasArea;
}

function txtCanvasDown(canvas, div) {
    //便利貼縮放後的滑鼠座標位置會跑掉，因此要除上縮放後的scale

    var scaleW = $(canvas).attr('ScaleW');
    var scaleH = $(canvas).attr('ScaleH');

    // txtCanvas.Down.X = event.offsetX / scaleW;
    // txtCanvas.Down.Y = event.offsetY / scaleH;
    txtCanvas.Down.X = event.type == 'touchstart' ? event.targetTouches[0].pageX - $(canvas).offset().left : event.offsetX;
    txtCanvas.Down.Y = event.type == 'touchstart' ? event.targetTouches[0].pageY - $(canvas).offset().top : event.offsetY;

    txtCanvas.Down.X = txtCanvas.Down.X / scaleW;
    txtCanvas.Down.Y = txtCanvas.Down.Y / scaleH;

    txtCanvas.Drag = true;

    //停止draggable事件
    $(div).draggable('destroy');
    
}

function txtCanvasMove(canvas) {
    //便利貼縮放後的滑鼠座標位置會跑掉，因此要除上縮放後的scale

    var scaleW = $(canvas).attr('ScaleW');
    var scaleH = $(canvas).attr('ScaleH');

    // txtCanvas.Move.X = event.offsetX / scaleW;
    // txtCanvas.Move.Y = event.offsetY / scaleH;
    txtCanvas.Move.X = event.type == 'touchmove' ? event.targetTouches[0].pageX - $(canvas).offset().left : event.offsetX;
    txtCanvas.Move.Y = event.type == 'touchmove' ? event.targetTouches[0].pageY - $(canvas).offset().top : event.offsetY;

    txtCanvas.Move.X = txtCanvas.Move.X / scaleW;
    txtCanvas.Move.Y = txtCanvas.Move.Y / scaleH;

    var cxt = canvas.getContext('2d');
    // resizeCanvas(canvas, cxt);

    if (txtCanvas.Drag) {
        // console.log(txtCanvas.Move.X + ',' + txtCanvas.Move.Y);

        cxt.lineWidth = 3;

        cxt.moveTo(txtCanvas.Down.X, txtCanvas.Down.Y);
        cxt.lineTo(txtCanvas.Move.X, txtCanvas.Move.Y);
        cxt.stroke();
        //將( txtCanvas.Move.X , txtCanvas.Move.Y )取代起始點
        txtCanvas.Down.X = txtCanvas.Move.X;
        txtCanvas.Down.Y = txtCanvas.Move.Y;

        //將畫線的座標都存入colorPen.Line裡面
        var list = {X: Number(txtCanvas.Move.X), Y: Number(txtCanvas.Move.Y)};
        txtCanvas.Line.X.push(list.X);
        txtCanvas.Line.Y.push(list.Y);

    }
}

function txtCanvasUp(canvas, div) {
    if (txtCanvas.Drag) {
        // txtCanvas.canvasList.points = [];
        var list = [];
        for (var i = 1; i < txtCanvas.Line.X.length; i++) {
            // txtCanvas.canvasList.points.push({X: txtCanvas.Line.X[i], Y: txtCanvas.Line.Y[i]});
            list.push({X: txtCanvas.Line.X[i] / MainObj.Scale, Y: txtCanvas.Line.Y[i] / MainObj.Scale, id: canvas.id});
        }
        txtCanvas.canvasList.push(list);

        SaveCanvas();

        var syncXML = toSyncXML();
        var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
        rmcall(message);

        txtCanvas.Line = {X: [], Y: []};

        //重新綁上draggable事件
        $(div).draggable({
            //如果有移動，則不觸發click事件
            stop: function(event, ui) {
                $(this).addClass('noclick');
                FindBoundary(ui, div);

                SaveCanvas();

                var syncXML = toSyncXML();
                var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
                rmcall(message);
            }
        });

        txtCanvas.Drag = false;
    }
}

//初始化
function txtCanvasReset() {
    $('.NoteBox').remove();
}

//儲存note的資訊於txtCanvas.SaveList
function SaveCanvas() {

    if (ToolBarList.AddWidgetState == 'IRStxtcanvas') return;

    var list = {};
    var note = $('.canvasArea');

    if (txtCanvas.SaveList.length > 0) {
        for (var x = 0; x < txtCanvas.SaveList.length; x++) {
            if (txtCanvas.SaveList[x] != undefined) {
                if (txtCanvas.SaveList[x].page == MainObj.NowPage) {
                    delete txtCanvas.SaveList[x];
                }
            }
        }
    }

    for (var i = 0; i < note.length; i++) {
        var tmp;
        if (FindStickyViewVisibility(note[i].id) == 'true') {
            var tmp = '#Div';
        } else {
            var tmp = '#narrowDiv';
        }

        var left = ($(tmp + note[i].id).offset().left - MainObj.CanvasL) / MainObj.Scale;
        var top = ($(tmp + note[i].id).offset().top - MainObj.CanvasT) / MainObj.Scale;
        // console.log(left + ',' + top);
        var points = txtCanvas.canvasList.filter(function(x) {
            if (x.length && (x[0].id == note[i].id)) {
                return x;
            }
        });
        list = {
            page: MainObj.NowPage,
            id: note[i].id,
            type: 'txtCanvas',
            width: $(note[i]).css('width'),
            height: $(note[i]).css('height'),
            top: top + 'px',
            left: left + 'px',
            // points: txtCanvas.canvasList.points,
            points: points,
            StickyViewVisibility: FindStickyViewVisibility(note[i].id)
        }
        txtCanvas.SaveList.push(list);
    }
}

//如有文字便利貼註記，從txtCanvas.SaveList取得
function ReplyCanvas(page) {

    $('.txtCanvas').remove();
    $(txtCanvas.SaveList).each(function() {

        if (this != undefined) {
            if (this.page == page) {

                if ($('#' + this.id)[0] != undefined) {
                    $('#' + this.id).remove();
                }

                var ID = this.id;
                var note = this;

                var divBox = document.createElement('div');
                $('#HamastarWrapper').append(divBox);
                divBox.id = ID;
                $(divBox).attr('class', 'NoteBox');
                $(divBox).addClass('txtCanvas');
                
                var div = document.createElement('div');
                $(divBox).append(div);
                div.id = 'Div' + ID;
                $(div).draggable({
                    //如果有移動，則不觸發click事件
                    stop: function(event, ui) {
                        $(this).addClass('noclick');
                        FindBoundary(ui, div);
                        SaveCanvas();
                    }
                });

                NewCanvas();
                var canvas = $('#canvas')[0];
                $(div).append(canvas);
                var cxt = canvas.getContext('2d');
                canvas.id = 'txtCanvas' + ID;
                $(canvas).attr('class', 'noteCanvas');

                var Left = (Number(note.left.split('px')[0]) * MainObj.Scale) + MainObj.CanvasL;
                var Top = (Number(note.top.split('px')[0]) * MainObj.Scale) + MainObj.CanvasT;
                var img = new Image();
                img.onload = function() {
                    // canvas.width = Number(note.width.split('px')[0]);
                    // canvas.height = img.height;
                    canvas.width = img.width * 2 * MainObj.Scale;
                    canvas.height = img.height * MainObj.Scale;
                    // resizeCanvas(canvas, cxt);
                    cxt.drawImage(img, 0, 0, canvas.width, canvas.height);
                    $('#' + div.id).css({
                        'position': 'absolute',
                        'width': canvas.width,
                        'height': canvas.height,
                        'left': Left + 'px',
                        'top': Top + 'px'
                    })

                    txtCloseSetting(div, ID);
                    txtNarrowLayer(div, ID);
                    CanvasNarrowSmall(divBox, img, ID);

                    var canvasArea = txtCanvasArea(div, img, ID);
                    var cxtArea = canvasArea.getContext('2d');
                    // resizeCanvas(canvasArea, cxtArea);
                    // cxtArea.drawImage(note.canvas, 0, 0, canvasArea.width, canvasArea.height);

                    if (note.points != undefined) {
                        for (var i = 0; i < note.points.length; i++) {
                            if (note.points[i]) {
                                for (var p = 1; p < note.points[i].length; p++) {
                                    if (cxtArea.canvas.id == note.points[i][0].id) {
                                        cxtArea.lineWidth = 3;

                                        // var left = Number(Left.split('px')[0]);
                                        // var top = Number(Top.split('px')[0]);

                                        var x1 = note.points[i][p - 1].X * MainObj.Scale;
                                        var y1 = note.points[i][p - 1].Y * MainObj.Scale;
                                        var x2 = note.points[i][p].X * MainObj.Scale;
                                        var y2 = note.points[i][p].Y * MainObj.Scale;

                                        cxtArea.moveTo(x1, y1);
                                        cxtArea.lineTo(x2, y2);
                                        cxtArea.stroke();
                                    }
                                }
                            }
                        }
                    }

                    $(canvasArea).css({
                        'width': canvas.width,
                        'height': 190 * MainObj.Scale
                    })

                    $(canvasArea).attr('ScaleW', canvas.width / canvasArea.width);
                    $(canvasArea).attr('ScaleH', 190 * MainObj.Scale / canvasArea.height);

                    //canvasArea畫畫
                    $(canvasArea).on('mousedown', function() { txtCanvasDown(this, div) })
                    $(canvasArea).on('mousemove', function() { txtCanvasMove(this) });
                    $(canvasArea).on('mouseup', function() { txtCanvasUp(this, div) });
                    $(canvasArea).on('mouseout', function() { txtCanvasUp(this, div) });

                    $(canvasArea).on('touchstart', function() { txtCanvasDown(this, div) })
                    $(canvasArea).on('touchmove', function() { txtCanvasMove(this) });
                    $(canvasArea).on('touchend', function() { txtCanvasUp(this, div) });
                    // $(canvasArea).on('mouseout', function() { txtCanvasUp(this, div) });

                    $(canvasArea).resizable({
                        minHeight: canvas.height,
                        minWidth: canvas.width,
                        start: function() {
                            $(window).off("resize", resizeInit);
                        },
                        resize: function() {
                            var Width = Number(this.style.width.split('px')[0]);
                            canvas.width = Width;
                            cxt.drawImage(img, 0, 0, canvas.width, canvas.height);
                            $('#' + div.id).css('width', Width);
                        },
                        stop: function(event, ui) {
                            var NewWidth = ui.size.width;
                            var NewHeight = ui.size.height;

                            $(canvasArea).attr('ScaleW', NewWidth / canvasArea.width);
                            $(canvasArea).attr('ScaleH', NewHeight / canvasArea.height);

                            SaveCanvas();
                            $(window).resize(resizeInit);
                        }
                    });

                    if (note.StickyViewVisibility == 'true') {
                        $('#narrowDiv' + note.id).css('display', 'none');
                        $('#Div' + note.id).css('display', 'block');
                    } else {
                        $('#narrowDiv' + note.id).css({
                            'display': 'block',
                            'left': $('#Div' + note.id).css('left'),
                            'top': $('#Div' + note.id).css('top'),
                        });
                        $('#Div' + note.id).css('display', 'none');
                    }

                    SaveCanvas();

                }
                img.src = 'ToolBar/txtcanvas.png';
            }
        }

    })
}

function txtPosition(left, top, canvas) {
    var width = canvas.width * MainObj.Scale;
    var height = canvas.height * MainObj.Scale;
    if (left + width > $('#CanvasGallery')[0].width + $('#CanvasGallery')[0].offsetLeft) {
        left = $('#CanvasGallery')[0].width + $('#CanvasGallery')[0].offsetLeft - width;
    }

    if (top + height + (190 * MainObj.Scale) > $('#CanvasGallery')[0].height + $('#CanvasGallery')[0].offsetTop) {
        top = $('#CanvasGallery')[0].height + $('#CanvasGallery')[0].offsetTop - height - (190 * MainObj.Scale);
    }

    return [left, top];
}

function FindStickyViewVisibility(id) {
    if ($('#narrowDiv' + id).css('display') == 'none') {
        return 'true';
    } else {
        return 'false';
    }
}