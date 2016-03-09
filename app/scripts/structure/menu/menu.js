/**
 * Created by giuseppe.difiore on 01/03/2016.
 */
angular
    .module('sbAdminApp', ['LocalStorageModule'])
    .factory('menuSrv', ['localStorageService', '$http', '$q', '$filter', menuSrv])
    .directive('menu',['menuSrv',menu]);

function menuSrv(localStorageService, $http, $q, $filter) {
    var lss = localStorageService;
    this.roles = null;
    var roleObj = lss.get('currentRole') || '';
    this.currentRole = null;

    var defaultRoles = [{"role": "OP"},{"role": "UsersAdmins"},{"role": "ME"}];

    var service = {
        setRoles: setRoles,
        roles: this.roles,
        setRole: setRole,
        currentRole: this.currentRole
    };

    function setRoles(obj) {
        console.log(obj);
        if (!obj)
            obj=angular.copy(defaultRoles);
        console.log(obj);
        angular.forEach(obj, function (item) {
            retriveMenu(item).then(function (response) {
                item.menu = response;
            })
        })
        this.roles = obj;
        this.currentRole = obj[0];
    }

    function setRole(item) {
        //console.log(item)
        if (item) {
            roleObj = $filter('getByKey')(this.roles, "role", item);
            this.currentRole = roleObj;
            lss.set('currentRole', this.currentRole);
        }
        else {
            console.log(this.currentRole);
            if (this.currentRole)
                roleObj = this.currentRole;
            else if (this.roles) {
                roleObj = this.roles[0];
                console.log(angular.toJson(this.roles));

                console.log(this.roles[0]);
                roleObj.menu.isCollapsed = false;
                this.currentRole = angular.copy(roleObj);
            }
        }
    }

    function retriveMenu(item) {
        //var menu=roleObj.menu;
        if (!item.menu) {
            return $http.get('/script/structure/menu/menu' + item.role + '.json')
                .then(function (response) {
                    return response.data;
                });
        }
        else return $q.when(item.menu);
    }

    return service
}

function menu(menuSrv) {
    return {
        templateUrl: 'scripts/structure/menu/menu.html',
        restrict: 'E',
        replace: true,
        scope: {},
        controller: menuCtrl(menuSrv)
    }

    function menuCtrl(menuSrv) {
        console.log('pippo');
        var mc = this;
        mc.ms = menuSrv;
        //mc.roles = mc.ms.getRoles();
        //mc.ms.setRole()
    }
};
