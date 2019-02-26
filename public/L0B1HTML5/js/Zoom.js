//縮放

var syncZoomSlider = {};




//放大
function zoomIn() {

    GalleryStopMove();
    $(window).off("resize", resizeInit);

    $('#canvas').remove();

    ZoomAttrPosition();

    //在APP時放大是用滑鼠滾輪，一次增加0.1，而最大一樣是3
    if (!rmcallBookSyncMessage('')) {
        for (i = 0; i < ToolBarList.ZoomNumber.length; i++) {
            if (ToolBarList.ZoomScale == ToolBarList.ZoomNumber[i]) {
                ToolBarList.ZoomScale = ToolBarList.ZoomNumber[i + 1];
                break;
            }
        }
    } else {
        ToolBarList.ZoomScale = ToolBarList.ZoomScale + 0.05;
        if (ToolBarList.ZoomScale > 3) ToolBarList.ZoomScale = 3;
    }

    var scale = ToolBarList.ZoomScale;
    console.log('Scale: ' + scale);

    zoomSetting(scale);

    var zoomInBtn = checkBtnStatus('zoomIn');
    var zoomOutBtn = checkBtnStatus('zoomOut');

    zoomOutBtn.afterClick = false;
    checkBtnChange(zoomOutBtn);

    if (ToolBarList.ZoomScale == 3) {
        zoomInBtn.afterClick = true;
        checkBtnChange(zoomInBtn);
    }

    SendSyncZoom(scale);

}

//縮小
function zoomOut(zoom100) {

    GalleryStopMove();
    $(window).off("resize", resizeInit);

    $('#canvas').remove();

    //縮放前，先加最原始的left及top至html5上，縮放時物件的位置才不會跑掉
    if (ToolBarList.ZoomScale == 1) {
        if ($('.canvasObj')[0] != undefined) {
            for (var j = 0; j < $('.canvasObj').length; j++) {

                $($('.canvasObj')[j]).attr({
                    'left': $('.canvasObj')[j].offsetLeft,
                    'top': $('.canvasObj')[j].offsetTop
                })
            }
        }
    }

    //在APP時縮小是用滑鼠滾輪，一次減少0.1，而最小一樣是1
    if (!rmcallBookSyncMessage('')) {
        for (i = 0; i < ToolBarList.ZoomNumber.length; i++) {
            if (ToolBarList.ZoomScale == ToolBarList.ZoomNumber[i]) {
                ToolBarList.ZoomScale = ToolBarList.ZoomNumber[i - 1];
                break;
            }
        }
    } else {
        ToolBarList.ZoomScale = ToolBarList.ZoomScale - 0.05;
        if (ToolBarList.ZoomScale < 1) ToolBarList.ZoomScale = 1;
    }

    if (zoom100) {
        ToolBarList.ZoomScale = 1;
    }

    var scale = ToolBarList.ZoomScale;
    console.log('Scale: ' + scale);

    zoomSetting(scale);    

    var zoomInBtn = checkBtnStatus('zoomIn');
    zoomInBtn.afterClick = false;
    checkBtnChange(zoomInBtn);

    if (ToolBarList.ZoomScale == 1) {
        $('#canvas').remove();

        //回復resize
        $(window).resize(resizeInit);

        //如果有搜內文的手指，則記錄到Text裡
        //不然縮小到100%時會重畫書，手指會不見
        if ($('.Text')[0] != undefined) {
            var Text = $('.Text')[0];
        }

        GalleryStartMove();
        resize_canvas();
        drawCanvas(MainObj.NowPage);
        setWaterMark();

        //如果原本有有搜內文的手指，在這裡在append出來
        if (Text != undefined) {
            $('body').append(Text);
            $(Text).css({
                'left': Number($(Text).css('left').split('px')[0]) + MainObj.CanvasL,
                'top': Number($(Text).css('top').split('px')[0]) + MainObj.CanvasT
            })
        }

        var zoomOutBtn = checkBtnStatus('zoomOut');
        zoomOutBtn.afterClick = true;
        checkBtnChange(zoomOutBtn);
    }

    SendSyncZoom(scale);
    
    if (ToolBarList.ZoomScale == 1) {
        DrawPen(MainObj.NowPage);
    }
}

//縮放第一次，物件新增初始位置尺寸屬性
function ZoomAttrPosition() {
    //縮放前，先加最原始的left及top至html5上，縮放時物件的位置才不會跑掉
    if (ToolBarList.ZoomScale == 1) {
        if ($('.canvasObj')[0] != undefined) {
            for (var j = 0; j < $('.canvasObj').length; j++) {

                if ($('.canvasObj')[j].type == 'text') {

                    $($('.canvasObj')[j]).attr({
                        'width': $($('.canvasObj')[j]).css('width').split('px')[0],
                        'height': $($('.canvasObj')[j]).css('height').split('px')[0]
                    })
                }

                $($('.canvasObj')[j]).attr({
                    'left': $('.canvasObj')[j].offsetLeft,
                    'top': $('.canvasObj')[j].offsetTop
                })
            }
        }

        //影片要將初始位置及初始尺寸都記錄下來
        if ($('video')[0] != undefined) {
            for (var i = 0; i < $('.video').length; i++) {
                $($('.video')[i]).attr({
                    'left': $('.video')[i].offsetLeft,
                    'top': $('.video')[i].offsetTop,
                    'oldwidth': $('.video')[i].width,
                    'oldheight': $('.video')[i].height
                })
            }
        }
    }
}

//背景canvas的縮放
//是用最原本的大小及位置去做縮放
//而是縮放CSS的部分，這樣就不用一直重畫圖
//縮放後一律將位置移到(0,0)
function zoomSetting(scale) {

    var canvas = $('#CanvasLeft')[0];

    // $(canvas).css({
        // 'width': canvas.width * scale,
        // 'height': canvas.height * scale,
    //     'left': MainObj.CanvasL,
    //     'top': MainObj.CanvasT
    // })

    var cxt = canvas.getContext('2d');

    canvas.width = MainObj.NewCanvasWidth * scale;
    canvas.height = MainObj.NewCanvasHeight * scale;

    $(canvas).removeAttr('style');

    $(canvas).css({
        // 'width': canvas.width * scale,
        // 'height': canvas.height * scale,
        'left': MainObj.CanvasL,
        'top': MainObj.CanvasT,
        'position': 'absolute'
    })

    var img = MainObj.AllBackground[MainObj.NowPage].img;
    cxt.drawImage(img, 0, 0, canvas.width, canvas.height);

    twoPageZoomSet(scale);
    zoomDragCanvas(scale);
    zoomObjSetting(scale);

    // resizeCanvas(canvas, cxt);
}

//物件canvas的縮放
function zoomObjSetting(scale) {
    //物件跟背景是一樣的縮放模式
    if ($('.canvasObj')[0] != undefined) {

        for (var num = 0; num < $('.canvasObj').length; num++) {

            var left = (Number($($('.canvasObj')[num]).attr('left')) - MainObj.CanvasL) * scale + MainObj.CanvasL;
            var top = (Number($($('.canvasObj')[num]).attr('top')) - MainObj.CanvasT) * scale;

            if ($('.canvasObj')[num] == $('.Text')[0]) {

                $($('.canvasObj')[num]).css({
                    'width': 23 * scale,
                    'height': 23 * scale,
                    'left': left,
                    'top': top
                })
            } else {

                if ($('.canvasObj')[num].type == 'text') {

                    $($('.canvasObj')[num]).css({
                        'width': $($('.canvasObj')[num]).attr('width') * scale,
                        'height': $($('.canvasObj')[num]).attr('height') * scale,
                        'left': left,
                        'top': top
                    })

                } else {

                    $($('.canvasObj')[num]).css({
                        'width': $('.canvasObj')[num].width * scale,
                        'height': $('.canvasObj')[num].height * scale,
                        'left': left,
                        'top': top
                    })

                }
            }
        }
    }

    //影片縮放
    if ($('.video')[0] != undefined) {
        for(var i = 0; i < $('.video').length; i++) {

            var left = (Number($($('.video')[i]).attr('left')) - MainObj.CanvasL) * scale + MainObj.CanvasL;
            var top = (Number($($('.video')[i]).attr('top')) - MainObj.CanvasT) * scale + MainObj.CanvasT;

            $($('.video')[i]).css({
                'left': left,
                'top': top
            })

            var width = Number($($('.video')[i]).attr('oldwidth')) * scale;
            var height = Number($($('.video')[i]).attr('oldheight')) * scale;

            $('.video')[i].width = width;
            $('.video')[i].height = height;
        }
    }
    
    // 連連看的線縮放
    if ($('.canvasConnector')[0] != undefined) {

        for (var num = 0; num < $('.canvasConnector').length; num++) {

            var left = (Number($($('.canvasConnector')[num]).attr('left')) - MainObj.CanvasL) * scale + MainObj.CanvasL;
            var top = (Number($($('.canvasConnector')[num]).attr('top')) - MainObj.CanvasT) * scale + MainObj.CanvasT;

            $($('.canvasConnector')[num]).css({
                'width': $('.canvasConnector')[num].width * scale,
                'height': $('.canvasConnector')[num].height * scale,
                'left': left,
                'top': top
            })
        }
    }
}

//縮放drag
function zoomDragCanvas(scale) {
    //用一個新的canvas覆蓋在版面上面
    //是為了不讓其他功能觸發
    NewCanvas();
    $('#canvas')[0].width = ($('#CanvasRight')[0].width + $('#CanvasLeft')[0].width);
    $('#canvas')[0].height = $('#CanvasLeft')[0].height;

    if (!MainObj.IsRight) {
        var left = Number($('#CanvasRight').css('left').split('px')[0]);
    } else {
        var left = Number($('#CanvasLeft').css('left').split('px')[0]);
    }

    $('#canvas').css({
        'left': left,
        'top': Number($('#CanvasLeft').css('top').split('px')[0])
    })
    $('#canvas').attr('class', 'dragCanvas');

    //將draggable事件綁在蓋在上面的canvas
    //移動的過程中底下的背景及物件也一起移動
    $('#canvas').draggable({
        drag: function() {
            ZoomDragScroll();
        },
        stop: function() {
            //拖動結束，傳送同步指令
            SendSyncZoom(scale);
        }
    })
}

//拖動平移
//所有物件、背景
function ZoomDragScroll() {

    var dragOffsetLeft = $('.dragCanvas')[0].offsetLeft;
    var dragOffsetTop = $('.dragCanvas')[0].offsetTop;

    // if (MainObj.IsTwoPage) {
    //     if ($('.canvasObj')[x] != undefined) {
    //         if ($('.canvasObj')[x].offsetLeft < ($('.dragCanvas')[0].width / 2)) {
    //             var left = dragOffsetLeft - $('#CanvasLeft')[0].offsetLeft;
    //         } else {
    //             var left = dragOffsetLeft - $('#CanvasRight')[0].offsetLeft;
    //         }
    //     }
    // } else {
    //     var left = dragOffsetLeft - $('#CanvasLeft')[0].offsetLeft;
    // }

    var left = dragOffsetLeft - $('#CanvasLeft')[0].offsetLeft;
    var top = dragOffsetTop - $('#CanvasLeft')[0].offsetTop;

    //物件平移
    for (var x = 0; x < $('.canvasObj').length; x++) {
        if (MainObj.IsTwoPage) {
            if (Number($($('.canvasObj')[x]).attr('left')) < ($('.dragCanvas')[0].width / 2)) {
                left = dragOffsetLeft - $('#CanvasRight')[0].offsetLeft;
            }
        }
        $($('.canvasObj')[x]).css({
            'left': $('.canvasObj')[x].offsetLeft + left,
            'top': $('.canvasObj')[x].offsetTop + top
        })
    }

    //影片平移
    for (var i = 0; i < $('.video').length; i++) {
        $($('.video')[i]).css({
            'left': $('.video')[i].offsetLeft + left,
            'top': $('.video')[i].offsetTop + top
        })
    }

    //雙頁模式時，縮放後的拖拉是兩個canvas一起移動
    if (!MainObj.IsTwoPage) {
        $('#CanvasLeft').css({
            'left': dragOffsetLeft,
            'top': dragOffsetTop
        })
    } else {
        if (!MainObj.IsRight) {

            $('#CanvasRight').css({
                'left': dragOffsetLeft,
                'top': dragOffsetTop
            })

            var canvaswidth = Number($('#CanvasRight').css('width').split('px')[0]);

            $('#CanvasLeft').css({
                'left': dragOffsetLeft + canvaswidth,
                'top': dragOffsetTop
            })

        } else {

            $('#CanvasLeft').css({
                'left': dragOffsetLeft,
                'top': dragOffsetTop
            })

            var canvaswidth = Number($('#CanvasLeft').css('width').split('px')[0]);

            $('#CanvasRight').css({
                'left': dragOffsetLeft + canvaswidth,
                'top': dragOffsetTop
            })
        }
    }
}

//雙頁模式時的縮放
//雙頁變成兩個canvas，因此要另外從這設定
function twoPageZoomSet(scale) {
    
    if (MainObj.IsTwoPage) {

        if (MainObj.NowPage > 0) {
            $('#CanvasRight')[0].width = MainObj.NewCanvasWidth * scale;
            $('#CanvasRight')[0].height = MainObj.NewCanvasHeight * scale;
            var canvas = $('#CanvasRight')[0];
            var cxt = $('#CanvasRight')[0].getContext('2d');
            // resizeCanvas(canvas, cxt);
            var img = MainObj.AllBackground[MainObj.NowPage - 1].img;
            cxt.drawImage(img, 0, 0, $('#CanvasRight')[0].width, $('#CanvasRight')[0].height);
            $(canvas).removeAttr('style');
            $(canvas).css({
                'left': 0,
                'top': 0,
                'position': 'absolute'
            })
        }

        if (!MainObj.IsRight) {

            $('#CanvasRight').css({
                // 'width': $('#CanvasRight')[0].width * scale,
                // 'height': $('#CanvasRight')[0].height * scale,
                'left': 0,
                'top': 0
            })

            $('#CanvasLeft').css({
                // 'width': $('#CanvasRight')[0].width * scale,
                // 'height': $('#CanvasRight')[0].height * scale,
                'left': Number($('#CanvasRight').css('width').split('px')[0]),
                'top': 0
            })

        } else {

            $('#CanvasLeft').css({
                // 'width': $('#CanvasRight')[0].width * scale,
                // 'height': $('#CanvasRight')[0].height * scale,
                'left': 0,
                'top': 0
            })

            $('#CanvasRight').css({
                // 'width': $('#CanvasRight')[0].width * scale,
                // 'height': $('#CanvasRight')[0].height * scale,
                'left': Number($('#CanvasLeft').css('width').split('px')[0]),
                'top': 0
            })
        }
    }
}

//同步縮放平移(傳送)
function SendSyncZoom(scale) {
    //寬跟高一樣算法
    //( 書的寬(高) * 放大的值 / 2 - 書的一半 / 2 - 位移值 ) / 書的寬(高)
    var slideLeft, slideTop;

    if ($('.dragCanvas')[0] != undefined) {
        var sliderOffset = $('.dragCanvas').offset();

        var bookWidth = MainObj.NewCanvasWidth; //書寬
        var bookHeight = MainObj.NewCanvasHeight; //書高

        if (syncZoomSlider.afterSliderLeft == undefined && syncZoomSlider.afterSliderTop == undefined) {

            //如果沒有位移過，都是用放大後的位置減去初始位置
            syncZoomSlider.initSliderLeft = sliderOffset.left;
            syncZoomSlider.initSliderTop = sliderOffset.top;

            slideLeft = (bookWidth * scale / 2 - bookWidth / 2 - (sliderOffset.left - syncZoomSlider.initSliderLeft)) / bookWidth;
            slideTop = (bookHeight * scale / 2 - bookHeight / 2 - (sliderOffset.top - syncZoomSlider.initSliderTop)) / bookHeight;

            //位移後要把值塞給全域變數，不然位置會跑掉
            syncZoomSlider.afterSliderLeft = sliderOffset.left - syncZoomSlider.initSliderLeft;
            syncZoomSlider.afterSliderTop = sliderOffset.top - syncZoomSlider.initSliderTop;
        
        } else {

            //位移後
            syncZoomSlider.afterSliderLeft = sliderOffset.left - syncZoomSlider.initSliderLeft;
            syncZoomSlider.afterSliderTop = sliderOffset.top - syncZoomSlider.initSliderTop;

            slideLeft = (bookWidth * scale / 2 - bookWidth / 2 - syncZoomSlider.afterSliderLeft) / bookWidth;
            slideTop = (bookHeight * scale / 2 - bookHeight / 2 - syncZoomSlider.afterSliderTop) / bookHeight;

            //放大後要把初始值改成位移後又放大的值
            syncZoomSlider.initSliderLeft = sliderOffset.left - syncZoomSlider.afterSliderLeft;
            syncZoomSlider.initSliderTop = sliderOffset.top - syncZoomSlider.afterSliderTop;

        }

    } else {

        //scale = 1時初始化
        slideLeft = 0;
        slideTop = 0;
    }
    Html5WirteLog('sliderOffset: ' + sliderOffset.left + ', ' + sliderOffset.top);
    Html5WirteLog(JSON.stringify(syncZoomSlider));
    Html5WirteLog('slide: ' + slideLeft + ', ' + slideTop);
    if (sliderOffset.left == 0 && sliderOffset.top == 0) {
        slideLeft = 0;
        slideTop = 0;
    }

    var message = '[scmd]' + Base64.encode('scsh' + scale + ';{' + slideLeft + ',' + slideTop + '}');
    rmcall(message);
}


