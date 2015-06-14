(function () {
    'use strict';

    angular.module('WanderlustApp')
        .controller('DetailCtrl', DetailCtrl);

    /* @ngInject */
    function DetailCtrl ($routeParams, tripDetails, wlTripItinerary, wlHotels, wlVenues) {
        /* jshint validthis:true */
        var $vm = this;

        $vm.index = $routeParams.tripIndex;
        $vm.details = tripDetails || wlTripItinerary.getTrip();

        $vm.hotels = null;
        $vm.venues = null;

        init();

        function init () {
            wlHotels.get().then(function (hotels) {
                $vm.hotels = hotels.data.results;

            });

            wlVenues.get().then(function (venues) {
                $vm.venues = venues.data;
            });
        }

    }
})();
