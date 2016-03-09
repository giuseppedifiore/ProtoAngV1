angular
    .module('struct.datepicker', [])
    .controller('datepickerCtrl', ['$scope', datepickerCtrl])
    .directive('datepickerPopup', ['dateFilter', datepickerPopup]);

function datepickerCtrl($scope) {
    var s = $scope;
    s.today = function () {
        s.dt = new Date();
    };
    s.today();

    s.clear = function () {
        s.dt = null;
    };

    // Disable weekend selection
    s.disabled = function (date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    s.toggleMin = function () {
        s.minDate = s.minDate ? null : new Date();
    };
    s.toggleMin();

    s.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        s.opened = true;
    };

    s.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1
    };

    s.formats = ['dd/MM/yyyy', 'dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy'];
    s.format = s.formats[0];
}

function datepickerPopup(dateFilter) {
    return {
        restrict: 'A',
        priority: 1,
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {
            var dateFormat = attr.datepickerPopup;
            ngModel.$formatters.push(function (value) {
                return dateFilter(value, dateFormat);
            });
        }
    };
}