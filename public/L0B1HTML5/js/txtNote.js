//文字便利貼

var txtNote = {
    SaveList: []
};




function txtNoteLayer() {

    var ID = newguid();

    var divBox = document.createElement('div');
    $('#HamastarWrapper').append(divBox);
    divBox.id = ID;
    $(divBox).attr('class', 'NoteBox');

    if (ToolBarList.AddWidgetState == 'IRStxtnote') {
        $(divBox).addClass('IRSnote');
    }
    
    var div = document.createElement('div');
    $(divBox).append(div);
    div.id = 'Div' + ID;
    $(div).draggable({
        //如果有移動，則不觸發click事件
        stop: function(event, ui) {
            $(this).addClass('noclick');
            FindBoundary(ui, div);

            SaveNote();

            var syncXML = toSyncXML();
            var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
            rmcall(message);

        }
    });

    NewCanvas();
    var canvas = $('#canvas')[0];
    $(div).append(canvas);
    var cxt = canvas.getContext('2d');
    canvas.id = 'txtNote' + ID;
    $(canvas).attr('class', 'noteCanvas');

    // var Left = event.clientX;
    // var Top = event.clientY;
    // alert(event.type);
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

        NoteNarrowSmall(divBox, img, ID);

        //文字框
        var textArea = document.createElement('textarea');
        textArea.id = ID;
        $(textArea).attr('class', 'textArea');
        $(div).append(textArea);
        $(textArea).css({
            'position': 'absolute',
            'top': canvas.height,
            'background-color': 'rgb(253, 253, 200)',
            'width': canvas.width - 5,
            'height': 190 * MainObj.Scale
        })
        

        //文字框綁縮放大小時的事件
        $(textArea).on('mousedown', function() {
            $(textArea).on('mouseup', function() {
                textAreaSetting(textArea, canvas, div, img);
                SaveNote();

                var syncXML = toSyncXML();
                var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
                rmcall(message);

            })
        });

        $(textArea).on('keyup', function() {
            SaveNote();

            var syncXML = toSyncXML();
            var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
            rmcall(message);
        });

        $(textArea).click(function(e) {
            e.target.focus();
        })

        SaveNote();

        var syncXML = toSyncXML();
        var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
        rmcall(message);

    }
    img.src = 'ToolBar/txtbgbtn.png';
}



//關閉按鈕設置
function txtCloseSetting(div, id) {

    //關閉
    var closeBtn = document.createElement('div');
    closeBtn.id = 'closeBtn';
    $(div).append(closeBtn);
    var closeImg = new Image();
    $(closeBtn).append(closeImg);
    closeImg.onload = function() {
        closeImg.width = 36 * MainObj.Scale;
        closeImg.height = 36 * MainObj.Scale;
    }
    closeImg.src = 'ToolBar/txtclose.png';

    $(closeBtn).click(function(event) {
        confirmShow('是否確定刪除物件?', function(res) {
            if (res) {
                $('#' + id).remove();
    
                for (var note = 0; note < txtNote.SaveList.length; note++) {
                    //刪掉canvas之外，還要把原本有記錄到txtNote.SaveList的文字便利貼刪掉
                    if (txtNote.SaveList[note] != undefined) {
                        if (txtNote.SaveList[note].id == id) {
                            delete txtNote.SaveList[note];
                        }
                    }
                }
    
                for (var can = 0; can < txtCanvas.SaveList.length; can++) {
                    //刪掉canvas之外，還要把原本有記錄到txtCanvas.SaveList的便利貼刪掉
                    if (txtCanvas.SaveList[can] != undefined) {
                        if (txtCanvas.SaveList[can].id == id) {
                            delete txtCanvas.SaveList[can];
                            for (var i = 0; i < txtCanvas.canvasList.length; i++) {
                                if (txtCanvas.canvasList[i]) {
                                    if (txtCanvas.canvasList[i][0].id == id) {
                                        delete txtCanvas.canvasList[i];
                                    }
                                }
                            }
                        }
                    }
                }
    
                SaveCanvas();
                SaveNote();
    
                var syncXML = toSyncXML();
                var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
                rmcall(message);
            }
        })
    });
}

//縮小按鈕設置
function txtNarrowLayer(div, id) {
    //縮小
    var narrowBtn = document.createElement('div');
    narrowBtn.id = 'narrowBtn';
    $(div).append(narrowBtn);
    var narrowImg = new Image();
    $(narrowBtn).append(narrowImg);
    narrowImg.onload = function() {
        narrowImg.width = 36 * MainObj.Scale;
        narrowImg.height = 36 * MainObj.Scale;
        $(narrowBtn).css('right', narrowImg.width);
    }
    narrowImg.src = 'ToolBar/txtnarrow.png';

    txtNarrowSetting(narrowBtn, id);
}

//文字便利貼小圖設置
function NoteNarrowSmall(div, img, id) {
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
    smallImg.src = 'ToolBar/btnTextbox2.png';
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
            var width = 50;
            var height = 50;

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

            SaveNote();

            var syncXML = toSyncXML();
            var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
            rmcall(message);
        }
    });
}

//縮小點擊事件
function txtNarrowSetting(btn, id) {
    $(btn).click(function(event) {
        if ($('#narrowDiv' + id).hasClass('noclick')) {
            $('#narrowDiv' + id).removeClass('noclick');
        } else {
            if ($('#narrowDiv' + id).css('display') == 'none') {
                $('#narrowDiv' + id).css({
                    'display': 'block',
                    'left': $('#Div' + id).css('left'),
                    'top': $('#Div' + id).css('top'),
                });
                $('#Div' + id).css('display', 'none');

            } else {
                $('#narrowDiv' + id).css('display', 'none');
                $('#Div' + id).css({
                    'display': 'block',
                    'left': $('#narrowDiv' + id).css('left'),
                    'top': $('#narrowDiv' + id).css('top'),
                });
            }
        }
        SaveNote();
        SaveCanvas();

        var syncXML = toSyncXML();
        var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
        rmcall(message);

    });
}

//文字框縮放
function textAreaSetting(textArea, canvas, div, img) {
    var cxt = canvas.getContext('2d');
    var Width = Number($(textArea).css('width').split('px')[0]);
    canvas.width = Width + 5;
    cxt.drawImage(img, 0, 0, canvas.width, canvas.height);
    $('#' + div.id).css('width', Width);
    // resizeCanvas(canvas, cxt);
}

//初始化
function txtNoteReset() {
    $('.NoteBox').remove();
}

//儲存note的資訊於txtNote.SaveList
function SaveNote() {

    if (ToolBarList.AddWidgetState == 'IRStxtnote') return;

    var list = {};
    var note = $('.textArea');

    if (txtNote.SaveList.length > 0) {
        for (var x = 0; x < txtNote.SaveList.length; x++) {
            if (txtNote.SaveList[x] != undefined) {
                if (txtNote.SaveList[x].page == MainObj.NowPage) {
                    delete txtNote.SaveList[x];
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
        list = {
            page: MainObj.NowPage,
            id: note[i].id,
            type: 'txtNote',
            width: $(note[i]).css('width'),
            height: $(note[i]).css('height'),
            top: top + 'px',
            left: left + 'px',
            value: note[i].value,
            StickyViewVisibility: FindStickyViewVisibility(note[i].id)
        }
            
        txtNote.SaveList.push(list);
    }

    
}

//如有文字便利貼註記，從txtNote.SaveList取得
function ReplyNote(page) {

    $('.txtNote').remove();

    $(txtNote.SaveList).each(function() {

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
                $(divBox).addClass('txtNote');
                
                var div = document.createElement('div');
                $(divBox).append(div);
                div.id = 'Div' + ID;
                $(div).draggable({
                    //如果有移動，則不觸發click事件
                    stop: function(event, ui) {
                        $(this).addClass('noclick');
                        FindBoundary(ui, div);
                        SaveNote();
                    }
                });

                NewCanvas();
                var canvas = $('#canvas')[0];
                $(div).append(canvas);
                var cxt = canvas.getContext('2d');
                canvas.id = 'txtNote' + ID;
                $(canvas).attr('class', 'noteCanvas');

                var Left = (Number(note.left.split('px')[0]) * MainObj.Scale) + MainObj.CanvasL;
                var Top = (Number(note.top.split('px')[0]) * MainObj.Scale) + MainObj.CanvasT;
                var img = new Image();
                img.onload = function() {
                    // canvas.width = Number(note.width.split('px')[0]) + 5;
                    // canvas.height = img.height;
                    canvas.width = img.width * 2 * MainObj.Scale;
                    canvas.height = img.height * MainObj.Scale;
                    // resizeCanvas(canvas, cxt);
                    cxt.drawImage(img, 0, 0, canvas.width, canvas.height);
                    $('#' + div.id).css({
                        'position': 'absolute',
                        'width': canvas.width,
                        'height': canvas.height,
                        'left': Left,
                        'top': Top
                    })

                    
                    txtCloseSetting(div, ID);
                    txtNarrowLayer(div, ID);
                    NoteNarrowSmall(divBox, img, ID);

                    //文字框
                    var textArea = document.createElement('textarea');
                    textArea.id = ID;
                    $(textArea).attr('class', 'textArea');
                    $(div).append(textArea);
                    $(textArea).css({
                        'position': 'absolute',
                        'top': canvas.height,
                        'background-color': 'rgb(253, 253, 200)',
                        'width': 315 * MainObj.Scale,
                        'height': 190 * MainObj.Scale
                    })

                    $(textArea)[0].value = note.value;

                    //文字框綁縮放大小時的事件
                    $(textArea).on('mousedown', function() {
                        $('body').on('mousemove', function() {
                            textAreaSetting(textArea, canvas, div, img);
                            SaveNote();
                        })
                    });

                    $(textArea).click(function(e) {
                        e.target.focus();
                    })

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

                    SaveNote();

                    
                }
                img.src = 'ToolBar/txtbgbtn.png';

            }
        }
    })
}

//由於文字便利貼及便利貼不能拖移超過書，因此要取得邊界位置
//若拖移超過邊界，則移動至最邊邊
function FindBoundary(obj, div) {
    var left = obj.offset.left;
    var top = obj.offset.top;
    var width = Number($(div).css('width').split('px')[0]) + 10;
    var height = Number($(div).css('height').split('px')[0]) + Number($($(div)[0].childNodes[3]).css('height').split('px')[0]) + 10;

    var canvasW = $('#CanvasGallery')[0].width + MainObj.CanvasL;
    var canvasH = $('#CanvasGallery')[0].height + MainObj.CanvasT;

    if (left < MainObj.CanvasL) {
        $(div).css('left', MainObj.CanvasL);
    } else if (left + width > canvasW) {
        $(div).css('left', canvasW - width);
    } else if (top < MainObj.CanvasT) {
        $(div).css('top', MainObj.CanvasT);
    } else if (top + height > canvasH) {
        $(div).css('top', canvasH - height);
    }
}