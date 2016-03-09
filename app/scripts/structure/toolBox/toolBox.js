angular
    .module('struct.toolBox', [])
    .factory('toolBoxSrv', ['$rootScope', 'vsSrv','ngDialog', toolBoxSrv])
    .controller('toolBoxCtrl', ['$scope', 'toolBoxSrv', toolBoxCtrl]);

function toolBoxCtrl($scope, toolBoxSrv) {
    var tb = this;
    var s = $scope;
    tb.tb = toolBoxSrv;
    tb.button = tb.tb.getButton();
    var item='';
    var action='';
    //console.log();
}

function toolBoxSrv($rootScope,vsSrv, ngDialog) {
    var r = $rootScope;
    var currentPage;
    var vss=vsSrv;
    var obj;

    var service = {
        setPage: setPage,
        setObj: setObj,
        getObj: getObj,
        getButton: getButton,
        downloadJson: downloadJson,
        downloadLanguage: downloadLanguage,
        updloadConcept: updloadConcept,
        deleteAll: deleteAll
    };

    function setPage(page) {
        currentPage = r.toolBox[page];
        //console.log(page);
    }

    function setObj(item) {
        obj = item;
    }

    function getObj() {
        return obj;
    }

    function getButton() {
        return currentPage;
    }

    function downloadJson( filename) {
        var data=getObj();
        if (!data) {
            console.error('No data'); /// aggiungere localizzazione e form di alert
            return;
        }
        if (!filename) {
            filename = 'download.json';
        }
        if (typeof data === 'object') {
            data = JSON.stringify(data, undefined, 2);
        }
        var blob = new Blob([data], {type: 'text/json'}),
            e = document.createEvent('MouseEvents'),
            a = document.createElement('a');

        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initMouseEvent('click', true, false, window,
            0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
    }

    function downloadLanguage(filename) {
        var data=getObj();
        if (!data) {
            console.error('No data');
            return;
        }
        if (!filename) {
            filename = 'language.json';
        }
        if (typeof data === 'object') {
            var language={};
            angular.forEach(data.codeSystem.concept, function(item){
                language[item.code]=item.designation[0].value;
            })
            language = JSON.stringify(language, undefined, 2);
        }
        var blob = new Blob([language], {type: 'text/json'}),
            e = document.createEvent('MouseEvents'),
            a = document.createElement('a');

        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initMouseEvent('click', true, false, window,
            0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
    }

    function updloadConcept() {
        //console.log('operazione effettuata');
       /* var dialog = ngDialog.open({
            template: 'structure/uploadFile/upload.html',
            controller: "fileUploadLanguageCtrl as fc",
            scope: r,
            className: 'ngdialog-theme-default ngdialog-theme-custom'
        });
        dialog.closePromise.then(function () {
        });
        setObj(obj);*/
    }

    function updloadConcept() {
        //console.log('operazione effettuata');
        var dialog = ngDialog.open({
            template: 'structure/uploadFile/upload.html',
            controller: "fileUploadJsonCtrl as fc",
            scope: r,
            className: 'ngdialog-theme-default ngdialog-theme-custom'
        });
        dialog.closePromise.then(function () {
        });
        setObj(obj);
    }

    function deleteAll() {
        ngDialog.openConfirm({
            template: 'structure/message/confirmation.html',
            className: 'ngdialog-theme-default ngdialog-theme-custom'
        }).then(function () {
            vss.removeAll(obj).then(r.disableButton = false);
        });
    }

    return service;
}

