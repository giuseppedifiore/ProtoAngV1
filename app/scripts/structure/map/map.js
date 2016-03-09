angular
    .module('struct.map', ['uiGmapgoogle-maps'])
    .run(['$templateCache', runner])
    .config(['uiGmapGoogleMapApiProvider', mapConf])
    .factory('gMapSrv', gMapSrv)
    .controller('WindowCtrl', ['$scope', WindowCtrl])
    .controller('SearchBoxController', ['$scope', 'uiGmapLogger', 'uiGmapGoogleMapApi','gMapSrv', SearchBoxController]);


function mapConf(GoogleMapApi) {
    GoogleMapApi.configure({
//    key: 'your api key',
        v: '3.20',
        libraries: 'places'
    });
}

function runner($templateCache) {
    $templateCache.put('searchbox.tpl.html', '<input id="pac-input" class="form-control input-rounded" type="text" placeholder="Search" >');
    $templateCache.put('window.tpl.html', '<div ng-controller="WindowCtrl" ng-init="showPlaceDetails(parameter)">{{place.name}}</div>');
}


function gMapSrv() {
    var mrk=null;
    var service = {
        getMarker: getMarker,
        setMarker: setMarker,
    };
    function setMarker(mrk) {
        this.mrk = mrk;
    }
    function getMarker() {
        return this.mrk;
    }
    return service;

}
function WindowCtrl($scope) {
    $scope.place = {};
    $scope.showPlaceDetails = function (param) {
        $scope.place = param;
    }
}

function SearchBoxController($scope, $log, GoogleMapApi,gMapSrv) {
    $log.doLog = true;

    GoogleMapApi.then(function (maps) {
        maps.visualRefresh = true;
        $scope.defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(47.6, 6.5),
            new google.maps.LatLng(36.6, 18.5));


        $scope.map.bounds = {
            northeast: {
                latitude: $scope.defaultBounds.getNorthEast().lat(),
                longitude: $scope.defaultBounds.getNorthEast().lng()
            },
            southwest: {
                latitude: $scope.defaultBounds.getSouthWest().lat(),
                longitude: -$scope.defaultBounds.getSouthWest().lng()

            }
        };
        $scope.searchbox.options.bounds = new google.maps.LatLngBounds($scope.defaultBounds.getNorthEast(), $scope.defaultBounds.getSouthWest());
    });

    angular.extend($scope, {
        selected: {
            options: {
                visible: false

            },
            templateurl: 'window.tpl.html',
            templateparameter: {}
        },
        map: {
            control: {},
            center: {
                latitude: 42.1,
                longitude: 12.5
            },
            zoom: 6,
            streetViewControl:false,
            dragging: false,
            bounds: {},
            markers: [],
            idkey: 'place_id',
            events: {
                idle: function (map) {

                },
                dragend: function (map) {
                    //update the search box bounds after dragging the map
                    var bounds = map.getBounds();
                    var ne = bounds.getNorthEast();
                    var sw = bounds.getSouthWest();
                    $scope.searchbox.options.bounds = new google.maps.LatLngBounds(sw, ne);
                    //$scope.searchbox.options.visible = true;
                },
                click: function (mapModel, eventName, originalEventArgs) {
                    // 'this' is the directive's scope
                    console.log("user defined event: " + eventName, mapModel, originalEventArgs);
                    var e = originalEventArgs[0];
                    $scope.map.clickedMarker = {
                        id: 0,
                        title: 'You clicked here ' + 'lat: ' + e.latLng.lng() + ' lon: ' + e.latLng.lng(),
                        geometry: {
                            type: "Point",
                            coordinates: [ e.latLng.lng(), e.latLng.lat() ]
                        }
                    };
                    //scope apply required because this event handler is outside of the angular domain
                 //   console.log($scope.map.clickedMarker);
                    $scope.$apply();
                },
            }
        },
        searchbox: {
            template: 'searchbox.tpl.html',
            options: {
                autocomplete: true,
                componentRestrictions: {country: 'it'}
            },
            events: {
                place_changed: function (autocomplete) {

                    place = autocomplete.getPlace();

                    if (place.address_components) {

                        newMarkers = [];
                        var bounds = new google.maps.LatLngBounds();

                        var marker = {
                            id: place.place_id,
                            place_id: place.place_id,
                            name: place.address_components[0].long_name,
                            latitude: place.geometry.location.lat(),
                            longitude: place.geometry.location.lng(),
                            options: {
                                visible: false
                            },
                            templateurl: 'window.tpl.html',
                            templateparameter: place
                        };

                        newMarkers.push(marker);

                        bounds.extend(place.geometry.location);
                        gMapSrv.setMarker(marker);

                        $scope.map.bounds = {
                            northeast: {
                                latitude: bounds.getNorthEast().lat(),
                                longitude: bounds.getNorthEast().lng()
                            },
                            southwest: {
                                latitude: bounds.getSouthWest().lat(),
                                longitude: bounds.getSouthWest().lng()
                            }
                        };

                        _.each(newMarkers, function (marker) {
                            marker.closeClick = function () {
                                //$scope.selected.options.visible = false;
                                marker.options.visble = false;
                                return $scope.$apply();
                            };
                            marker.onClicked = function () {
                                //$scope.selected.options.visible = false;
                                //console.log(angular.toJson(marker));
                                $scope.selected = marker;
                                //$scope.selected.options.visible = true;
                            };
                        });

                        $scope.map.markers = newMarkers;
                    } else {
                        console.log("do something else with the search string: " + place.name);
                    }
                }
            }
        }
    });
}


