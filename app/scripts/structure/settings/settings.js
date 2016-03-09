angular
    .module('sbAdminApp', [])
    .factory('settingsSrv', ['$rootScope', 'costantsUser', settingsSrv])
    .constant("costantsUser", {
        "app": "../x1v1-mci-web",
        "user": "/rest/getUser"
    });

function settingsSrv($rootScope, costantsUser) {
    var cu = costantsUser;
    var r = $rootScope
   // var o2 = outh2Srv;
    var connection;
    var outh2Url = '';
    var userSettings = '';
    var defaults = '';
    var settings = '';
    var getUserUrl = cu.app + cu.user;
    var userRest = $resource(getUserUrl + '/', {});
    var internalSettings = '';
    var service = {
        init: init,
        getDefault: getDefault,
        getConnection: getConnection,

    }

    function init() {
        console.log('pippo');
        return true;
        /*return loadSettings()
            .then(getUserData)
            .then(initSettings)
            .then(initConnection);/*
    }

    function getDefault() {
        return defaults
    }

    function getConnection() {
        return connection
    }

    function loadSettings() {
        //console.log(internalSettings);
        if (!internalSettings) {
            //console.log("load internalSettings")
            return $http.get('structure/settings/settings.json')
                .then(getFileSuccess)
                .catch(getFileFail);
        }
        else return $q.when(internalSettings);
    }

    function getFileSuccess(file) {
        internalSettings = file.data
        return internalSettings;
    }

    function getFileFail() {
        return 'structure.settings.load';
    }

    function getUserData() {
        //console.log(userSettings);
        if (!userSettings) {
            //console.log("load userSettings")
            return userRest.get(getUserSuccess, getUserFail).$promise.then(function (value) {
                //console.log(value);
                return value
            });
        }

    }

    function getUserSuccess(user) {
        //console.log(user);
        userSettings = user;
        return userSettings;
    }

    function getUserFail() {
    }

    function initSettings() {
        //console.log(settings);
        if (!settings) {
            //console.log(userSettings);
            if (userSettings.settings) angular.extend(internalSettings.getUser.settings.connection, userSettings.settings.connection);
            if (userSettings.settings) angular.extend(internalSettings.getUser.settings._custom, userSettings.settings._custom);

            //console.log(internalSettings);
            settings = internalSettings;

            angular.extend(settings.connection, settings.getUser.settings.connection);
            settings.default._custom = settings.getUser.settings._custom;
            settings.default.outh2 = settings.default._custom.outh2;
            connection = settings.connection;
            r.default = defaults = settings.default;
            //console.log(r.default);
            r.toolBox = settings.toolBox;
            //console.log(settings.getUser.roles);

            var roles = settings.getUser.roles;

           /* if (defaults.outh2 && connection.outh2) {
                outh2Url = connection.outh2;
                return o2.setEnabledOnUrl(outh2Url);
            } else*/
          /*      return true;
        } else
            return true;*/

    }

    function initConnection() {
        if (!r.server) {
            r.server = connection.server;
            r.serverFhir = r.server + outh2Url + connection.fhir;
            //r.serverFhir_prec = r.server + outh2Url + connection.fhir_prec;
            //r.serverFhir = connection.serverFhirTest;

            r.userRest = r.serverFhir + connection.user;
            r.valueSetRest = r.serverFhir + connection.valueSetRest;
            r.conceptMapRest = r.serverFhir + connection.conceptMapRest;
            r.dataElementRest = r.serverFhir + connection.dataElementRest;
            r.practitionerRest = r.serverFhir + connection.practitionerRest;
            r.locationRest = r.serverFhir + connection.locationRest;
            r.patientRest = r.serverFhir + connection.patientRest;
            r.organizationRest = r.serverFhir + connection.organizationRest;

            // servizi non Fhir
            r.serverService = r.server + outh2Url + connection.service;
            r.conceptRestUpload = r.serverService + connection.conceptRestUpload; //servizio upload concept
            r.notifyRestFind = r.serverService + connection.notifyRestFind;
            r.notifyRestSubscribe = r.serverService + connection.notifyRestSubscribe;
            r.notifyRestValueSet = r.serverService + connection.notifyRestValueSet;

            //risorse primarie
            r.resourceBundle = $resource(r.serverFhir);
            r.resourceValueSet = $resource(r.valueSetRest + '/:_id', {}, {update: {method: 'PUT'}});
            r.resourceConceptMap = $resource(r.conceptMapRest + '/:_id', {}, {update: {method: 'PUT'}});
            r.resourceDataElement = $resource(r.dataElementRest + '/:_id', {}, {update: {method: 'PUT'}});
            r.resourcePractitioner = $resource(r.practitionerRest + '/:_id', {}, {update: {method: 'PUT'}});
            r.resourceLocation = $resource(r.locationRest + '/:_id', {}, {update: {method: 'PUT'}});
            r.resourceOrganization = $resource(r.organizationRest + '/:_id', {}, {update: {method: 'PUT'}});
            r.resourcePatient = $resource(r.patientRest + '/:_id', {}, {update: {method: 'PUT'}});
            r.resourceNotifyFind = $resource(r.notifyRestFind + '/:_id', {}, {update: {method: 'PUT'}});
            //r.resourceNotify = $resource(r.notifyRestSubscribe + '/:_id', {}, {update: {method: 'PUT'}});

            // Label for Structure
            var structureValueSet = r.default.structureValueSet;
            if (structureValueSet.language.id) {
                r.languageVsParams = {'_id': structureValueSet.language.id};
                r.languageVsMaster = r.resourceValueSet.get(r.languageVsParams, function () {
                });
            }

            console.log(r.default);
            console.log(r.default.mciValueSet);
            var mciValueSet = r.default.mciValueSet;

            if (r.default._custom.active)
                mciValueSet = r.default._custom.mciValueSet;
            //console.log(mciValueSet);
            // Risorse tramite ValueSet
            if (mciValueSet.department.id) {
                r.departmentVsParams = {'_id': mciValueSet.department.id};
                r.departmentVsMaster = r.resourceValueSet.get(r.departmentVsParams, function () {
                });
            }
            /*else if (mciValueSet.department.system && masterValueSet.department.value) {
             var departmentVsParams = {'identifier': mciValueSet.department.system + '|' + masterValueSet.department.value};
             r.departmentVsMaster = r.resourceValueSet.get(departmentVsParams, function (data) {
             var departmentVsParams = {'_id': data.entry[0].resource.id};
             r.departmentVsMaster = r.resourceValueSet.get(departmentVsParams, function () {
             console.log(r.departmentVsMaster);
             }, getFail);
             }, getFail);
             }*/

            if (mciValueSet.hospital.id) {
                r.hospitalVsParams = {'_id': mciValueSet.hospital.id};
                r.hospitalVsMaster = r.resourceValueSet.get(r.hospitalVsParams, function () {
                });
            }
            //r.hospitalVsParams = {'identifier': mciValueSet.hospital.system+'|'+masterValueSet.hospital.value};

            if (mciValueSet.municipalities.id) {
                r.municipalitiesVsParams = {'_id': mciValueSet.municipalities.id};
                r.municipalitiesVsMaster = r.resourceValueSet.get(r.municipalitiesVsParams, function () {
                });
            }

            /*r.practitionerVsParams = {'_id': response.data.default.mciValueSet.practitioner};
             r.practitionerVsMaster = r.resourceValueSet.get(r.practitionerVsParams,function(){},getFail);*/

            //--- mpi Settings
            var cn = settings.connection.mpi;
            var srv = cn.server
            //srv = cn.serverTest;
            var srvMpi = srv + cn.service;
            r.domainRest = srvMpi + cn.domainRest;
            r.schedulerRest = srvMpi + cn.schedulerRest;
            r.subscriberRest = srvMpi + cn.subscriberRest;
            return true;
        }
        else return true;
    }


    return service;
}