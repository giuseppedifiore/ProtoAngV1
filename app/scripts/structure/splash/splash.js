angular
    .module('struct.splash', ['LocalStorageModule'])
    .run(['$rootScope', 'ngDialog', 'localStorageService', runner]);

function runner($rootScope,  ngDialog, localStorageService) {
    var r=$rootScope;
    r.splash = function splash () {
        r.noSplash = false;
        if (localStorageService.get('noSplash'))
            r.noSplash = localStorageService.get('noSplash');
        //console.log(r.noSplash);
        if (!r.noSplash)
            ngDialog.openConfirm({
                template: 'structure/splash/splash.html',
                className: 'ngdialog-theme-default ngdialog-theme-custom'
            }).then(function (value) {
                //console.log(value);
                if (value) {
                    localStorageService.set('noSplash', value);
                }
            });
    }
}