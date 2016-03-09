'use strict';
angular
    .module('struct.upload', [])
    .controller('fileUploadCtrl', ['$http', '$scope', 'ngDialog', fileUploadCtrl])
    .controller('fileUploadJsonCtrl', ['$http', '$scope', 'toolBoxSrv', 'ngDialog', fileUploadJsonCtrl])

function fileUploadCtrl($http, $scope, ngDialog) {
    var fc = this;
    var s = $scope;
    fc.uploaded = false;
    fc.uploadFile = function ($flow) {
        ngDialog.openConfirm({
            template: 'structure/message/confirmationUpdate.html',
            controller: 'messageCtrl',
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            scope: $scope
        }).then(function (value) {
            //console.log(value);
            if (value) {
                $http.post(s.uploadUrl, $flow.files[0].file, {
                    withCredentials: true,
                    headers: {accept: 'application/xls', 'Content-Type': 'application/xls'},
                    transformRequest: angular.identity
                }).success(operationSuccess).error(operationError);
            }
        }, function (reason) {
            s.disableButton = false;
        });
    };

    function operationSuccess() {
        s.messageInit();
        fc.uploaded = true;
        s.message.message = 'item.valueSet.success.upload';
        //console.log(s.message);
        s.message.color = angular.copy(s.messageLevel.success.color);
        //console.log(s.message);
        //console.log('operazione effettuata');
    }

    function operationError(data) {

        s.messageInit();
        s.message = 'item.valueSet.error.upload';
        if (!angular.isUndefinedOrNull(data.issue[0].details))
            s.message.details = data.issue[0].details;
        s.message.color = angular.copy(s.messageLevel.error.textColor);

        //console.log('operazione in errore');

    }
}

function fileUploadJsonCtrl($http, $scope, toolBoxSrv, ngDialog) {
    var fc = this;
    var tb = toolBoxSrv;
    var s = $scope;
    fc.uploaded = false;

    fc.uploadFile = function ($flow) {
        angular.forEach($flow.files, function (flowFile, i) {
            var fileReader = new FileReader();
            fileReader.onload = function (event) {
                overrideVs(event);
            };
            fileReader.readAsDataURL(flowFile.file);
        });

    }

    function overrideVs(event) {
        var fileObj = event.target.result.split(",");
        console.log(fileObj);
        if (fileObj[0] && fileObj[0].split(";")[1] == 'base64') {
        console.log(fileObj[0].split(";")[1]);
            var vsLoad = JSON.parse(atob(fileObj[1]));
            var vsCurrent = tb.getObj()
            //console.log(vsLoad);
            //console.log(vsCurrent);
            if (vsCurrent && vsLoad) {
                //s.setTilte = 'structure.confirmation.confirmUpdate.label';
                //s.message = 'structure.confirmation.messageUpdate.label';
                ngDialog.openConfirm({
                    template: 'structure/message/confirmationUpdate.html',
                    controller: 'messageCtrl',
                    className: 'ngdialog-theme-default ngdialog-theme-custom',
                    scope: $scope
                }).then(function (value) {
                    //console.log(value);
                    if (value) {
                        vsCurrent.codeSystem = vsLoad.codeSystem;
                        var resourceParams = {'_id': vsCurrent.id};
                        console.log(vsCurrent);
                        vsCurrent.$update(resourceParams, operationSuccess, operationError);
                    }
                }, function (reason) {
                    s.disableButton = false;
                });
            }
        }
    }

    function operationSuccess() {
        s.messageInit();
        fc.uploaded = true;
        s.message.message = 'item.valueSet.success.upload';
        //console.log(s.message);
        s.message.color = angular.copy(s.messageLevel.success.color);
    }

    function operationError(data) {
        s.messageInit();
        s.message = 'item.valueSet.error.upload';
        if (!angular.isUndefinedOrNull(data.issue[0].details))
            s.message.details = data.issue[0].details;
        s.message.color = angular.copy(s.messageLevel.error.textColor);
        //console.log('operazione in errore');

    }
}