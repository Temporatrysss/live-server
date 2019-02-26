//輔助視窗滑鼠事件

var Intro = {
    MouseDown: { X: 0, Y: 0 },
    MouseMove: { X: 0, Y: 0 },
    Displacement: { X: 0, Y: 0 },
    Drag: false,
    SyncMove: { Left: 0, Top: 0 }
}




function IntroductionDown(event) {

    event.preventDefault();

    // Intro.MouseDown.X = event.clientX - $('#CanvasGallery').offset().left;
    // Intro.MouseDown.Y = event.clientY - $('#CanvasGallery').offset().top;
    Intro.MouseDown.X = event.type == 'touchstart' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
    Intro.MouseDown.Y = event.type == 'touchstart' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

    Intro.MouseDown.X = Intro.MouseDown.X - $('#CanvasGallery').offset().left;
    Intro.MouseDown.Y = Intro.MouseDown.Y - $('#CanvasGallery').offset().top;

    Intro.Drag = true;

    // console.log(Intro.MouseDown);

    this.addEventListener( 'mousemove', IntroductionMove, false );
    this.addEventListener( 'mouseup', IntroductionUp, false );
    // this.addEventListener( 'mouseout', IntroductionUp, false );

    this.addEventListener( 'touchmove', IntroductionMove, false );
    this.addEventListener( 'touchend', IntroductionUp, false );
    // this.addEventListener( 'touchcancel', IntroductionUp, false );
}

function IntroductionMove(event) {

    event.preventDefault();

    // Intro.MouseMove.X = event.clientX - $('#CanvasGallery').offset().left;
    // Intro.MouseMove.Y = event.clientY - $('#CanvasGallery').offset().top;
    Intro.MouseMove.X = event.type == 'touchmove' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
    Intro.MouseMove.Y = event.type == 'touchmove' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

    Intro.MouseMove.X = Intro.MouseMove.X - $('#CanvasGallery').offset().left;
    Intro.MouseMove.Y = Intro.MouseMove.Y - $('#CanvasGallery').offset().top;

    if (Intro.Drag) {
        IntroObjsMove(this);
    }
}

function IntroductionUp(event) {

    event.preventDefault();

    Intro.Drag = false;
}

function IntroObjsMove(canvas) {
    var X = Intro.MouseMove.X - Intro.MouseDown.X;
    var Y = Intro.MouseMove.Y - Intro.MouseDown.Y;

    //取得移動的視窗
    for (var x = 0; x < $('.IntroDiv').length; x++) {
        if ($('.IntroDiv')[x].firstChild == canvas) {
            var obj = $('.IntroDiv')[x];
        }
    }

    //直接移動div
    $(obj).css({
        'position': 'absolute',
        'left': Number($(obj)[0].offsetLeft) + X,
        'top': Number($(obj)[0].offsetTop) + Y
    })

    Intro.MouseDown.X = Intro.MouseMove.X;
    Intro.MouseDown.Y = Intro.MouseMove.Y;

    //同步輔助視窗位置
    var id = canvas.id.split('Introduction')[1];
    var syncleft = ($(obj).offset().left + Number($(canvas).css('left').split('px')[0])) / 1000 / MainObj.Scale;
    var synctop = ($(obj).offset().top + Number($(canvas).css('top').split('px')[0])) / 1000 / MainObj.Scale;

    var message = MainObj.NowPage + ',' + id + ',MOVETO:' + syncleft + ';' + synctop;
    rmcallBookSyncMessage(message);
}