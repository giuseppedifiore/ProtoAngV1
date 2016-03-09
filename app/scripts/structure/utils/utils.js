angular
    .module('struct.utils', [])
    .run(['$rootScope', '$http', '$filter', '$interval', runner])
    .filter('getByKey', getByKey)
    .filter('getByDblKey', getByDblKey)
    .filter('getByArray', getByArray)
    .filter('trustAsResourceUrl', ['$sce', trustAsResourceUrl])
    .filter('trustAsHtml', ['$sce', trustAsHtml]);


function runner($rootScope, $http, $filter, $interval) {
    var r = $rootScope;

    r.dateFormat = "dd/MM/yyyy";
    //r.dateFormatSearch = "yyyyMMdd";
    r.dateFormatRest = "yyyy-MM-dd";

    r.messageDef = {action: null, message: null, detail: null, color: null};
    r.alertDef = {action: null, message: null, detail: null, color: null, timelife: 1};
    r.alerts = [];

    $interval(flushAlerts, 5000);

    function flushAlerts() {
        //console.log(angular.toJson(r.alerts));
        var lived=[];
        r.alerts.forEach(function (item) {
            //console.log(item);
            if (item.timelife > 0 || item.color!="success")
                lived.push(item);
            item.timelife--;
            })
        r.alerts=lived;
    }

    $http.get('structure/utils/utils.json')
        .then(getComplete)
        .catch(getFail);


    $http.get('structure/utils/icon.json')
        .then(getIconComplete)
        .catch(getFail);

    function getComplete(response) {
        //r.util = response.data;
        r.state = response.data.state;
        r.action = response.data.action;
        r.messageLevel = response.data.messageLevel;
    }

    function getIconComplete(response) {
        r.icon = response.data.icon;
    }

    function getFail() {
        r.message = 'structure.utils.load';

        ngDialog.open({
            template: 'structure/message/message.html',
            scope: r,
            controller: 'messageCtrl',
            className: 'ngdialog-theme-default ngdialog-theme-custom'
        });
    }

    r.messageInit = function () {
        r.message = angular.copy(r.messageDef);
    };

    r.toParam = function (obj, prefix) {
        //console.log(obj);
        var str = [];
        for (var p in obj) {
            var k = prefix ? prefix + "[" + p + "]" : p,
                v = obj[k];
            str.push(v == '' ? '!' : encodeURIComponent(v));
        }
        return str.join("/");
    };

    r.decodeParam = function (strUrl) {
        //console.log(strUri);
        var urltmp = angular.copy(strUrl);
        if (urltmp && urltmp.indexOf('?') > 0) {
            urltmp = urltmp.substring(urltmp.indexOf('?') + 1);
            urltmp = JSON.parse('{"' + urltmp.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
            // console.log(urltmp);
            return (urltmp);
        }
        return (-1);
    };

    r.stringToDate = function (dateString) {
        // console.log(date);
        var date = new Date()

        if (dateString != undefined) {
            date.setFullYear(dateString.substr(0, 4))
            date.setMonth(dateString.substr(5, 2) - 1)
            date.setDate(dateString.substr(8, 2))
            return $filter('date')(date, r.dateFormat);
        }
        else
            return $filter('date')(date, r.dateFormat);

    };

    r.dateToRest = function (dateString) {
        //console.log(date);
        var date = new Date()

        if (date != undefined) {
            if (typeof dateString === 'string') {
                date.setDate(dateString.substr(0, 2))
                date.setMonth(dateString.substr(3, 2) - 1)
                date.setFullYear(dateString.substr(6, 4))
            }
            else
                date = dateString;

            return $filter('date')(date, r.dateFormatRest);
        }
        else
            return $filter('date')(new Date(), r.dateFormatRest);
    };

    r.findUrl = function (list, field) {
        var url = '';
        if (list != undefined && list.link != undefined) {
            var obj = $filter('getByKey')(list.link, "relation", field);
            if (obj != undefined) url = obj.url;
        }
        return url
    };

}

function getByKey() {
    return function (list, key, value) {
        if (list) {
            var i = 0, len = list.length;
            for (; i < len; i++) {
                //console.log(list[i][key]);
                if (list[i][key] == value) {

                    return list[i];
                }
            }
            return null;
        }
        return null;
    }
}

function getByArray() {
    return function (list, key, value) {
        //console.log(value);
        var i = 0, len = list.length;
        for (; i < len; i++) {
            // console.log(list[i][key]);
            if (list[i][key].join() === value.join()) {

                return list[i];
            }
        }
        return null;
    }
}

function getByDblKey() {
    return function (list, key1, value1, key2, value2) {
        if (list) {
            var i = 0, len = list.length;
            for (; i < len; i++) {
                //console.log(input[i][key]);
                if (list[i][key1] == value1 && list[i][key2] == value2) {
                    return list[i];
                }
            }
            return null;
        }
    }
}

function trustAsResourceUrl($sce) {
    return function (val) {
        return $sce.trustAsResourceUrl(val);
    }
}

function trustAsHtml($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    }
}