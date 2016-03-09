angular
    .module('struct.language', ['pascalprecht.translate'])
    .config(configuration)
    .run(['$rootScope', '$http','$filter','$window','$translate', 'ngDialog','localStorageService', runner])

function configuration($translateProvider) {
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.useStaticFilesLoader({
        prefix: 'structure/language/locale_',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en-gb');
};

function runner($rootScope, $http,$filter, $window,$translate,ngDialog,localStorageService) {
    var r = $rootScope;
    r.userLanguage = ($window.navigator.userLanguage || $window.navigator.language).toLowerCase();

    if (r.userLanguage.length == 2)
        r.userLanguage = r.userLanguage + '-' + r.userLanguage;

    r.currentLanguage = localStorageService.get('currentLanguage');
    if (!r.currentLanguage)
        r.currentLanguage = r.userLanguage;

    r.changeLanguage = function (language) {
        $translate.use(language);
        localStorageService.set('currentLanguage',language);
        r.currentLanguage = language;
    };

    $http.get('structure/language/language.json', [])
        .then(getComplete)
        .catch(getFail);

    function getComplete(response) {
        r.language = response.data;
        var local = response.data[r.currentLanguage];
        r.changeLanguage(local.code);
    }

    $http.get('structure/language/languageData.json', [])
        .then(getDataComplete)
        .catch(getFail);

    function getDataComplete(response) {
        r.languageData = response.data;
    }

    function getFail() {
        r.message = 'structure.language.load';
        ngDialog.open({
            template: 'structure/message/message.html',
            scope: r,
            controller: 'messageCtrl',
            className: 'ngdialog-theme-default ngdialog-theme-custom'
        });
    }

    r.langUsable = function (obj, key, value, rowValue) {
        if (value == rowValue  ||  !($filter('getByKey')(obj, key, value)))
            return true;
        return false;
    }

}