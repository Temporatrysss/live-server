//工具列

var ToolBarList = {
    AddWidgetState: 'none', //新增物件的狀態
    TapList: [],
    ZoomScale: 1,
    ZoomNumber: [1, 1.5, 2, 2.5, 3],
    
    ChapterList: [], //頁面的資訊及閱讀狀態
    IsChapter: false //是否正在章節模式
}



//工具列顯示
function ToolBarShow() {
    if (!ToolBarList.IsChapter) {
        if ($('#ToolBarIcon').css('left') == '0px') {
            $('#ToolBarIcon').css('left', '10em');
            $('#ToolBarMenu').css('left', '0em');
        } else {
            $('#ToolBarIcon').css('left', '0em');
            $('#ToolBarMenu').css('left', '-10em');
        }
    } else {
        if ($('#ToolBarIcon').css('right') == '0px') {
            $('#ToolBarIcon').css('right', '10em');
            $('#ToolBarMenu').css('right', '0em');
        } else {
            $('#ToolBarIcon').css('right', '0em');
            $('#ToolBarMenu').css('right', '-10em');
        }
    }
}

//判斷書在站台或本機開啟
function getFaceModuleList() {

    var ToolBarList = customToolBar;
    if (ReceiveList != null) {
        if (ReceiveList.EnableIRS == 'True') {
            ToolBarList = AppToolBar;
        }
    }

    if ((location.href).indexOf("file://") == -1) {
        try {
            $http.post(location.origin + '/Api/HTML5Api/CheckHTML5ToolBar.ashx').success(function (data) {

                ToolBarSetting(data);

            }).error(function (err) {
                ToolBarSetting(ToolBarList);
            });

        } catch (err) {
            ToolBarSetting(ToolBarList);
        }
    } else {
        ToolBarSetting(ToolBarList);
    }
}

//工具列列表
function ToolBarSetting(custom) {

    $(custom).each(function() {
        for(var i = 0; i < tempToolBars[0].btns.length; i++) {
            if (this.id == tempToolBars[0].btns[i].id) {

                //APP才有返回鍵
                if (!rmcallBookSyncMessage('')) {
                    if (this.id == 'back') {
                        return;
                    }
                }

                //app工具列icon圖示改變
                if (ReceiveList != null) {
                    if (ReceiveList.EnableIRS == 'True') {
                        switch (this.id) {
                            case 'back':
                                if (ReceiveList.UserRole == 1) { //學生返回icon不一樣
                                    tempToolBars[0].btns[i].beforeStyle = { 'background-image': 'url(ToolBar/appstuback.png)' };
                                    tempToolBars[0].btns[i].afterStyle = { 'background-image': 'url(ToolBar/appstuback.png)' };
                                }
                                break;

                            case 'jump':
                                tempToolBars[0].btns[i].beforeStyle = { 'background-image': 'url(ToolBar/appjump1.png)' };
                                tempToolBars[0].btns[i].afterStyle = { 'background-image': 'url(ToolBar/appjump2.png)' };
                                break;

                            case 'tab':
                                tempToolBars[0].btns[i].beforeStyle = { 'background-image': 'url(ToolBar/apptab.png)' };
                                tempToolBars[0].btns[i].afterStyle = { 'background-image': 'url(ToolBar/apptab.png)' };
                                break;

                            case 'IRS':
                                if (ReceiveList.UserRole == 1) { //學生的IRS圖示是A，老師是Q
                                    tempToolBars[0].btns[i].beforeStyle = { 'background-image': 'url(ToolBar/appirsA1.png)' };
                                    tempToolBars[0].btns[i].afterStyle = { 'background-image': 'url(ToolBar/appirsA2.png)' };
                                }
                                break;

                            case 'prevPage':
                                tempToolBars[0].btns[i].beforeStyle = { 'background-image': 'url(ToolBar/appprevpage1.png)' };
                                tempToolBars[0].btns[i].afterStyle = { 'background-image': 'url(ToolBar/appprevpage1.png)' };
                                break;

                            case 'nextPage':
                                tempToolBars[0].btns[i].beforeStyle = { 'background-image': 'url(ToolBar/appnextpage1.png)' };
                                tempToolBars[0].btns[i].afterStyle = { 'background-image': 'url(ToolBar/appnextpage1.png)' };
                                break;
                        }
                    }
                }

                var that = tempToolBars[0].btns[i];
                var NewLi = document.createElement('li');
                var NewSpan = document.createElement('span');
                NewSpan.id = that.id;
                var NewLabel = document.createElement('label');

                if (that.id == 'textSearch') {
                    if (TextlocationList != '') {
                        that.beforeStyle = { 'background-image': 'url(ToolBar/btnSearchBefore.png)' };
                    } else {
                        that.beforeStyle = { 'background-image': 'url(ToolBar/SearchNo.png)' };
                    }
                }

                $(NewSpan).css('background-image', that.beforeStyle['background-image']);
                $(NewSpan).click(function(event) {
                    that.action();
                });
                $(NewLabel).text(that.beforespanTextName);
                $(NewSpan).append(NewLabel);
                $(NewLi).append(NewSpan);
                $('#ToolBarUl').append(NewLi);

                if (that.id == 'zoomOut') {
                    $(NewSpan).css('background-image', that.afterStyle['background-image']);
                    that.afterClick = true;
                }

            }
        }
    })

    $(IRSBars).each(function() {

        for(var i = 0; i < NoteBars[0].btns.length; i++) {
            if (this.id == NoteBars[0].btns[i].id) {

                //學生原畫面作答的地方沒有白板跟題目送出這兩個按鈕
                if (this.id == 'IRSwhiteboard' || this.id == 'IRSupload') return;

                var that = NoteBars[0].btns[i];
                var NewLi = document.createElement('li');
                var NewSpan = document.createElement('span');
                NewSpan.id = that.id;
                $(NewSpan).addClass(that.id);
                var NewLabel = document.createElement('label');

                $(NewSpan).css('background-image', that.beforeStyle['background-image']);
                $(NewSpan).click(function(event) {
                    that.action();
                });
                $(NewLabel).text(that.beforespanTextName);
                $(NewSpan).append(NewLabel);
                $(NewLi).append(NewSpan);
                $('#IRS_QuizUl').append(NewLi);
            }
        }
    })

    var toolHeigth = $('#ToolBarIcon').css('height', $(window).height() - 5 + 'px');
    $('#ToolBarSidesImg').draggable({
        containment: '#ToolBarIcon',
        drag: function() {

            var windowHeight = $(window).height();
            var draggableTop = $(this).css('top');
            var toolBarUlHeight = $('#ToolBarMenu > ul').height();

            $('#ToolBarMenu').scrollTop((parseInt(draggableTop) / windowHeight) * toolBarUlHeight);
        }
    });


    //將畫筆及橡皮擦綁在body上，才不會侷限到點擊的地方
    $('body').on('mousedown', penEventSet);
    $('body').on('touchstart', penEventSet);


    var slider = $('#chance_slider'),
        slider2 = $('#chance_sliderop');

    //畫筆粗細
    slider.change(function() {
        var newValue = parseInt($(this).val());
        $('.colorStateBar > div').css({ 'height': newValue });
    });

    //畫筆透明度
    slider2.change(function() {
        var newValue = parseInt($(this).val());

        $('.colorStateBar > div').css({ 'opacity': newValue / 10 });

    });

    //引用調色盤套件
    $('#picker').farbtastic('#color');

    //調色盤視窗
    $("#colorPicker").dialog({
        resizable: false,
        modal: true,
        autoOpen: false,
        dialogClass: "window_layout",
        width: '360px',
        close: function(event, ui) {
            closePicker();
        }
    });

    //全文檢索視窗
    $("#dialogSearchText").dialog({
        resizable: false,
        modal: false,
        autoOpen: false,
        dialogClass: "window_layout",
        close: function(event, ui) {
            closeSearch();
        }
    });

    //上傳討論結果視窗
    $("#UploadDiscussion").dialog({
        resizable: false,
        modal: false,
        autoOpen: false,
        dialogClass: "window_layout",
        close: function(event, ui) {
            
        }
    });

    //IRS
    $(IRSBars).each(function() {

        for(var i = 0; i < NoteBars[0].btns.length; i++) {
            if (this.id == NoteBars[0].btns[i].id) {

                //IRS版面沒有WebCam跟上傳答案這兩個按鈕
                if (this.id == 'WebCam' || this.id == 'StuQuizUpload') return;

                var that = NoteBars[0].btns[i];
                var NewLi = document.createElement('li');
                var NewSpan = document.createElement('span');
                NewSpan.id = that.id;
                $(NewSpan).addClass(that.id);
                var NewLabel = document.createElement('label');

                $(NewSpan).css('background-image', that.beforeStyle['background-image']);
                $(NewSpan).click(function(event) {
                    that.action();
                });
                $(NewLabel).text(that.beforespanTextName);
                $(NewSpan).append(NewLabel);
                $(NewLi).append(NewSpan);
                $('#IRS_Ul').append(NewLi);
            }
        }
    })

    if (ReceiveList != null) {
        if (ReceiveList.EnableIRS == 'True') {

            //APP筆記
            $(AppNoteBars).each(function() {
                for(var i = 0; i < NoteBars[0].btns.length; i++) {
                    if (this.id == NoteBars[0].btns[i].id) {

                        var that = NoteBars[0].btns[i];
                        var NewLi = document.createElement('li');
                        var NewSpan = document.createElement('span');
                        NewSpan.id = that.id;
                        $(NewSpan).addClass(that.id);
                        var NewLabel = document.createElement('label');

                        $(NewSpan).css('background-image', that.beforeStyle['background-image']);
                        $(NewSpan).click(function(event) {
                            that.action();
                        });
                        $(NewLabel).text(that.beforespanTextName);
                        $(NewSpan).append(NewLabel);
                        $(NewLi).append(NewSpan);
                        $('#App_NotesUl').append(NewLi);
                    }
                }
            })

            //APP分組討論
            $(AppDiscussBars).each(function() {

                for(var i = 0; i < NoteBars[0].btns.length; i++) {
                    if (this.id == NoteBars[0].btns[i].id) {

                        if(ReceiveList.UserRole == 1) {

                            //學生沒有題目送出跟討論結果這兩個按鈕
                            if (this.id == 'sendexam' || this.id == 'result') return;

                        } else if(ReceiveList.UserRole == 2) {

                            //老師沒有開始討論跟上傳這兩個按鈕
                            if (this.id == 'start' || this.id == 'uploadDiscuss') return;

                        }

                        var that = NoteBars[0].btns[i];
                        var NewLi = document.createElement('li');
                        var NewSpan = document.createElement('span');
                        NewSpan.id = that.id;
                        $(NewSpan).addClass(that.id);
                        var NewLabel = document.createElement('label');

                        $(NewSpan).css('background-image', that.beforeStyle['background-image']);
                        $(NewSpan).click(function(event) {
                            that.action();
                        });
                        $(NewLabel).text(that.beforespanTextName);
                        $(NewSpan).append(NewLabel);
                        $(NewLi).append(NewSpan);
                        $('#App_DiscussUl').append(NewLi);
                    }
                }
            })
        }
    }

    //開書只顯示開始測驗按鈕，送出試卷先隱藏
    $('#quizUpload').css('display', 'none')

}

function penEventSet() {
    if ($(event.target).attr('class') != null) {
        var touchClass = $(event.target).attr('class').split(' ')[0];

        //由於是綁在body上，因此案工具列也會觸發
        //所以要判斷是點擊在翻頁canvas上或物件canvas上才觸發
        if (touchClass == 'canvas' || touchClass == 'canvasObj' || touchClass == 'whiteboard') {
            switch (ToolBarList.AddWidgetState) {

                case 'pen':
                case 'IRSpen':
                    // alert('pen, ' + event.type);
                    StartPen();

                    break;

                case 'eraser':
                case 'IRSeraser':
                    StartEraser();

                    break;

                case 'txtNote':
                case 'IRStxtnote':
                    // alert('note, ' + event.type);
                    txtNoteLayer();

                    FindTool(ToolBarList.AddWidgetState);
                    break;

                case 'txtCanvas':
                case 'IRStxtcanvas':
                    txtCanvasLayer();

                    FindTool(ToolBarList.AddWidgetState);
                    break;

                case 'IRSinsert':
                    insertImageLayer();

                    FindTool(ToolBarList.AddWidgetState);
                    break;
            }
        }
    }
}

//取得btn並回到點擊前狀態
function FindTool(toolID) {
    var obj;
    
    $(tempToolBars[0].btns).each(function() {
        if (this.type == toolID) obj = this;
    })

    $(NoteBars[0].btns).each(function() {
        if (this.type == toolID) obj = this;
    })

    obj.afterClick = !obj.afterClick;
    checkBtnChange(obj);

    ToolBarList.AddWidgetState = 'none';
}

//JumpIcon初始化
function initListpng() {
    $('#btnAll').attr({ 'src': "ToolBar/allpage.png" });
    $('#btnBook').attr({ 'src': "ToolBar/switchJumpPageDefaultBtn1.png" });
    $('#btnChapter').attr({ 'src': "ToolBar/chapterbtn1.png" });
}

//點擊後改變按鈕圖示
function checkBtnChange(btn) {
    var span;
    if ($('.' + btn.id)[0] == undefined) {
        span = '#' + btn.id; //工具列
    } else {
        span = '.' + btn.id; //IRS
    }

    if (btn.afterClick) {
        $(span).css('background-image', btn.afterStyle['background-image']);
    } else {
        $(span).css('background-image', btn.beforeStyle['background-image']);
    }
}

//跳頁列表設定
function JumpTableShow(btn) {

    var Top = $(window).height() - 200;

    if (btn.afterClick) {

        btnBookSetting();
        initListpng();
        $('#btnBook').attr({ 'src': "ToolBar/switchJumpPageDefaultBtn2.png" });

        $('#Jumptable').css({
            'display': 'block',
            'top': Top,
            'padding': '0 0 0 5%'
        });

    } else {
        $('#JumptableAll').css('display', 'none');
        $('#Jumptable').css('display', 'none');
        $('#JumpChapter').css('display', 'none');
        $('#JumpBar').remove();

        ToolBarList.IsChapter = false;

        toolbarChange();
        ResetEBook();
    }
}

//btnAll版面設定
function btnAllSetting() {
    $('#JumptableAll').css({
        'display': 'block',
        'height': $('#CanvasGallery').height()
    });
    $('#Jumptable').css('display', 'none');
    $('#JumpChapter').css('display', 'none');
    $('.pptType').remove();

    $('body').css('background', '#fbf3f3');

    //清除章節模式設定的style
    $('.JumpIcon').removeAttr('style');
    $('.JumpIcon > li').removeAttr('style');

    var NewUl = document.createElement('ul');
    $(NewUl).attr('class', 'pptType');
    $('#JumptableAll').append(NewUl);

    for (var i = 0; i < Base64ImageList.length - 1; i++) {
        var NewLi = document.createElement('li');
        $(NewUl).append(NewLi);

        JumpTableSetting(i, NewLi);
    }
}

//btnBook版面設定
function btnBookSetting() {
    $('#JumpChapter').css('display', 'none');
    $('#JumptableAll').css('display', 'none');
    $('#Jumptable').css('display', 'block');
    $('#JumpBar').remove();

    //清除章節模式設定的style
    $('.JumpIcon').removeAttr('style');
    $('.JumpIcon > li').removeAttr('style');

    $('body').css('background', '#fbf3f3');

    var Jumpbar = document.createElement('table');
    Jumpbar.id = 'JumpBar';
    $(Jumpbar).css('position', 'absolute');
    $('#Jumptable').append(Jumpbar);

    var Newtbody = document.createElement('tbody');
    $(Jumpbar).append(Newtbody);
    var Newtr = document.createElement('tr');
    $(Newtbody).append(Newtr);

    for (var i = 0; i < Base64ImageList.length - 1; i++) {

        var Newtd = document.createElement('td');
        $(Newtr).append(Newtd);
        $(Newtd).css({
            'width': '150px',
            'color': 'white'
        })

        JumpTableSetting(i, Newtd);
    }
}

//章節模式版面設置
function btnChapterSetting() {

    $('#JumpChapter').css('display', 'block');
    $('#JumptableAll').css('display', 'none');
    $('#Jumptable').css('display', 'none');

    $('.ChapterLi').remove();

    $('.JumpIcon').css({
        'top': '1%',
        'left': '0px',
        'position': 'absolute',
        'width': '200px',
        'height': '30px'
    })

    $('.JumpIcon > li').css({
        'position': 'absolute'
    })

    $('body').css('background', '#353535');

    var iconCount = $('.JumpIcon > li').length;
    var padding = (200 - (30 * iconCount)) / (iconCount + 1);

    //設置左右icon間距
    for (var i = 0; i < iconCount; i++) {
        var left = (padding * (i + 1)) + (30 * i);
        var icon = $('.JumpIcon > li')[i];
        $(icon).css({
            'left': left
        })
    }

    // if (ToolBarList.ChapterList == '') {
    //     for (var page = 0; page < HamaList.length; page++) {
    //         var list = {
    //             title: HamaList[page].PageTitle,
    //             page: page,
    //             isChapter: HamaList[page].IsChapter,
    //             readStatus: false
    //         }

    //         if (MainObj.NowPage == page) {
    //             list.readStatus = true;
    //         }

    //         ToolBarList.ChapterList.push(list);
    //     }
    // }

    $(ToolBarList.ChapterList).each(function() {

        var that = this;

        var li = document.createElement('li');
        var img = document.createElement('img');
        var label = document.createElement('label');

        $(li).click(function(event) {
            gotoPage(that.page);
        });

        $(li).addClass('ChapterLi');

        img.src = 'ToolBar/unread.png';
        img.width = 16;
        img.height = 16;
        $(li).append(img);

        //title超過五個字以上都變點點點
        // if (that.title.length > 8) {
        //     var title = ''
        //     for (var a = 0; a < 8; a++) {
        //         title += that.title[a];
        //     }
        //     that.title = title + '...';
        // }

        $(label).text(that.title);

        $(li).append(label);
        $('#Chapter_ul').append(li);

        if (that.isChapter == '0') { //縮排
            $(img).css('margin-left', '25px');
        }

    })

    toolbarChange();
    ChapterSwitchImg();
}

//章節模式閱讀紀錄清單設定
function ChapterListSet() {
    if (ToolBarList.ChapterList == '') {
        for (var page = 0; page < HamaList.length; page++) {
            var list = {
                title: HamaList[page].PageTitle,
                page: page,
                isChapter: HamaList[page].IsChapter,
                readStatus: false
            }

            if (MainObj.NowPage == page) {
                list.readStatus = true;
            }

            ToolBarList.ChapterList.push(list);
        }
    }
}

//工具列左右互換
function toolbarChange() {
    if (ToolBarList.IsChapter) { //右

        $('#ToolBarIcon').removeClass('ToolBarIcon').addClass('ToolBarIcon_right');
        $('#ToolBarMenu').removeClass('ToolBarMenu').addClass('ToolBarMenu_right');

        $('.ToolBarIcon_right').removeAttr('style');
        $('.ToolBarMenu_right').removeAttr('style');

        $('#ToolBarSidesImg')[0].src = "ToolBar/ToolBarLandscapeHide_right.png";

    } else { //左

        $('#ToolBarIcon').removeClass('ToolBarIcon_right').addClass('ToolBarIcon');
        $('#ToolBarMenu').removeClass('ToolBarMenu_right').addClass('ToolBarMenu');

        $('.ToolBarIcon').removeAttr('style');
        $('.ToolBarMenu').removeAttr('style');

        $('#ToolBarSidesImg')[0].src = "ToolBar/ToolBarLandscapeHide.png";
    }

    $('#ToolBarIcon').css('height', $(window).height() - 5 + 'px');
}

//閱讀紀錄圖片變換
function ChapterSwitchImg() {

    $(ToolBarList.ChapterList).each(function() {

        var li = $('.ChapterLi')[this.page];
        if (li == undefined) return;

        if (this.page == MainObj.NowPage) { //目前頁面

            li.children[0].src = 'ToolBar/reading.png';
            this.readStatus = true;

        } else if (this.readStatus) { //已讀

            li.children[0].src = 'ToolBar/read.png';

        }

    })
}

//版面圖片設定
function JumpTableSetting(num, table) {

    var Widget = false;

    var NewDiv = document.createElement('div');
    $(table).append(NewDiv);
    $(NewDiv).css({
        'width': '150px',
        'height': '150px',
        'position': 'relative'
    })

    var NewSpan = document.createElement('span');
    $(NewDiv).append(NewSpan);
    $(NewSpan).css('display', 'block');
    $(NewSpan).text(num + 1);

    var Img = new Image();
    $(NewDiv).append(Img);
    Img.id = num;
    Img.src = 'data:image/png;base64,' + Base64ImageList[num].Value;
    $(Img).css({
        'width': '150px',
        'height': '150px',
        'float': 'left',
        'position': 'absolute'
    })

    //跳頁視窗顯示頁籤
    if (ToolBarList.TapList[num]) {
        var tapImg = new Image();
        $(NewDiv).append(tapImg);
        tapImg.src = 'ToolBar/tagicon.png';
        $(tapImg).css({
            'width': '60px',
            'height': '30px',
            'float': 'left',
            'position': 'absolute',
            'right': '0px',
            'padding-top': '37px'
        })
    }

    if (txtCanvas.SaveList.length > 0) {
        for (var i = 0; i < txtCanvas.SaveList.length; i++) {
            // console.log(txtCanvas.SaveList[i]);
            if (txtCanvas.SaveList[i] != undefined) {
                if (txtCanvas.SaveList[i].page == num) {
                    Widget = true;
                }
            }
        }
    }

    if (txtNote.SaveList.length > 0) {
        for (var i = 0; i < txtNote.SaveList.length; i++) {
            // console.log(txtCanvas.SaveList[i]);
            if (txtNote.SaveList[i] != undefined) {
                if (txtNote.SaveList[i].page == num) {
                    Widget = true;
                }
            }
        }
    }

    if (Widget) {
        var noteImg = new Image();
        $(NewDiv).append(noteImg);
        noteImg.src = 'ToolBar/noteicon.png';
        $(noteImg).css({
            'width': '40px',
            'height': '35px',
            'float': 'left',
            'position': 'absolute',
            'padding-left': '110px'
        })
    }

    $(Img).click(function(event) {
        JumpPage(Number(this.id));
    });
}

//點擊跳頁列表的圖片後跳頁
function JumpPage(page) {
    gotoPage(page);
    $('#Jumptable').css('display', 'none');
    $('#JumptableAll').css('display', 'none');
    $('.JumpIcon').css('display', 'none');
    $('#JumpBar').remove();
    $('.pptType').remove();

    $(tempToolBars[0].btns).each(function() {
        if (this.id == 'jump') {
            this.afterClick = !this.afterClick;
            checkBtnChange(this);
        }
    })

    syncPage = MainObj.NowPage;

    var message = '[scmd]' + Base64.encode('goto' + syncPage);
    rmcall(message);
}

//JumpIcon顯示
function JumpIconShow(btn) {
    if (btn.afterClick) {

        if (MainObj.IsTwoPage) {
            $('#Chapter_li').css('display', 'none');
        }

        $('.JumpIcon').css('display', 'block');

    } else {
        $('.JumpIcon').css('display', 'none');
    }
}

//Icon功能判別
function JumpChange(list) {
    initListpng();

    switch (list.id) {
        case 'btnAll':
            $('#btnAll').attr({ 'src': "ToolBar/allpage2.png" });
            ToolBarList.IsChapter = false;
            btnAllSetting();
            break;

        case 'btnBook':
            $('#btnBook').attr({ 'src': "ToolBar/switchJumpPageDefaultBtn2.png" });
            ToolBarList.IsChapter = false;
            btnBookSetting();
            break;

        case 'btnChapter':
            $('#btnChapter').attr({ 'src': "ToolBar/chapterbtn2.png" });
            ToolBarList.IsChapter = true;
            btnChapterSetting();
            break;
    }

    if (MainObj.IsTwoPage) {
        $('#Chapter_li').css('display', 'none');
    }

    toolbarChange();
    ResetEBook();
}

//所有button變回false
function changeAllBtnToFalse() {
    $(tempToolBars[0].btns).each(function() {

        if (this.id == 'zoomIn' || this.id == 'zoomOut') {
            return;
        }

        this.afterClick = false;
        checkBtnChange(this);
        ToolBarList.AddWidgetState = 'none';
    });
}

//調色盤改變上面顏色條
function changecolorlw(color) {
    $('#color').attr("value", color);
    $(".colorStateBar").children("div").css("background-color", color);

}

//調色盤
function penchane(obj, COLOR) {
    $("#norColor .option").removeClass("active");
    $(obj).addClass("active");
    var tempPenColor = $(obj)[0].style.backgroundColor;

    penCmdStatus = 0;
    $(".colorStateBar").children("div").css("background-color", tempPenColor);
}

//調色盤：確定
function starDraw() {

    var picker;

    colorPen.Color = $('.colorStateBar >div')[0].style.backgroundColor;
    colorPen.Opacity = $('.colorStateBar >div')[0].style.opacity;
    colorPen.Width = parseInt($('#chance_slider').val());

    if (ToolBarList.AddWidgetState == 'ColorsPicker') {
        picker = 'colorPen';
    } else {
        picker = 'IRSPen';
    }

    var colorPenClick = checkPickerStatus(picker);
    var colorPicker = checkPickerStatus('ColorsPicker');
    if(colorPenClick.afterClick == false){
        $('#' + picker)[0].click();
    }
    $('#ColorsPicker').attr("src", "ToolBar/qpenToolStripButton.Image1.png");

    $('#colorPicker').dialog('close');

}

//調色盤：取消
function closePicker() {

    var btn;

    $('#colorPicker').dialog('close');

    if (ToolBarList.AddWidgetState == 'ColorsPicker') {
        btn = tempToolBars[0].btns;
    } else {
        btn = NoteBars[0].btns;
    }

    $(btn).each(function() {
        if (this.id == ToolBarList.AddWidgetState) {
            this.afterClick = !this.afterClick;
            checkBtnChange(this);
            ToolBarList.AddWidgetState = 'none';
        }
    })
}

//取得調色盤btn
function checkPickerStatus(objID) {
    var obj, btn;

    if (ToolBarList.AddWidgetState == 'ColorsPicker') {
        btn = tempToolBars[0].btns;
    } else {
        btn = NoteBars[0].btns;
    }

    $(btn).each(function() {
        if (this.id == objID) {
            obj = this;
        }
    })
    return obj;
}

//取得btn
function checkBtnStatus(objID) {
    var obj;
    $(tempToolBars[0].btns).each(function() {
        if (this.id == objID) {
            obj = this;
        }
    })
    return obj;
}

//頁籤
function tapLayer() {

    if ($('#tap')[0] == undefined) {

        NewCanvas();
        var canvasTap = $('#canvas')[0];
        canvasTap.id = 'tap';
        canvasTap.width = 94 * MainObj.Scale;
        canvasTap.height = 44 * MainObj.Scale;

        if (MainObj.IsTwoPage) {
            var left = $('#CanvasGallery')[0].width - canvasTap.width;
        } else {
            var left = $('#CanvasGallery')[0].width - canvasTap.width;
        }

        $(canvasTap).css({
            'position': 'absolute',
            'top': 100 + MainObj.CanvasT,
            'left': left + (MainObj.NowPage == 0 ? $('#CanvasGallery').offset().left : MainObj.CanvasL)
        })

        var cxtTap = canvasTap.getContext('2d');
        resizeCanvas(canvasTap, cxtTap);

        var imgTap = new Image();
        imgTap.onload = function() {
            cxtTap.drawImage(imgTap, 0, 0, canvasTap.width, canvasTap.height);
        }
        imgTap.src = 'ToolBar/tag.png';

        ToolBarList.TapList[MainObj.NowPage] = true;

    } else {
        $('#tap').remove();
        ToolBarList.TapList[MainObj.NowPage] = false;
    }
}

//全文檢索清單
function searchTextList() {
    $('.centent_Text').css({ 'height': '240px' });
    //$('#dialogSearchText').css({ 'height': '300px' });
    if ($('.centent_Text >ul>li').length > 0) {
        $('.centent_Text >ul').empty()
    }
    var temp = '';

    var searchText = '';
    var alltext = [];
    for (var i = 0; i < TextlocationList.length; i++) {
        if (TextlocationList[i].content.length > 0) {
            for (var j = 0; j < TextlocationList[i].content.length; j++) {

                if (TextlocationList[i].content[j].keyword == $('#TextKeyword').val()[0]) {
                    searchText = '';

                    for (var k = 0; k < $('#TextKeyword').val().length; k++) {

                        searchText += TextlocationList[i].content[j + (k)].keyword;
                    }

                    if (searchText != '') {
                        var searchData = [TextlocationList[i].content[j].top, TextlocationList[i].content[j].left, TextlocationList[i].content[j].width, TextlocationList[i].content[j].height, (i + 1), searchText];

                        alltext.push(searchData);
                    }

                }

            }
        }

    }
    var isRightpage = false;

    for (var y = 0; y < alltext.length; y++) {
        if ($('#TextKeyword').val() == alltext[y][5]) {

            if (!MainObj.IsTwoPage) {
                temp += "<li onclick=\"searchTextLocation(" + (alltext[y][4] - 1) + ',' + alltext[y][0] + ',' + alltext[y][1] + ',' + alltext[y][2] + ',' + alltext[y][3] + ");\"><div style=\"display:inline-block;;    width: 50px;\"><span >" + alltext[y][4] + '</span></div><div style=\"display:inline-block;;    \"><span style=\"padding-left:20px;\">' + alltext[y][5] + "</span></div></li>";
            } else {
                // console.log('page : ' + (alltext[y][4] - 1));
                isRightpage = false;

                if ((alltext[y][4] - 1) % 2 == 0) {
                    isRightpage = true;
                }
                temp += "<li onclick=\"searchTextLocation(" +(alltext[y][4] - 1) + ',' + alltext[y][0] + ',' + alltext[y][1] + ',' + alltext[y][2] + ',' + alltext[y][3] + ',' + isRightpage + ");\"><div style=\"display:inline-block;;    width: 50px;\"><span >" + alltext[y][4] + '</span></div><div style=\"display:inline-block;;    \"><span style=\"padding-left:20px;\">' + alltext[y][5] + "</span></div></li>";
            }

        }
    }

    $("#TextUL").append(temp);
    if ($('.centent_Text >ul>li').length < 1) {
        var temp = "<li>查無資料</li>";
        $("#TextUL").append(temp);
        $('.centent_Text').css({ 'height': '25px' });
        $('#dialogSearchText').css({ 'height': '80px' });
    }

    $('#textcount').text($('.centent_Text >ul>li').length);
}

//搜內文的手指圖片設定
function searchTextLocation(page, top, left, width, height, isRightpage) {

    $('.Text').remove();

    gotoPage(page);

    syncPage = MainObj.NowPage;

    var message = '[scmd]' + Base64.encode('goto' + syncPage);
    rmcall(message);

    var scalepdfy = 1;
    var scalepdfx = 1;
    var twoscalepdfx = 1;
    //換算縮放比例:母版/pdf原始寬高
    if (TextlocationList.length > 0) {

        var textlocation;

        for (var i = 0; i < TextlocationList.length; i++) {

            if (TextlocationList[i].pdfHeight != 0) {
                textlocation = TextlocationList[i];
                break;
            }
        }

        scalepdfy = MainObj.NewCanvasHeight / parseInt(textlocation.pdfHeight);
        scalepdfx = MainObj.NewCanvasWidth / parseInt(textlocation.pdfWidth);
        // scalepdfy = BookList.eBookHeight / parseInt(TextlocationList[0].pdfHeight);
        twoscalepdfx = (MainObj.NewCanvasWidth * 2) / (parseInt(textlocation.pdfWidth) * 2);
        console.log('two page : ' + twoscalepdfx);
    }

    var layer = new textImgLayer($('body'));

    layer.setTop((((top) * scalepdfy)) + MainObj.CanvasT - $('.Text').height() - 5);
    layer.setLeft(((left) * scalepdfx) + MainObj.CanvasL - $('.Text').width());

    if (MainObj.IsTwoPage) {
        if (isRightpage == true) {
            layer.setLeft(((left + parseInt(textlocation.pdfWidth)) * twoscalepdfx) + MainObj.CanvasL - $('.Text').width());
        }
    }
}

//搜內文的手指圖片新增
function textImgLayer(parentNode) {
    //Division
    this.Division = document.createElement('img');

    this.Division.super = this;
    this.Division.src = 'ToolBar/hand_finger2.png';
    this.Division.className = 'Text';
    $(this.Division).addClass('canvasObj');
    this.Division.style.position = 'absolute';
    this.Division.style.left = '0px';
    this.Division.style.top = '0px';
    this.Division.style.width = '23px';
    this.Division.style.height = '23px';

    $(this.Division).addClass('canvasObj');

    this.setLeft = function(left) {
        this.Division.style.left = (left + '').replace('px', '') + 'px';
    }

    this.setTop = function(top) {
        this.Division.style.top = (top + '').replace('px', '') + 'px';
    }


    if (parentNode != null) {
        parentNode.append(this.Division);
    }

}

//搜內文：取消
function closeSearch() {

    $('#dialogSearchText').dialog('close');

    $(tempToolBars[0].btns).each(function() {
        if (this.id == 'textSearch') {
            this.afterClick = !this.afterClick;
            checkBtnChange(this);
        }
    })
}

//IRS
function IRSSetting() {

    $('#IRS_Div').toggle();

    $(NoteBars[0].btns).each(function() {

        var that = this;
        var NewLi = document.createElement('li');
        var NewSpan = document.createElement('span');
        NewSpan.id = that.id;
        var NewLabel = document.createElement('label');

        $(NewSpan).css('background-image', that.beforeStyle['background-image']);
        $(NewSpan).click(function(event) {
            that.action();
        });
        $(NewLabel).text(that.beforespanTextName);
        $(NewSpan).append(NewLabel);
        $(NewLi).append(NewSpan);
        $('#IRS_Ul').append(NewLi);

    })
}

//改變同步ICON的狀態
function checkBtnStatusFroSync(imgName) {

    var syncBtn = checkBtnStatus('sync');

    syncBtn.beforeStyle = { 'background-image': 'url(ToolBar/' + imgName + '.png)' };

    checkBtnChange(syncBtn);

}

//開始測驗跟送出試卷按鈕轉換
function quizBtnToggle() {
    $('#quizAction').toggle()
    $('#quizUpload').toggle()
}

//取得單一註記
function getNote() {
    // if (!$('li.selected').length) {
    //     alert('請選擇註記');
    //     return;
    // }
    // var bookNotesID = $('li.selected')[0].id;
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
    var noteId = tmp.filter(function(x) {
        if (x[0] === 'note') {
            return x;
        }
    });
    if (domain.length && noteId.length) {
        var url = (ReceiveList ? ReceiveList.HostURL : domain[0][1]) + '/api/File/ebookNote/' + noteId[0][1] + '.xml';
        $.ajax({
            type: "GET",
            contentType: "text/xml",
            url: url,
            async: false,
            dataType: "xml",
            //成功接收的function
            success: function(xml) {
                noteSwitch(xml);
                // closeNote();
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log("=====Error=====");
            }
        });
    }
}

//關閉註記切換視窗
function closeNote() {
    $('.note_switch_layout').css('display', 'none');
}

//註記切換
function noteSwitch(xml) {
    Html5WirteLog('Note:' + JSON.stringify(xml2jsonAttributeVer(xml)));
    if (window.DOMParser) {

        txtNote.SaveList = [];
        txtCanvas.SaveList = [];
        colorPen.LineList = [];

        txtCanvas.canvasList = [];
        InsertImg.SaveList = [];

        $(xml).find('ProcedureSlice').each(function() {
            
            var page = xml2jsonAttributeVer(this).page;

            if ($(this).find('UserCreateObjectList').length > 0) {
                $(this).find('UserCreateObjectList').each(function() {

                    if ($(this).find('UserCreateObject').length > 0) {

                        $(this).find('UserCreateObject').each(function() {

                            var ebookjson = {};

                            if($(this).attr('FormatterType') != undefined) {
                                switch ($(this).attr('FormatterType').split('.').pop()) {
                                    //文字、便利貼
                                    case 'StickyObjectFormatter':

                                        switch ($(this).attr('StickyViewType')) {
                                            //文字
                                            case 'stickyText':

                                                ebookjson = {
                                                    page: page,
                                                    id: $(this).attr('Identifier'),
                                                    type: 'txtNote',
                                                    width: $(this).attr('BoundaryPoint.Bounds.Size.Width') + 'px',
                                                    height: $(this).attr('BoundaryPoint.Bounds.Size.Height') + 'px',
                                                    top: Number($(this).attr('BoundaryPoint.Bounds.Location.Y')) + 'px',
                                                    left: Number($(this).attr('BoundaryPoint.Bounds.Location.X')) + 'px',
                                                    value: utf8to16($(this).attr('Contents')),
                                                    StickyViewVisibility: $(this).attr('StickyViewVisibility')
                                                }

                                                if (txtNote.SaveList.length > 0) {
                                                    for (var x = 0; x < txtNote.SaveList.length; x++) {
                                                        if (txtNote.SaveList[x] != undefined) {
                                                            if (txtNote.SaveList[x].id == ebookjson.id) {
                                                                delete txtNote.SaveList[x];
                                                            }
                                                        }
                                                    }
                                                }
                                                    
                                                txtNote.SaveList.push(ebookjson);

                                                break;

                                            //便利貼
                                            case 'stickyDraw':
                                                ebookjson = {
                                                    page: page,
                                                    id: $(this).attr('Identifier'),
                                                    type: 'txtCanvas',
                                                    width: $(this).attr('BoundaryPoint.Bounds.Size.Width') + 'px',
                                                    height: $(this).attr('BoundaryPoint.Bounds.Size.Height') + 'px',
                                                    top: Number($(this).attr('BoundaryPoint.Bounds.Location.Y')) + 'px',
                                                    left: Number($(this).attr('BoundaryPoint.Bounds.Location.X')) + 'px',
                                                    StickyViewVisibility: $(this).attr('StickyViewVisibility'),
                                                    points: FindCanvasPoint($(this).find('IntegerPath'), $(this).attr('Identifier'))
                                                }

                                                // if (txtCanvas.SaveList.length > 0) {
                                                //     for (var x = 0; x < txtCanvas.SaveList.length; x++) {
                                                //         if (txtCanvas.SaveList[x] != undefined) {
                                                //             if (txtCanvas.SaveList[x].id == ebookjson.id) {
                                                //                 delete txtCanvas.SaveList[x];
                                                //             }
                                                //         }
                                                //     }
                                                // }
                                                    
                                                txtCanvas.SaveList.push(ebookjson);
                                                if (ebookjson.points.length > 0) {
                                                    for (var p = 0; p < ebookjson.points.length; p++) {
                                                        txtCanvas.canvasList.push(ebookjson.points[p]);
                                                    }
                                                }

                                                break;

                                        }

                                        break;

                                    //畫筆
                                    case 'BrushObjectFormatter':
                                        var point = $(this).find('Point');

                                        ebookjson = {
                                            id: $(this).attr('Identifier'),
                                            type: 'pen',
                                            object: {
                                                width: FindPenSize(point, $(this).attr('PixelSize'))[0],
                                                height: FindPenSize(point, $(this).attr('PixelSize'))[1],
                                                left: FindPenSize(point, $(this).attr('PixelSize'))[2],
                                                top: FindPenSize(point, $(this).attr('PixelSize'))[3],
                                                penwidth: $(this).attr('PixelSize'),
                                                color: argbToRGB($(this).attr('ForeColor')),
                                                opacity: $(this).attr('Opacity') ? $(this).attr('Opacity') : 1
                                            },
                                            page: page,
                                            points: FindPenSize(point, $(this).attr('PixelSize'))[4]
                                        }

                                        colorPen.LineList.push(ebookjson);
                                        
                                        break;

                                    //註記
                                    case 'MarkObjectFormatter':
                                        ebookjson = {
                                            id: $(this).attr('Identifier'),
                                            page: page,
                                            type: 'mark',
                                            value: $(this).attr('MarkContent')
                                        }
                                        markList.push(ebookjson);
                                        break;

                                    //圖片
                                    case 'InsertImageFormatter':
                                        ebookjson = {
                                            id: $(this).attr('Identifier'),
                                            page: page,
                                            type: 'InsertImg',
                                            width: $(this).attr('BoundaryPoint.Bounds.Size.Width') + 'px',
                                            height: $(this).attr('BoundaryPoint.Bounds.Size.Height') + 'px',
                                            top: Number($(this).attr('BoundaryPoint.Bounds.Location.Y')) + 'px',
                                            left: Number($(this).attr('BoundaryPoint.Bounds.Location.X')) + 'px',
                                            pic: $(this).attr('Picture')
                                        }
                                        InsertImg.SaveList.push(ebookjson);
                                        break;

                                }
                            } else {
                                $('.NoteBox').remove();
                            }
                        })
                    }
                })
            }
        })
    }

    ReplyImage(MainObj.NowPage);
    ReplyMark(MainObj.NowPage);
    ReplyNote(MainObj.NowPage);
    ReplyCanvas(MainObj.NowPage);
    DrawPen(MainObj.NowPage);
}

//取得註記列鰾
function getNotesList() {
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
    var url = ReceiveList.HostURL + '/api/File/ebookNote/list?token=' + ReceiveList.token;
    var x2js = new X2JS();
    var jsonObjTitle = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    var jsonObj = {
        Book: {
            Account: null,
            Identifier: ReceiveList.BookName,
        }
    };
    var xmlAsStr = jsonObjTitle + x2js.json2xml_str(jsonObj).replace(/'/g, '"');
    Html5WirteLog(url);
    $.ajax({
        type: "POST",
        contentType: "text/xml",
        url: url,
        async: false,
        data: xmlAsStr,
        dataType: "xml",
        //成功接收的function
        success: function(res) {
            var list = xml2jsonAttributeVer(res).NoteList.Note;

            if (!list) {
                return;
            }

            $.ajax({
                type: "POST",
                contentType: "text/xml",
                url: list.length ? list[0].path : list.path,
                async: false,
                dataType: "xml",
                //成功接收的function
                success: function(xml) {
                    noteSwitch(xml);
                    // closeNote();
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    Html5WirteLog(JSON.stringify(xhr));
                }
            });

            // if ($('.note_switch_ul').length) {
            //     $('.note_switch_ul').remove();
            // }

            // if (list) {
            //     list.forEach(function(x) {
            //         var ul = document.createElement('ul');
            //         $('.note_switch_cont').append(ul);
            //         $(ul).addClass('note_switch_ul');
            //         var li = document.createElement('li');
            //         li.id = x.bookNotesID;
            //         $('.note_switch_ul').append(li);
            //         var p = document.createElement('p');
            //         p.innerHTML = x.date + '(' + x.author + ')';
            //         $(li).append(p);
            //         var deleteBtn = document.createElement('img');
            //         deleteBtn.src = 'ToolBar/txtclose.png';
            //         $(li).append(deleteBtn);
                    
            //         $(deleteBtn).click(function() {
            //             deleteNotes(x.bookNotesID);
            //         });
    
            //         $(li).click(function() {
            //             if ($('li.selected').length) {
            //                 $('li.selected').removeClass('selected');
            //             }
            //             $(this).addClass('selected');
            //         });
            //     });
            // }

            // $('.note_switch_layout').css('display', 'flex');
        },
        error: function(xhr, ajaxOptions, thrownError) {
            Html5WirteLog(JSON.stringify(xhr));
        }
    });
}

//刪除註記
function deleteNotes(id) {
    confirmShow('是否確定刪除此註記', function(res) {
        if (res) {
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
            if (token) {
                var url = (ReceiveList ? ReceiveList.HostURL : domain[0][1]) + '/api/File/ebookNote?token=' + token[0][1] + '&bookNotesID=' + id;
                $.ajax({
                    type: "DELETE",
                    contentType: "text/xml",
                    url: url,
                    async: false,
                    dataType: "json",
                    //成功接收的function
                    success: function(oXml, xhr) {
                        getNotesList();
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        console.log("=====Error=====");
                    }
                });
            }
        }
    })
}

//送出email
function submitEmail() {
    var emailVal = $('.classhub_email_cont')[0].value;
    var reg = /^.+@.+$/;
    if (!reg.test(emailVal)) {
        alert('請輸入正確E-mail');
        return;
    }
    $.ajax({
        type: "POST",
        contentType: "text/xml",
        url: ReceiveList.HostURL + '/api/File/ebookNote?token=' + ReceiveList.token,
        async: false,
        data: toSyncXML(true),
        dataType: "json",
        //成功接收的function
        success: function(oXml, xhr) {
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: ReceiveList.HostURL + '/api/File/shareLastEbookNote?token=' + ReceiveList.token + '&identifier=' + ReceiveList.BookName + '&classId=' + ReceiveList.ClassID,
                async: false,
                data: JSON.stringify(emailVal),
                dataType: "json",
                //成功接收的function
                success: function(oXml, xhr) {
                    BookAlertShow('已成功寄出E-mail！');
                    closeEmail();
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    Html5WirteLog('shareLastEbookNote error');
                    Html5WirteLog(JSON.stringify(xhr));
                }
            });
        },
        error: function(xhr, ajaxOptions, thrownError) {
            Html5WirteLog('ebookNote error');
            Html5WirteLog(JSON.stringify(xhr));
        }
    });
}

//關閉email視窗
function closeEmail() {
    $('.classhub_email_div').css('display', 'none');
    $('.classhub_email_cont')[0].value = '';
    changeAllBtnToFalse();
}

function discussionSet() {

    $('#discussionDialog').css('display', 'none');
    $('#App_Discuss').css('display', 'block');
    changeDiscussionBtn();
    startDiscussion();
}

function changeDiscussionBtn() {
    $(tempToolBars[0].btns).each(function() {
        if (this.id == 'discuss') {
            this.afterClick = true;
            $('#discuss').css('background-image', this.afterStyle['background-image']);
        }
    });
}

function startDiscussion() {

    isIRS = true;

    //學生開啟分組討論要先取得老師上傳的題目
    if (ReceiveList.UserRole == 1) {
        GetDiscussionImage();
        GalleryStopMove();
    }

    NewCanvas();
    var canvas = $('#canvas')[0];
    canvas.id = 'discussCanvas';
    canvas.width = $(window).width();
    canvas.height = $(window).height();
    $(canvas).css('pointer-events', 'none');
    var cxt = canvas.getContext('2d');

    //當身分為老師或當取得的圖片為空字串時，補上新的討論畫面
    //如果不是為空字串，表示老師有上傳圖片，存到圖片位置DiscussionImage
    if (DiscussionImage != '') {

        var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open('GET', DiscussionImage, true);
        xmlHTTP.responseType = 'arraybuffer';
        xmlHTTP.onload = function(e) {
            try {
                var uInt8Array = new Uint8Array(this.response);
                var i = uInt8Array.length;
                var binaryString = new Array(i);
                while (i--) {
                    binaryString[i] = String.fromCharCode(uInt8Array[i]);
                }
                var data = binaryString.join('');

                var dataURL = "data:image/png;base64," + btoa(data);
            } catch(e) {
                Html5WirteLog(e);
            }

            var img = new Image();
            img.setAttribute('crossOrigin', 'anonymous')  //跨域圖片屬性設置
            img.onload = function() {
                cxt.drawImage(this, 0, 0, canvas.width, canvas.height);
            }
            img.src = dataURL;
        };
        xmlHTTP.send();
    } else {
        var img = new Image();
        img.onload = function() {
            cxt.drawImage(this, 0, 0, canvas.width, canvas.height);
        }
        img.src = 'ToolBar/DiscussionBG.jpg';
    }

}