angular
    .module('struct.menu', ['LocalStorageModule'])
    .factory('menuSrv', ['localStorageService', '$http', '$q', '$filter', menuSrv])
    .controller('menuCtrl', ['menuSrv', menuCtrl]);

function menuCtrl(menuSrv) {
    var mc = this;
    mc.ms = menuSrv;
    //mc.roles = mc.ms.getRoles();
    //mc.ms.setRole()

    mc.selectedMenu = 'dashboard';
    mc.collapseVar = 0;
    mc.multiCollapseVar = 0;

    mc.check = function(x){

        if(x==mc.collapseVar)
            mc.collapseVar = 0;
        else
            mc.collapseVar = x;
    };

    mc.multiCheck = function(y){

        if(y==mc.multiCollapseVar)
            mc.multiCollapseVar = 0;
        else
            mc.multiCollapseVar = y;
    };

}

function menuSrv(localStorageService, $http, $q, $filter) {
    var lss = localStorageService;
    this.roles;
    var roleObj = lss.get('currentRole') || '';
    this.currentRole;

    var service = {
        setRoles: setRoles,
        roles: this.roles,
        setRole: setRole,
        currentRole: this.currentRole
    };

    function setRoles(obj) {
        // console.log(obj);
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
            return $http.get('structure/menu/menu' + item.role + '.json')
                .then(function (response) {
                    return response.data;
                });
        }
        else return $q.when(item.menu);
    }

    return service
}
