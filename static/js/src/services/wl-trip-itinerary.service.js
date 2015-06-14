(function () {
    'use strict';

    angular.module('WanderlustApp')
        .factory('wlTripItinerary', wlTripItineraryFactory);

    function wlTripItineraryFactory () {
        var _trip = '';

        return {
            setTrip: setTrip,
            getTrip: getTrip
        };

        function setTrip (t) {
            _trip = t;
        }

        function getTrip () {
            return _trip;
        }
    }
})();
