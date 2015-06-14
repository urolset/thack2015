(function () {
    'use strict';

    angular.module('WanderlustApp')
        .factory('wlHotels', wlHotelsFactory);

    /* @ngInject */
    function wlHotelsFactory ($http) {
        var endPoint = '/hotel_search';
        var params = {
            'airport_code': '',
            'check-in': '',
            'check-out': ''
        };

        return {
            get: get,
            setHotelParams: setHotelParams,
        };

        function get () {
            return _POST();
        }

        function setHotelParams (hotelInfo) {
            params.airport_code = hotelInfo.DestinationLocation;
            params['check-in'] = new Date(hotelInfo.DepartureDateTime);
            params['check-out'] = new Date(hotelInfo.ReturnDateTime);
            console.log('params', params);
        }

        function _POST () {
            return $http.post(endPoint, params)
                .then(function (data) {
                    return data;
                });
        }
    }
})();
