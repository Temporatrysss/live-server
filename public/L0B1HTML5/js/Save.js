//儲存





var saveData = [],
    id = -1;

function SaveAll() {

    saveData = [];

    PushtoSaveData(colorPen.LineList); //畫筆
    PushtoSaveData(txtCanvas.SaveList); //便利貼
    PushtoSaveData(txtNote.SaveList); //文字便利貼

    if (ToolBarList.TapList.length > 0) {
        for (var t = 0; t < ToolBarList.TapList.length; t++) {
            if(ToolBarList.TapList[t]) {
                var tapList = {
                    type: 'tap',
                    page: t
                }
                saveData.push(tapList);
            }
        }
    }

    console.log(saveData);

    deleteItem();
    bookContent = { "Content": saveData };
    // saveItem(BookList.EBookID, bookContent['Content']);
    saveItem(location.pathname.split('/')[4], bookContent['Content']);
}

//儲存所有物件至saveData
function PushtoSaveData(list) {
    if (list.length > 0) {
        for (var i = 0; i < list.length; i++) {
            if (list[i] != undefined) {
                saveData.push(list[i]);
            }
        }
    }
}

function deleteItem() {
    var transaction = db.transaction("ebook", "readwrite");
    var objectStore = transaction.objectStore("ebook");
    var request = objectStore.clear(id);

    request.onsuccess = function(evt) {
        // alert("id:" + id + "刪除成功"); 
        console.log('DELETE:' + id);
        reCreateDB();
    };

    request.onerror = function(evt) {
        console.log("IndexedDB error: " + evt.target.errorCode);
        reCreateDB();
    };

}

function saveItem(guid, content) {
    var transaction = db.transaction("ebook", "readwrite");
    var objectStore = transaction.objectStore("ebook");

    var BookID = guid;
    //var Content = {a: guid + '1', b: guid + '2', c: guid + '3'};
    var Content = content;
    //alert('id : '+BookID);
    //alert('content : '+Content);
    var request = objectStore.add({ "BookID": BookID, "Content": Content });
    //var request = objectStore.add({ "BookID": BookID, "Content": JSON.parse(Content)}); 

    request.onsuccess = function(evt) {
        // alert('資料儲存成功！');
    };
    request.onerror = function(evt) {
        console.log("IndexedDB error: " + evt.target.errorCode);

    };
}

function getItem(guid) {

    if (typeof(db) == 'undefined') {
        reCreateDB();
    }
    setTimeout(function() {
        //ssalert('come in');

        var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

        if (indexedDB == undefined) {
            return;
        }
        var transaction = db.transaction("ebook", "readwrite");
        var objectStore = transaction.objectStore("ebook");
        var index = objectStore.index("BookID");

        //var request = objectStore.openCursor(IDBCursor.NEXT);
        var request = index.get(guid);
        var size = '';

        request.onsuccess = function(evt) {
            var cursor = evt.target.result;
            if (cursor) {

                id = cursor.id;
                console.log("BookID : " + cursor.BookID);
                console.log("Content : " + JSON.stringify(cursor.Content) + "," + JSON.stringify(cursor.Content).length);
                loadSaveObj(cursor.Content);
                //loadSaveObj(JSON.stringify(cursor.Content));
                // getAllLength();
            } else {
                //查詢結束  
                loadSaveObj('');

            }
        };

        request.onerror = function(evt) {
            console.log("IndexedDB error: " + evt.target.errorCode);

        };
    }, 1000);
}

function reCreateDB() {
    //indexDB
    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

    if (indexedDB == undefined) {
        return;
    }

    var request = indexedDB.open("ebook", 1); //db name
    request.onsuccess = function(evt) {
        // 將db暫存起來供以後操作
        db = request.result;

    };

    request.onerror = function(evt) {
        console.log("IndexedDB error: " + evt.target.errorCode);
    };


    request.onupgradeneeded = function(evt) {
        var objectStore = evt.currentTarget.result.createObjectStore("ebook", { keyPath: "id", autoIncrement: true }); //table name

        objectStore.createIndex("BookID", "BookID", { unique: true });
        objectStore.createIndex("Content", "Content", { unique: false });

    };
}

//讀取存在indexdb的資料，並insert至各自的List裡，並先生出第一頁的物件
function loadSaveObj(json) {

    if (json != '') {

        txtCanvas.canvasList = [];
        for (var i = 0; i < json.length; i++) {

            switch (json[i].type) {

                case 'pen':

                    colorPen.LineList.push(json[i]);
                    break;

                case 'txtCanvas':

                    txtCanvas.SaveList.push(json[i]);

                    if (json[i].points.length > 0) {
                        for (var p = 0; p < json[i].points.length; p++) {
                            txtCanvas.canvasList.push(json[i].points[p]);
                        }
                    }
                    break;

                case 'txtNote':

                    txtNote.SaveList.push(json[i]);
                    break;

                case 'tap':

                    ToolBarList.TapList[json[i].page] = true;
                    break;
            }
        }

        DrawPen(0);
        ReplyCanvas(0);
        ReplyNote(0);
        if (ToolBarList.TapList[0]) {
            tapLayer();
        }

    }

}
