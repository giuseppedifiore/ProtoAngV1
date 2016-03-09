angular
    .module('struct.session', ['LocalStorageModule'])
    .factory('sessionSrv', ['$location', 'localStorageService', sessionSrv])
    .controller('sessionCtrl', ['sessionSrv', sessionCtrl]);

function sessionCtrl(sessionSrv) {
    var sc = this;
    sc.ss = sessionSrv;
}

function sessionSrv($location, localStorageService) {
    var lss = localStorageService;
    var sessionMax = 6;
    var element = {"url": "", "label": "", "icon": ""};
    var objInit = {"id": 0, "element": []};
    objInit.element.push(angular.copy(element));
    var sessionObj = lss.get('sessionObj') || objInit;

    //console.log(session);

    var service = {
        setSession: setSession,
        getSession: getSession,
        changeSession: changeSession,
        cloneSession: cloneSession,
        getSessionObj: getSessionObj,
        dropSession: dropSession,
        dropAllSession: dropAllSession
    };

    function getSessionObj() {
        return sessionObj;
    }

    function cloneSession() {
        //console.log('clone');
        if (sessionObj.element.length < sessionMax) {
            var item = angular.copy(sessionObj.element[sessionObj.id]);
            sessionObj.element.push(item);

            sessionObj.id = sessionObj.element.length - 1;
            saveSession();
            /*console.log('add');
             console.log(sessionObj);*/
        }
    }

    function getSession() {
        //console.log('get');
        //console.log(sessionObj);
        if (sessionObj.element[sessionObj.id]) {
            return sessionObj.element[sessionObj.id];
        }
        else {
            return element;
        }

    }

    function addSession() {
        //console.log('add');
        sessionObj.element.push(angular.copy(element));
        sessionObj.id++;
    }

    function setSession(url, string, icon) {
        //console.log('set');
        if (!sessionObj.element)
            addSession();

        if (!url) {
            url = angular.copy($location.$$path.substring(1));
        }

        if (!string)
            if (sessionObj.element[sessionObj.id].label)
                string = sessionObj.element[sessionObj.id].label;
            else
                string = 'undefined';

        if (!icon)
            if (sessionObj.element[sessionObj.id].icon)
                icon = sessionObj.element[sessionObj.id].icon;
            else
                icon = '';

        var item = sessionObj.element[sessionObj.id];
        //console.log(item);
        //console.log(url);
        item.url = url;
        item.label = string;
        item.icon = icon;

        saveSession();
        /*console.log('set');
         console.log(sessionObj);*/

    }

    function changeSession(index) {
        sessionObj.id = index;
        saveSession();
        return (sessionObj.element[sessionObj.id]).url;
        // return (session[index]);

    }

    function dropSession(index) {
        // console.log(index)
        sessionObj.element.splice(index, 1);
        saveSession();
        /*console.log('drop');
         console.log(sessionObj);*/

    }

    function dropAllSession() {
        sessionObj.element.splice(0, sessionObj.id);
        sessionObj.element.splice(1, sessionObj.element.length - 1);
        sessionObj.id = 0;
        saveSession();
        /*console.log('dropAll');
         console.log(sessionObj);*/
    }

    function saveSession() {
        lss.set('sessionObj', sessionObj);
    }

    return service;
};