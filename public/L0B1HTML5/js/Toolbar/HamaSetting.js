var syncPage = 0,
    fullScreen = false;
var isIRS = false;

var tempToolBars = [
    //左選單內容設定
    {
        'toolBarId': 'toolLeftBar', //左選單id
        'toggle': true,
        'show': true,
        //左選單內的按鈕們
        'btns': [{
            //返回
            "id": "back",
            "beforespanTextName": "返回",
            "afterspanTextName": "返回",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/appback.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/appback.png)' },
            action: function () {
                CallExToExit();
            }
        },{
            //返回
            "id": "fullscreen",
            "beforespanTextName": "全螢幕",
            "afterspanTextName": "全螢幕",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/fullscreen_open.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/fullscreen_close.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }
                
                this.afterClick = !this.afterClick;
                checkBtnChange(this);
                
                var elem = $('body')[0];
 
                var isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                 
                if (!isFullScreen) { // 目前非全螢幕狀態 開啟全螢幕
                  if (elem.requestFullscreen) {
                   elem.requestFullscreen();
                  } else if (elem.msRequestFullscreen) {
                   elem.msRequestFullscreen();
                  } else if (elem.mozRequestFullScreen) {
                   elem.mozRequestFullScreen();
                  } else if (elem.webkitRequestFullscreen) {
                   elem.webkitRequestFullscreen();
                  }
                  fullScreen = true;
                } else { // 目前為全螢幕狀態 關閉全螢幕
                  if (document.exitFullscreen) {
                    document.exitFullscreen();
                  } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                  } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                  } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                  }
                  fullScreen = false;
                }
            }
        }, {
            //跳頁
            "id": "jump",
            "beforespanTextName": "跳頁",
            "afterspanTextName": "跳頁",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/btnJumpBefore.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/btnJumpAfter.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }

                this.afterClick = !this.afterClick;

                checkBtnChange(this);
                JumpTableShow(this);
                JumpIconShow(this);
            }
        }, {
            //頁籤
            "id": "tab",
            "beforespanTextName": "頁籤",
            "afterspanTextName": "頁籤",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/btnTabBefore.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/btnTabAfter.png)' },
            action: function () {

                tapLayer();

            }
        }, {
            //上頁 
            "id": "prevPage",
            "beforespanTextName": "上頁",
            "afterspanTextName": "上頁",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/btnPrevPage.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/btnPrevPage.png)' },
            action: function () {
                // changeAllBtnToFalse();
                if (!MainObj.IsTwoPage) {
                    gotoPage(MainObj.NowPage - 1, true, false);
                } else {
                    gotoPage(MainObj.NowPage - 2, true, false);
                }

                syncPage = MainObj.NowPage;

                var message = '[scmd]' + Base64.encode('prpg' + syncPage);
                rmcall(message);
            }
        }, {
            //下頁
            "id": "nextPage",
            "beforespanTextName": "下頁",
            "afterspanTextName": "下頁",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/btnNextPage.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/btnNextPage.png)' },
            action: function () {
                // changeAllBtnToFalse();
                if (!MainObj.IsTwoPage) {
                    gotoPage(MainObj.NowPage + 1, true, true);
                } else {
                    gotoPage(MainObj.NowPage + 2, true, true);
                }

                syncPage = MainObj.NowPage;

                var message = '[scmd]' + Base64.encode('nxpg' + syncPage);
                rmcall(message);
            }
        }, {
            //文字
            "id": 'txtnote',
            "beforespanTextName": "文字",
            "afterspanTextName": "文字",
            "beforeStyle": { 'background-image': 'url(ToolBar/btnTextboxBefore.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/btnTextboxAfter.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }
                
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (ToolBarList.AddWidgetState == 'txtNote') {
                    ToolBarList.AddWidgetState = 'none';
                } else {
                    ToolBarList.AddWidgetState = 'txtNote'
                }

            },
            "afterClick": false,
            "type": "txtNote"
        }, {
            //便利貼 
            "id": "txtcanvasID",
            "beforespanTextName": "便利貼",
            "afterspanTextName": "便利貼",
            "beforeStyle": { 'background-image': 'url(ToolBar/btnNoteBefore.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/btnNoteAfter.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }
                
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (ToolBarList.AddWidgetState == 'txtCanvas') {
                    ToolBarList.AddWidgetState = 'none';
                } else {
                    ToolBarList.AddWidgetState = 'txtCanvas'
                }
            },
            "afterClick": false,
            "type": "txtCanvas"
        }, {
            //畫筆
            "id": "colorPen",
            "beforeImg": "ToolBar/btnPenBefore.png",
            "afterImg": "ToolBar/btnPenAfter.png",
            "beforespanTextName": "畫筆",
            "afterspanTextName": "畫筆",
            "afterClick": false,
            "type": "pen",
            "beforeStyle": { 'background-image': 'url(ToolBar/btnPenBefore.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/btnPenAfter.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }
                
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (ToolBarList.AddWidgetState == 'pen') {
                    ToolBarList.AddWidgetState = 'none';
                } else {
                    ToolBarList.AddWidgetState = 'pen'
                }
            }
        }, {
            //調色盤
            "id": "ColorsPicker",
            "beforeImg": "ToolBar/btnPaletteBefore.png",
            "afterImg": "ToolBar/btnPaletteAfter.png",
            "beforespanTextName": "調色盤",
            "afterspanTextName": "調色盤",
            "afterClick": false,
            "type": "colorPicker",
            "beforeStyle": { 'background-image': 'url(ToolBar/btnPaletteBefore.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/btnPaletteAfter.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }
                
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (ToolBarList.AddWidgetState == 'ColorsPicker') {
                    ToolBarList.AddWidgetState = 'none';
                } else {
                    ToolBarList.AddWidgetState = 'ColorsPicker'
                }

                $('#colorPicker').dialog('open');
            }
        }, {
            //橡皮擦
            "id": "eraser",
            "beforespanTextName": "橡皮擦",
            "afterspanTextName": "橡皮擦",
            "afterClick": false,
            "type": "eraser",
            "beforeStyle": { 'background-image': 'url(ToolBar/btnEraserBefore.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/btnEraserAfter.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }
                
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (ToolBarList.AddWidgetState == 'eraser') {
                    ToolBarList.AddWidgetState = 'none';
                } else {
                    ToolBarList.AddWidgetState = 'eraser'
                }
            }
        }, {
            //放大/100%
            "id": "zoomIn",
            "beforespanTextName": "放大",
            "afterspanTextName": "放大",
            "beforeStyle": { 'background-image': 'url(ToolBar/btnZoomInBefore.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/btnZoomInAfter.png)' },
            "afterClick": false,
            action: function () {
                changeAllBtnToFalse();

                if (ToolBarList.ZoomScale == 3) {
                    this.afterClick = true;
                    // checkBtnChange(this);
                    return;
                }
                
                zoomIn();
                NewOffset();
            }
        }, {
            //縮小
            "id": "zoomOut",
            "beforespanTextName": "縮小",
            "afterspanTextName": "縮小",
            "beforeStyle": { 'background-image': 'url(ToolBar/btnZoomOutBefore.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/btnZoomOutAfter.png)' },
            "afterClick": false,
            action: function () {
                changeAllBtnToFalse();

                if (ToolBarList.ZoomScale == 1) {
                    this.afterClick = true;
                    checkBtnChange(this);
                    return;
                }
                
                zoomOut();
                NewOffset();
            }
        }, {
            //搜內文
            "id": "textSearch",
            "beforespanTextName": "搜內文",
            "afterspanTextName": "搜內文",
            "afterClick": false,
            "type": "textSearch",
            "beforeStyle": { 'background-image': 'url(ToolBar/SearchNo.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/btnSearchAfter.png)' },
            action: function () {
                changeAllBtnToFalse();
                
                if (TextlocationList == '')
                    return;

                if (!$('#dialogSearchText').dialog('isOpen')) {
                    $('#dialogSearchText').dialog('open')
                } else {
                    $('#dialogSearchText').dialog('close')
                }
                
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                // toolbarBtnChange(this.id);
            }
        }, {
            //儲存
            "id": "save",
            "beforespanTextName": "儲存",
            "afterspanTextName": "儲存",
            "afterClick": false,
            "type": "save",
            "beforeStyle": { 'background-image': 'url(ToolBar/btnSaveBefore.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/btnSaveAfter.png)' },
            action: function () {
                var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
                if (indexedDB == undefined) {
                    // alert('此瀏覽器不支援本機註記儲存');
                } else {
                    SaveAll();
                }
                var tmp = location.search.replace('?','').split('&').map(function(x) {
                    return x.split('=').map(function(y) {
                        return decodeURIComponent(y);
                    });
                });var domain = tmp.filter(function(x) {
                    if (x[0] === 'domain') {
                        return x;
                    }
                });
                var token = tmp.filter(function(x) {
                    if (x[0] === 'token2') {
                        return x;
                    }
                });
                var url = (ReceiveList ? ReceiveList.HostURL : domain[0][1]) + '/api/File/ebookNote?token=' + token[0][1];
                $.ajax({
                    type: "POST",
                    contentType: "text/xml",
                    url: url,
                    async: false,
                    data: toSyncXML(true),
                    dataType: "json",
                    //成功接收的function
                    success: function(oXml, xhr) {
                        BookAlertShow('註記上傳成功！');
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        console.log("=====Error=====");
                    }
                });
            }
        }, {
            //分享
            "id": "share",
            "beforespanTextName": "分享",
            "afterspanTextName": "分享",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/btnShareBefore.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/btnShareAfter.png)' },
            action: function () {

                //影片截圖，先將影片做成canvas再截圖
                if ($('.video')[0] != undefined) {
                    NewCanvas();
                    var videoCanvas = $('#canvas')[0];
                    videoCanvas.width = $('.video')[0].width;
                    videoCanvas.height = $('.video')[0].height;
                    $(videoCanvas).css({
                        'left': $('.video')[0].offsetLeft,
                        'top': $('.video')[0].offsetTop
                    })
                    $('.video')[0].pause();
                    var videoCxt = videoCanvas.getContext('2d');
                    resizeCanvas(videoCanvas, videoCxt);
                    videoCxt.drawImage($('.video')[0], 0, 0, videoCanvas.width, videoCanvas.height);
                }

                html2canvas($('#HamastarWrapper'), {
                    allowTaint: true,
                    taintTest: false,
                    onrendered: function(canvas) {

                        canvas.id = "mycanvas";
                        var newImg = document.createElement("img");
                        $(newImg).attr({
                            'class': 'shareImg',
                            'width': '100%'
                        });

                        newImg.src = canvas.toDataURL();
                        $('#imgList').append(newImg);
                        $('#imgList').click(function() {
                            choiceImg(this);
                        })

                        alert('請確定開啟封鎖彈跳視窗選項!!，否則facebook分享功能可能會無法正確執行。');

                        $(videoCanvas).remove();

                        $('#EditDiv').toggle();

                        //載具上執行才會有LINE選項
                        if (!(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) || (/(Android)/i.test(navigator.userAgent))) {
                            $('#lineBtn').css('display', 'none');
                        }
                    }
                });

                this.afterClick = !this.afterClick;
                checkBtnChange(this);

            }
        }, {
            //封面
            "id": "coverPage",
            "beforespanTextName": "封面",
            "afterspanTextName": "封面",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/btnCoverPage.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/btnCoverPage.png)' },
            action: function () {
                changeAllBtnToFalse();
                gotoPage(0);

                syncPage = MainObj.NowPage;

                var message = '[scmd]' + Base64.encode('goto' + syncPage);
                rmcall(message);
            }
        }, {
            //封底
            "id": "backCoverPage",
            "beforespanTextName": "封底",
            "afterspanTextName": "封底",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/btnBackCoverPage.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/btnBackCoverPage.png)' },
            action: function () {
                changeAllBtnToFalse();
                gotoPage(HamaList.length - 1);

                syncPage = MainObj.NowPage;

                var message = '[scmd]' + Base64.encode('goto' + syncPage);
                rmcall(message);
            }
        }, {
            //100%
            "id": "zoom100",
            "beforespanTextName": "100%",
            "afterspanTextName": "100%",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/btnSearchBefore.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/btnSearchBefore.png)' },
            action: function () {
                changeAllBtnToFalse();
                zoomOut(true);
            }
        }, {
            //首頁
            "id": "home",
            "beforespanTextName": "首頁",
            "afterspanTextName": "首頁",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/btnBack.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/btnBack.png)' },
            action: function () {

                location.href = 'http://cirn.hamastar.com.tw/Guildline/index.aspx?sid=18';

            }
        }, {
            //IRS
            "id": "IRS",
            "beforespanTextName": "IRS",
            "afterspanTextName": "IRS",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/appirsQ1.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/appirsQ2.png)' },
            action: function () {
                if(ReceiveList.UserRole == 2) {
                    
                    if (!this.afterClick) {
                        changeAllBtnToFalse();
                    }
                    
                    isIRS = true;
                    this.afterClick = !this.afterClick;
                    checkBtnChange(this);

                    $('#IRS_Div').toggle();
                    $('#App_Notes').css('display', 'none');
                    $('#App_Discuss').css('display', 'none');
                    $('#discussCanvas').remove();

                    GalleryStartMove();
                } else {
                    CheckHasAnswer();
                }
            }
        }, {
            //測驗結果
            "id": 'examResult',
            "beforespanTextName": "測驗結果",
            "afterspanTextName": "測驗結果",
            "beforeStyle": { 'background-image': 'url(ToolBar/appresult.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/appresult.png)' },
            "afterClick": false,
            action: function () {

                CommandToWPF('ShowExamResult');

            }
        }, {
            //筆記
            "id": "notes",
            "beforespanTextName": "筆記",
            "afterspanTextName": "筆記",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/appnotes1.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/appnotes2.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }
                
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                $('#App_Notes').toggle();
                $('#IRS_Div').css('display', 'none');
                $('#App_Discuss').css('display', 'none');
                $('#discussCanvas').remove();

                GalleryStartMove();
            }
        }, {
            //問題便籤
            "id": "QA",
            "beforespanTextName": "問題便籤",
            "afterspanTextName": "問題便籤",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/appQ&A.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/appQ&A.png)' },
            action: function () {

                CommandToWPF('OpenIssuseNote');

            }
        }, {
            //網頁瀏覽
            "id": "web",
            "beforespanTextName": "網頁瀏覽",
            "afterspanTextName": "網頁瀏覽",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/appweb.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/appweb.png)' },
            action: function () {

                CommandToWPF('OpenWebBrowser');

            }
        }, {
            //分組討論
            "id": "discuss",
            "beforespanTextName": "分組討論",
            "afterspanTextName": "分組討論",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/appdiscuss1.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/appdiscuss2.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }
                
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                if (!$('#discussCanvas')[0]) {
                    startDiscussion();
                } else {
                    isIRS = false;
                    $('#discussCanvas').remove();
                    GalleryStartMove();
                    IRSinit();
                    changeAllBtnToFalse();
                }

                $('#App_Discuss').toggle();
                $('#App_Notes').css('display', 'none');
                $('#IRS_Div').css('display', 'none');
            }
        }, {
            //同步
            "id": "sync",
            "beforespanTextName": "同步",
            "afterspanTextName": "同步",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/SyncButton.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/SyncButton.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }

                if (bookSyncInfo.UserState == undefined || bookSyncInfo.UserState == 0) {

                    var message = '[scmd]' + Base64.encode('sybt' + syncPage);
                    rmcall(message);
                } else {

                    var message = '[scmd]' + Base64.encode('nosy' + syncPage);
                    rmcall(message);

                }
                

            }
        }, {
            //開始測驗
            "id": "quizAction",
            "beforespanTextName": "開始測驗",
            "afterspanTextName": "開始測驗",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/quizAction.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/quizAction.png)' },
            action: function () {

                quizBtnToggle();

                quizAction();

            }
        }, {
            //送出試卷
            "id": "quizUpload",
            "beforespanTextName": "送出試卷",
            "afterspanTextName": "送出試卷",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/quizUpload.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/quizUpload.png)' },
            action: function () {
                
                quizBtnToggle();

                OldQuizUpload();

            }
        }, {
            //上傳(筆記)
            "id": "upload",
            "beforespanTextName": "註記上傳",
            "afterspanTextName": "註記上傳",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/Upload.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/Upload.png)' },
            action: function () {
                changeAllBtnToFalse();

                var tmp = location.search.replace('?','').split('&').map(function(x) {
                    return x.split('=').map(function(y) {
                        return decodeURIComponent(y);
                    });
                });
                var domain = tmp.filter(function(x) {
                    if (x[0] === 'domain') {
                        return x;
                    }
                });
                var token = tmp.filter(function(x) {
                    if (x[0] === 'token2') {
                        return x;
                    }
                });

                var url = (ReceiveList ? ReceiveList.HostURL : domain[0][1]) + '/api/File/ebookNote?token=' + token[0][1];
                $.ajax({
                    type: "POST",
                    contentType: "text/xml",
                    url: url,
                    async: false,
                    data: toSyncXML(true),
                    dataType: "json",
                    //成功接收的function
                    success: function(oXml, xhr) {
                        BookAlertShow('註記上傳成功！');
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        console.log("=====Error=====");
                    }
                });
            }
        }, {
            //註記下載
            "id": "switch",
            "beforespanTextName": "註記下載",
            "afterspanTextName": "註記下載",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/change1.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/change1.png)' },
            action: function () {
                changeAllBtnToFalse();

                getNotesList();
            }
        }, {
            //交作業
            "id": "email",
            "beforespanTextName": "交作業",
            "afterspanTextName": "交作業",
            "afterClick": false,
            "beforeStyle": { 'background-image': 'url(ToolBar/mailclose.png)' },
            "afterStyle": { 'background-image': 'url(ToolBar/mailopen.png)' },
            action: function () {
                if (!this.afterClick) {
                    changeAllBtnToFalse();
                }
                
                this.afterClick = !this.afterClick;
                checkBtnChange(this);

                $('.classhub_email_div').css('display', 'flex');
            }
        }

                                                                                /*{
                                                                                    //momo打電話
                                                                                    "id": "phone",
                                                                                    "beforespanTextName": "撥打專線",
                                                                                    "afterspanTextName": "撥打專線",
                                                                                    "afterClick": false,
                                                                                    "beforeStyle": { 'background-image': 'url(ToolBar/btnPhone.png)' },
                                                                                    "afterStyle": { 'background-image': 'url(ToolBar/btnPhone.png)' },
                                                                                    action: function () {

                                                                                        var newlink = document.createElement('a');
                                                                                        newlink.setAttribute('href', 'tel:0800777515');
                                                                                        newlink.click();
                                                                                    }
                                                                                }, {
                                                                                    //註記上傳
                                                                                    "id": "uploadXML",
                                                                                    "beforespanTextName": "註記上傳",
                                                                                    "afterspanTextName": "註記上傳",
                                                                                    "afterClick": false,
                                                                                    "beforeStyle": { 'background-image': 'url(ToolBar/Upload.png)' },
                                                                                    "afterStyle": { 'background-image': 'url(ToolBar/Upload.png)' },
                                                                                    action: function () {

                                                                                        if (bookGlobal.isApp) {

                                                                                            var noteXml = toSyncXML(true, true);
                                                                                            var identifier = eBooksSetting[0].bookID;

                                                                                            uploadNoteXml(noteXml, identifier);

                                                                                            alert('註記上傳成功');

                                                                                        } else {

                                                                                            if (typeof (Identifier) == 'undefined' && (location.href).indexOf("file://") != -1) {
                                                                                                alert('請經由站台觀看電子書使用註記上傳功能');
                                                                                                return;
                                                                                            }
                                                                                            //btnNoteChange();
                                                                                            Login();
                                                                                            //JQ("#hamaQuiz").slideDown("slow");
                                                                                            toolbarBtnChange(0, this.id);

                                                                                        }

                                                                                    }
                                                                                }, {
                                                                                    //搜尋
                                                                                    //因為之前有定義websearch了，所以沒有重新定義成webSearch  軒軒
                                                                                    "id": "websearch",
                                                                                    "Img": "ToolBar/websearch.png",
                                                                                    "beforeImg": "ToolBar/websearch.png",
                                                                                    "afterImg": "ToolBar/websearch2.png",
                                                                                    "TextName": "搜尋",
                                                                                    "beforespanTextName": "超連結",
                                                                                    "afterspanTextName": "超連結",
                                                                                    action: function() {

                                                                                        //setBtnIndex(0, 3);
                                                                                        //  widgetBtnChangeOther(3);
                                                                                        penStatus = JQ('#canvas').css('display');
                                                                                        if (penStatus == 'block') {
                                                                                            StopHSPen();
                                                                                        }
                                                                                        cleanStatus = JQ('#clean').css('display');
                                                                                        if (cleanStatus == 'block') {
                                                                                            StopHSClean();
                                                                                        }
                                                                                        if (addWidgetState == 'websearch') {
                                                                                            addWidgetState = 'none';
                                                                                        } else {
                                                                                            addWidgetState = 'websearch';
                                                                                        }
                                                                                        //gallery.goToPage(slides.length - 1);
                                                                                        //toolbarBtnChange(0, this.id);
                                                                                    },
                                                                                    "afterClick": false
                                                                                }, {
                                                                                    //上傳
                                                                                    "id": "uploadXML",
                                                                                    "Img": "ToolBar/Upload.png",
                                                                                    "beforeImg": "ToolBar/Upload.png",
                                                                                    "afterImg": "ToolBar/Upload.png",
                                                                                    "TextName": "上傳",
                                                                                    "beforespanTextName": "上傳",
                                                                                    "afterspanTextName": "上傳",
                                                                                    action: function() {

                                                                                        if (typeof(Identifier) == 'undefined' && (location.href).indexOf("file://") != -1) {
                                                                                            alert('請經由站台觀看電子書使用註記上傳功能');
                                                                                            return;
                                                                                        }
                                                                                        //btnNoteChange();
                                                                                        Login();
                                                                                        //JQ("#hamaQuiz").slideDown("slow");
                                                                                        toolbarBtnChange(0, this.id);



                                                                                    },
                                                                                    "afterClick": false

                                                                                }, {
                                                                                    //切換
                                                                                    "id": "changeXML",
                                                                                    "Img": "ToolBar/change1.png",
                                                                                    "beforeImg": "ToolBar/change1.png",
                                                                                    "afterImg": "ToolBar/change1.png",
                                                                                    "TextName": "切換",
                                                                                    "beforespanTextName": "切換",
                                                                                    "afterspanTextName": "切換",
                                                                                    action: function() {
                                                                                        //Identifier = $location.search().Identifier;
                                                                                        //FileName = $location.search().FileName;
                                                                                        if (typeof(Identifier) == 'undefined' && (location.href).indexOf("file://") != -1) {
                                                                                            alert('請經由站台觀看電子書使用註記切換功能');
                                                                                            return;
                                                                                        }
                                                                                        JQ('#dialogNote_list').dialog('open');
                                                                                        UploadUserdata();
                                                                                        toolbarBtnChange(0, this.id);



                                                                                    },
                                                                                    "afterClick": false

                                                                                }*/
        ]
    }
];


//back:返回 jump:跳頁 tab:頁籤 prevPage:上頁 nextPage:下頁 txtnote:文字 txtcanvasID:便利貼 
//colorPen:畫筆 ColorsPicker:調色盤 eraser:橡皮擦 zoonIn:放大鏡 zoomOut:縮小 textSearch:搜內文
//save:儲存 share:分享 uploadXml:註記上傳 sync:同步
var customToolBar = [{
    id: "back",
    btnText: "返回"
}
// ,{
//     id: "fullscreen",
//     btnText: "全螢幕"
// }
, {
    id: "jump",
    btnText: "跳頁"
}
, {
    id: "tab",
    btnText: "頁籤"
}, {
    id: "prevPage",
    btnText: "上頁"
}, {
    id: "nextPage",
    btnText: "下頁"
}, {
    id: "txtnote",
    btnText: "文字"
}, {
    id: "txtcanvasID",
    btnText: "便利貼"
}, {
    id: "colorPen",
    btnText: "畫筆"
}, {
    id: "ColorsPicker",
    btnText: "調色盤"
}, {
    id: "eraser",
    btnText: "橡皮擦"
}, {
    id: "zoomIn",
    btnText: "放大"
}, {
    id: "zoomOut",
    btnText: "縮小"
}, {
    id: "save",
    btnText: "儲存"
}, 
// {
//     id: "switch",
//     btnText: "註記下載"
// }, 
{
    id: "coverPage",
    btnText: "封面"
}, {
    id: "backCoverPage",
    btnText: "封底"
}, {
    id: "zoom100",
    btnText: "100%"
}
// , {
//     id: "textSearch",
//     btnText: "搜內文"
// }, {
//     id: "phone",
//     btnText: "撥打專線"
// }, {
//     id: "quizAction",
//     btnText: "開始測驗"
// }, {
//     id: "quizUpload",
//     btnText: "送出試卷"
// }
// , {
//     id: "home",
//     btnText: "首頁"
// }
// , {
//     id: "share",
//     btnText: "分享"
// }
// , {
//     id: "sync",
//     btnText: "同步"
// }, {
//     id: "upload",
//     btnText: "註記上傳"
// }
];

