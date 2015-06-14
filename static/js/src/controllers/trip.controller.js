(function () {
    'use strict';

    angular.module('WanderlustApp')
        .controller('TripCtrl',TripCtrl);

    /* @ngInject */
    function TripCtrl ($location, tripQuery, wlTripQuery, wlTripItinerary, wlHotels, wlVenues) {
        /* jshint validthis:true */
        var $vm = this;
        $vm.tripQuery = {};
        $vm.tripList = [];
        $vm.tripInfo = {};

        $vm.selectTrip = selectTrip;

        init();

        ////////////////////////////////////////////////////////////////////////////////

        function init () {
            $vm.tripQuery = tripQuery || tripQuery.data;
            $vm.tripList = tripQuery.FareInfo || tripQuery.data.FareInfo;

            var savedTripInfo = wlTripQuery.getTripInfo();
            $vm.tripInfo = {
                startDate: savedTripInfo.startDate || new Date($vm.tripList[0].DepartureDateTime),
                endDate: savedTripInfo.endDate || new Date($vm.tripList[0].ReturnDateTime),
                theme: savedTripInfo.theme || $vm.tripList[0].Theme
            };
        }

        function selectTrip (trip) {
            wlTripItinerary.setTrip(trip);
            wlHotels.setHotelParams(trip);
            wlVenues.setParams($vm.tripInfo, trip.city);
        }

    }
})();
