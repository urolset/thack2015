(function () {
    'use strict';

    angular.module('WanderlustApp')
        .controller('TripCtrl',TripCtrl);

    /* @ngInject */
    function TripCtrl (tripQuery) {
        /* jshint validthis:true */
        var $vm = this;
        $vm.tripList = [];
        $vm.tripInfo = {};

        init();

        ////////////////////////////////////////////////////////////////////////////////

        function init () {
            $vm.tripList = tripQuery.data.FareInfo;

            $vm.tripInfo = {
                startDate: new Date($vm.tripList[0].DepartureDateTime),
                endDate: new Date($vm.tripList[0].ReturnDateTime),
                theme: $vm.tripList[0].Theme
            };
        }

    }
})();
