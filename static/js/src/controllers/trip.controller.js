(function () {
    'use strict';

    angular.module('WanderlustApp')
        .controller('TripCtrl',TripCtrl);

    /* @ngInject */
    function TripCtrl ($state, tripQuery) {
        /* jshint validthis:true */
        var $vm = this;
        $vm.tripList = [];
        $vm.tripInfo = {};

        init();

        ////////////////////////////////////////////////////////////////////////////////

        function init () {
            $vm.tripInfo = {
                startDate: tripQuery.departureDate,
                endDate: tripQuery.arrivalDate,
                theme: tripQuery.theme
            };

            $vm.tripList = tripQuery.trips;
        }

    }
})();
