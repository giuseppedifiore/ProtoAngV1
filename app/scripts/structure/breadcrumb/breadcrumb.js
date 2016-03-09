angular
    .module('struct.breadcrumb', ['ng-breadcrumbs', 'LocalStorageModule'])
    .run(['$rootScope', '$location', 'breadcrumbs', 'sessionSrv', runner]);

function runner($rootScope, $location, breadcrumbs, sessionSrv) {
    var r = $rootScope;
    var ss = sessionSrv;
    r.breadcrumbs = breadcrumbs;

    r.goSession = function (session) {
        //console.log(session);
        r.go(session.url,session.label,session.icon)
    };

    r.go = function (path, label, icon) {
        //console.log(path);
        //console.log(label);
        ss.setSession(path, label, icon)
        $location.path(path);
    };

    r.goBack = function () {
        //console.log('back!!')
        var icon='';
        var br = r.breadcrumbs.breadcrumbs[r.breadcrumbs.breadcrumbs.length - 2];
        //ss.setSession(br.path, br.label, icon);
        r.go(br.path, br.label,icon);
    };

    r.goTo = function (path, page, param, icon) {
        var finalurl = r.saveStatus(page, param) + path;
        $location.path(finalurl.toString());
        //console.log($location.absUrl());

        var temp = angular.copy(path.substring(1));
        temp = temp.substring(0, temp.indexOf('/'));
        //console.debug(temp);
        ss.setSession(finalurl.toString(), temp, icon);
    }

    r.saveStatus = function (page, param) {
        var pathCrumb = '';
        var paramCrumb = '';
        var bc = angular.copy(r.breadcrumbs.get());

        if (bc) {
            var len = bc.length;
            if (len > 0)
                pathCrumb = bc[len - 1].path;
        }

        if (param && pathCrumb) {

            pathCrumb = pathCrumb.substr(0, pathCrumb.lastIndexOf(page) + page.length + 1);
            if (param)
                paramCrumb = angular.copy(r.toParam(param));
        }
        //console.log(paramCrumb);
        var finalurl = pathCrumb + paramCrumb;
        ss.setSession(finalurl, null, null);
        return finalurl
    }

    r.goSession(ss.getSession());
    //r.go(ss.getSession());
    //console.log(r.currentUrl)
}