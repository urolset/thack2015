(function () {
    'use strict';

    angular.module('WanderlustApp')
        .factory('wlVenues', wlVenuesFactory);

    /* @ngInject */
    function wlVenuesFactory ($http) {
        var endPoint = '/search_venue',
            params = {};

        return {
            get: get,
            setParams: setParams
        };

        function get () {
            return _POST();
        }

        function setParams (tripInfo, city) {
            params = {
                'triptype': 'restaurants', //tripInfo.theme.toLowerCase(),
                'budget': tripInfo.budget || 500,
                'city': city
            };
            console.log(params);
        }

        function _POST () {
            return $http.post(endPoint, params);
        }
    }
})();
