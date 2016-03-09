angular
    .module('struct.gui', ['ng.deviceDetector', 'LocalStorageModule'])
    .factory('guiSrv', ['$rootScope', '$http', 'ngDialog', 'localStorageService', '$window', 'deviceDetector', guiSrv])
    .controller('guiCtrl', ['guiSrv', guiCtrl]);

function guiCtrl(guiSrv) {
    var gui = this;
    gui.gs = guiSrv;
}

function guiSrv($rootScope, $http, ngDialog, localStorageService, $window, deviceDetector) {
    var r = $rootScope;
    var gs = this;
    var lss=localStorageService;
    gs.color = [];
    gs.font = [];
    gs.theme = [];
    gs.desk = [];
    gs.template = [];
    gs.simulateDevice = [];
    gs.deexEngine = [];

    var service = {
        color: function () {
            return gs.color
        },
        font: function () {
            return gs.font
        },
        theme: function () {
            return gs.theme
        },
        desk: function () {
            return gs.desk
        },
        template: function () {
            return gs.template
        },
        simulateDevice: function () {
            return gs.simulateDevice
        },
        deexEngine: function () {
            return gs.deexEngine
        },
        changeTheme: changeTheme,
        changeColor: changeColor,
        changeFont: changeFont,
        changeDesk: changeDesk,
        changeTemplate: changeTemplate,
        advancedGui: advancedGui,
        changeDeex: changeDeex,
        enableDeex: enableDeex,
        getDeex: getDeex,
        getPageName: getPageName,
        getDeexSimul: getDeexSimul,
        changeSimulateDevice: changeSimulateDevice
    }

    $http.get('structure/gui/gui.json', [])
        .then(getComplete)
        .catch(getFail);

    function getComplete(response) {
        gs.color = response.data.color.list;
        r.currentColor = lss.get('currentColor') || {code:response.data.color.default};

        gs.font = response.data.font.list;
        r.currentFont = lss.get('currentFont') || {code:response.data.font.default};

        gs.desk = response.data.desk.list;
        r.currentDesk = lss.get('currentDesk') || {code:response.data.desk.default};

        gs.theme = response.data.theme.list;
        r.currentTheme = lss.get('currentTheme') || {code:response.data.theme.default};

        gs.template = response.data.template.list;
        r.currentTemplate = lss.get('currentTemplate') || {code:response.data.template.default};

        r.currentDevice = deviceDetector;

        r.prevSettings = lss.get('prevSettings') || {"theme": "", "color": "", "font": ""};

        gs.simulateDevice = response.data.simulateDevice.list;
        r.currentSimulateDevice = lss.get('currentSimulateDevice') || gs.simulateDevice[0];

        gs.deexEngine = response.data.deexEngine.list;
        r.currentDeex = lss.get('currentDeex');
        r.deexEnabled = lss.get('deexEnabled');

        if ((getDeexSimul() && !r.deexEnabled) ||
            (!getDeexSimul() && r.deexEnabled)) {
            enableDeex(r.deexEnabled);
        }

        changeDeex(gs.deexEngine[getDeex(r.deexEnabled)]);
        if (r.deexEnabled && r.currentSimulateDevice) changeSimulateDevice(r.currentSimulateDevice);
    }

    function getFail() {
        r.message = 'structure.gui.load';
        ngDialog.open({
            template: 'structure/message/message.html',
            scope: r,
            controller: 'messageCtrl',
            className: 'ngdialog-theme-default ngdialog-theme-custom'
        });
    }

    function changeTheme(theme) {
        r.currentTheme = theme;
        lss.set('currentTheme', r.currentTheme);
        changeColor(gs.color[theme.color]);
        changeFont(gs.font[theme.font]);
    }

    function prevSettings(theme, color, font) {
        r.prevSettings.theme = theme;
        r.prevSettings.color = color;
        r.prevSettings.font = font;
        lss.set('prevSettings', r.prevSettings);
    }

    function changeColor(color) {
        //console.log(color);
        r.currentColor = color;
        lss.set('currentColor', r.currentColor);
    }

    function changeFont(font) {
        //console.log(font);
        r.currentFont = font;
        lss.set('currentFont', r.currentFont);
    }

    function changeDesk(desk) {
        r.currentDesk = desk;
        lss.set('currentDesk', r.currentDesk);
    }

    function changeTemplate(template) {

        var url = '';
     //   console.log(r.currentTemplate.code);
      //  console.log($window.parent.location.href);
        if (getDeexSimul())
            url = $window.parent.location.href;
        else
            url = $window.location.href;

        var currentPage = getPageName(url);
        url = url.replace(currentPage, template.code);

        if (getDeexSimul())
            $window.parent.location.href = $window.location.href;
        else
            $window.location.href = url;

        r.currentTemplate = angular.copy(template);
        lss.set('currentTemplate', r.currentTemplate);

    }

    function getDeexSimul() {
        return getPageName($window.parent.location.href) != getPageName($window.location.href)
    }

    function changeDeex(deexEngine) {
        //console.log(deexEngine)
        //console.log(r.currentDevice);
        r.currentDeex = deexEngine;
        lss.set('currentDeex', r.currentDeex);

        if ((deexEngine.code == "os" && r.currentDevice.os == "android")
            || (deexEngine.code == "browser" && r.currentDevice.browser == "chrome" )) {
            changeTheme(gs.theme[1]);
        }

        if ((deexEngine.code == "os" && r.currentDevice.os == "ios" || r.currentDevice.os == "mac")
            || (deexEngine.code == "browser" && r.currentDevice.browser == "safari" )) {
            changeTheme(gs.theme[2]);
        }

        if ((deexEngine.code == "os" && r.currentDevice.os == "windows")
            || (deexEngine.code == "browser" && r.currentDevice.browser == "ie" )) {
            changeTheme(gs.theme[3]);
        }

        if ((deexEngine.code == "os" && r.currentDevice.os == "linux")
            || (deexEngine.code == "browser" && r.currentDevice.browser == "firefox")) {
            changeTheme(gs.theme[4]);
        }

        if (deexEngine.code == "") {
            var color = r.currentColor;
            var font = r.currentFont;
            changeTheme(gs.theme[0]);
            if (!r.deexEnabled) {
                changeColor(color);
                changeFont(font);
            }

        }
    }

    function enableDeex(deexEnabled) {
        if (deexEnabled) {
            //console.log(r.currentColor);
            prevSettings(r.currentTheme, r.currentColor, r.currentFont);
        }
        else {
            changeTheme(r.prevSettings.theme);
            changeColor(r.prevSettings.color);
            changeFont(r.prevSettings.font);
        }
        changeTemplate(gs.template[getDeex(deexEnabled)]);
    }


    function getDeex(deexEnabled) {
        lss.set('deexEnabled', deexEnabled);
        return deexEnabled ? 1 : 0
    }

    function getPageName(url) {
        var href = angular.copy(url);
        href = href.substring(0, href.indexOf('.htm')).split("/");
        return href[href.length - 1];
    }

    function advancedGui() {
        var dialog = ngDialog.open({
            template: 'structure/gui/guiPanel.html?',
            controller: 'guiCtrl as gui',
            className: 'ngdialog-theme-default deexWidth800',
            scope: r
        })
    }

    function changeSimulateDevice(simulateDevice) {

        var iframe = $window.parent.document.getElementById("iframe").classList;
        if (iframe.contains('deexDesktop'))
            iframe.remove('deexDesktop');
        if (iframe.contains('deexTablet'))
            iframe.remove('deexTablet');
        if (iframe.contains('deexMobile'))
            iframe.remove('deexMobile');

        iframe.add('deex' + simulateDevice.name);

        r.currentSimulateDevice = angular.copy(simulateDevice);
        lss.set('currentSimulateDevice', r.currentSimulateDevice);
    }

    return service;
}