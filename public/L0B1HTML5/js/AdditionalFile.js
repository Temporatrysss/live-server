//另開附件、全文朗讀





function AdditionalCanvasSet(obj, page) {
    // getPagePosition(page);
    var scale = MainObj.Scale;
    var Left = obj.Left * scale + MainObj.CanvasL;
    var Top = obj.Top * scale + MainObj.CanvasT;
    var Width = obj.Width * scale;
    var Height = obj.Height * scale;

    // Left = getNewLeft(Left);

    $('#canvas')[0].class = 'canvasObj';
    $('#canvas')[0].width = Width;
    $('#canvas')[0].height = Height;
    $('#canvas').css({ 'left': Left, 'top': Top });

    var canvas = $('#canvas')[0];
    var cxt = canvas.getContext('2d');
    resizeCanvas(canvas, cxt);

    var canvasID = obj.Identifier;
    canvas.id = canvasID;

    drawButtonImage(obj, cxt, Width, Height);

    AdditionalFileSet(obj, page);

}

function SequencePlayCanvas(obj, page) {
    var scale = MainObj.Scale;
    var Left = obj.Left * scale + MainObj.CanvasL;
    var Top = obj.Top * scale + MainObj.CanvasT;
    var Width = obj.Width * scale;
    var Height = obj.Height * scale;

    $('#canvas')[0].class = 'canvasObj';
    $('#canvas')[0].width = Width;
    $('#canvas')[0].height = Height;
    $('#canvas').css({ 'left': Left, 'top': Top });

    var canvas = $('#canvas')[0];
    var cxt = canvas.getContext('2d');
    resizeCanvas(canvas, cxt);

    var canvasID = 'Seq' + obj.Identifier + page;
    canvas.id = canvasID;

    drawButtonImage(obj, cxt, Width, Height);

    $('#' + canvasID).click(function() {
        NewSequenceAudio(obj.PlayItemsList.PlayItem, page);
    })
}

//另開附件判斷
function AdditionalFileSet(obj, page, panorama) {
    var type = obj.PathFileName.split('.')[1];
    // console.log(type);
    switch (type) {

        //插入音檔
        case 'mp3':
            $('#' + obj.Identifier).click(function() {
                NewAudio(obj, obj.PathFileName, page);
            })
            break;

        //另開PDF
        case 'pdf':
            $('#' + obj.Identifier).click(function() {
                window.open('Resource/' + obj.PathFileName);
            })
            break;
        //圖片定位
        case 'png':
        case 'PNG':
        case 'jpg':
        case 'JPG':
            $('#' + obj.Identifier).click(function() {
                if (!panorama) {
                    NewImagePosition(obj, page);
                } else {
                    PanoramaImagePosition(obj, page);
                }
            })
            break;

        //影片定位
        case 'mp4':
            $('#' + obj.Identifier).click(function() {
                NewVideoPosition(obj);
            })
            break;
    }

}

//插入音檔
function NewAudio(obj, audioSrc, page) {
    if ($('#Voice')[0] != undefined) {
        $('#Voice').remove();
    }

    $('<audio/>', {
        id: 'Voice',
        class: 'VoiceClass',
        src: 'Resource/' + audioSrc
    }).appendTo('#HamastarWrapper');

    BrushReset(page);
    SequenceBrush(obj);
    $('#Voice')[0].volume = 1;
    $('#Voice')[0].play();

    if ($('#Narration')[0]) {
        $('#Narration')[0].pause();
    }

    $("#Voice").on('ended', function() {
        BrushReset(page);
        // done playing
        $(this).remove();
        if (HamaList[page].PlayBackgroundMusic == '1') {
            BGMusicPlay();
        }
        if ($('#Narration')[0]) {
            $('#Narration')[0].play();
        }
    });

    // BGMusicPause();
}

//全文朗讀
function NewSequenceAudio(obj, page) {
    var HamaObj = HamaList[page].Objects;
    var SequenceSrc = [];
    var AudioNum = 0;

    //將全文朗讀src的順序存在SequenceSrc裡面
    if (obj.length == undefined) obj = [obj];
    for (var i = 0; i < obj.length; i++) {
        for (var x = 0; x < HamaObj.length; x++) {
            if (obj[i].Identifier == HamaObj[x].Identifier) {
                SequenceSrc[i] = {};
                SequenceSrc[i].PathFileName = HamaObj[x].PathFileName;
                SequenceSrc[i].Identifier = HamaObj[x].Identifier;
                if (HamaObj[x].PlayingStateShow == '1') {
                    SequenceSrc[i].Brush = HamaObj[x].Brush;
                }
            }
        }
    }

    if ($('#Voice')[0] != undefined) {
        $('#Voice').remove();
    }

    $('<audio/>', {
        id: 'Voice',
        class: 'VoiceClass',
        src: 'Resource/' + SequenceSrc[AudioNum].PathFileName
    }).appendTo('#HamastarWrapper');

    BrushReset(page);
    SequenceBrush(SequenceSrc[AudioNum]);
    $('#Voice')[0].volume = 1;
    $('#Voice')[0].play();

    $("#Voice").on('ended', function() {
        BrushReset(page);
        AudioNum++;
        if (AudioNum < SequenceSrc.length) {
            SequenceBrush(SequenceSrc[AudioNum]);
            $('#Voice')[0].src = 'Resource/' + SequenceSrc[AudioNum].PathFileName;
            $('#Voice')[0].volume = 1;
            $('#Voice')[0].play();
        } else {
            $(this).remove();
        }
    });
}

//全文朗讀色塊
function SequenceBrush(list) {
    if (list.PlayingStateShow == '1') {
        var canvas = $('#' + list.Identifier)[0];
        var cxt = canvas.getContext('2d');
        resizeCanvas(canvas, cxt);
        cxt.globalAlpha = 0.4;
        cxt.fillStyle = list.Brush;
        if (list.Brush != '#ffffff') {
            cxt.fillRect(0, 0, canvas.width, canvas.height); //填滿
        }
    }
}

//全文朗讀其他色塊變回透明
function BrushReset(page) {
    var obj = HamaList[page].Objects;
    var canvas, cxt;
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].PlayingStateShow == '1') {
            canvas = $('#' + obj[i].Identifier)[0];
            cxt = canvas.getContext('2d');
            resizeCanvas(canvas, cxt);
            cxt.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
}

//圖片定位
function NewImagePosition(obj, page) {
    if ($('#Locaton' + obj.Identifier)[0] == undefined) {

        AdditionalReset();
        getPagePosition(page);
        
        NewCanvas(obj);

        var scale = MainObj.Scale;
        var Left = obj.Position.X * scale + MainObj.CanvasL;
        var Top = obj.Position.Y * scale + MainObj.CanvasT;
        var Width = obj.Position.W * scale;
        var Height = obj.Position.H * scale;

        Left = getNewLeft(Left);

        var img = new Image();
        img.onload = function() {

            //另開圖片附件，開在正中間
            if (obj.Position.X == undefined) {
                Width = img.width * MainObj.Scale;
                Height = img.height * MainObj.Scale;
                Left = ($('#HamastarWrapper').width() - Width) / 2;
                Top = ($('#HamastarWrapper').height() - Height) / 2;
            }

            var canvas = $('#canvas')[0];
            canvas.id = 'Locaton' + obj.Identifier;
            canvas.width = Width;
            canvas.height = Height;
            $('#' + canvas.id).attr('class', 'canvasPosition');
            $('#' + canvas.id).css({ 'left': Left, 'top': Top });
            var cxt = canvas.getContext('2d');
            resizeCanvas(canvas, cxt);

            cxt.drawImage(img, 0, 0, Width, Height);

            //background frame
            if (obj.Background == 'true') {
                DrawFrame(canvas, obj, Width, Height);
            }

            //音檔
            if (obj.AudioPathFileName != "") {
                NewAudio(obj, obj.AudioPathFileName, page);
            }

            $('#' + canvas.id).click( function() {
                AdditionalReset(canvas.id);

                BGMusicPlay();

                var message = page + ',' + obj.Identifier + ',CLOSE';
                rmcallBookSyncMessage(message);


            });

            var message = page + ',' + obj.Identifier + ',TAP';
            rmcallBookSyncMessage(message);
        }
        img.src = 'Resource/' + obj.PathFileName;
    } else {
        $('#Locaton' + obj.Identifier).remove();

        BGMusicPlay();

        var message = page + ',' + obj.Identifier + ',CLOSE';
        rmcallBookSyncMessage(message);
    }
}

//影片定位
function NewVideoPosition(obj) {
    if ($('#Video' + obj.Identifier)[0] == undefined) {
        AdditionalReset();
        var scale = MainObj.Scale;
        var Left = obj.Left * scale + MainObj.CanvasL;
        var Top = obj.Top * scale + MainObj.CanvasT;
        var Width = obj.Width * scale;
        var Height = obj.Height * scale;
        var ID;

        var Video = document.createElement('video');
        Video.id = 'Video' + obj.Identifier;
        Video.width = Width;
        Video.height = Height;
        $('body').append(Video);

        $('#' + Video.id).attr('class', 'videoPosition');
        $('#' + Video.id).css({
            'position': 'absolute',
            'left': Left,
            'top': Top
        })

        //background frame
        //如果有frame要新建一個canvas重疊在影片上面，因此會擋到影片
        //所以要將影片click事件綁在canvas上，不然會點不到影片
        if (obj.Background == 'true') {
            var canvas = document.createElement('canvas');
            canvas.id = 'frame' + Video.id;
            canvas.width = Width;
            canvas.height = Height;
            $('body').append(canvas);
            $('#' + canvas.id).attr('class', 'videoPosition');
            $('#' + canvas.id).css({
                'position': 'absolute',
                'left': Left,
                'top': Top
            })
            DrawFrame(canvas, obj, Width, Height);

            ID = canvas.id;
        } else {
            ID = Video.id;
        }

        Video.src = 'Resource/' + obj.PathFileName;
        Video.play();
        $('#' + ID).click(function() {
            if (Video.paused) {
                Video.play();
            } else {
                Video.pause();
            }
        });

        //是否結束後淡出
        if (obj.Fadeout == '1') {
            $('#' + Video.id).on('ended', function() {
                // done playing
                $(this).fadeOut(400, function() {
                    $('.videoPosition').remove();
                })
            });
        }

        //同步影片定位
        var message = MainObj.NowPage + ',' + obj.Identifier + ',TAP';
        rmcallBookSyncMessage(message);

        message = MainObj.NowPage + ',' + Video.id + ',START';
        rmcallBookSyncMessage(message);

        SyncVideoSet(Video.id);
    }
}

//畫background frame(黑框)
function DrawFrame(canvas, obj, width, height) {
    var cxt = canvas.getContext('2d');
    resizeCanvas(canvas, cxt);
    var PixelSize = obj.PixelSize * 2;
    width = width - PixelSize;
    height = height - PixelSize;

    borderstyle(canvas.id, obj.BorderStyle, '#000000', obj.PixelSize);
    cxt.strokeRect(obj.PixelSize, obj.PixelSize, width, height);
}

//圖影定位物件初始化
function AdditionalReset(canvasID) {

    //如果為多張並存，則不用remove掉
    //只需remove掉自己
    getPage();
    if (Quiz.Page >= 0 && Quiz.Page < HamaList.length) {
        var obj = HamaList[Quiz.Page].Objects;
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].SingleSelect == '1') {
                $('#Locaton' + obj[i].Identifier).remove();
                if (obj[i].AudioPathFileName != "") {
                    $('#Voice').remove();
                }
            }
        }
        $('#' + canvasID).remove();

        $('.videoPosition').remove();
    }
}