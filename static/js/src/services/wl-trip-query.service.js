(function () {
    'use strict';

    angular.module('WanderlustApp')
        .factory('wlTripQuery', wlTripQueryFactory);

    /* @ngInject */
    function wlTripQueryFactory ($http, $q, $timeout) {
        var endPoint = '/dest_finder';
        var _tripInfo = {};
        var _mockData = {
            theme: 'THEME-PARK',
            departureDate: new Date('10/01/2015'),
            arrivalDate: new Date('10/04/2015'),
            trips: [
                {
                    index: 1,
                    city: 'Los Angeles',
                    out: {
                        airline: 'Virgin America',
                        departureIATA: 'SFO',
                        arrivalIATA: 'LAX',
                        departureDate: new Date('10/01/2015 09:00'),
                        arrivalDate: new Date('10/01/2015 10:30')
                    },
                    in: {
                        airline: 'Virgin America',
                        departureIATA: 'LAX',
                        arrivalIATA: 'SFO',
                        departureDate: new Date('10/04/2015 20:25'),
                        arrivalDate: new Date('10/04/2015 22:00')
                    }
                },
                {
                    index: 2,
                    city: 'Boston',
                    out: {
                        airline: 'American Airlines',
                        departureIATA: 'SFO',
                        arrivalIATA: 'BOS',
                        departureDate: new Date('10/01/2015 11:00'),
                        arrivalDate: new Date('10/01/2015 12:30')
                    },
                    in: {
                        airline: 'American Airlines',
                        departureIATA: 'BOS',
                        arrivalIATA: 'SFO',
                        departureDate: new Date('10/04/2015 22:25'),
                        arrivalDate: new Date('10/04/2015 23:50')
                    }
                }
            ]
        };


        return {
            get: get,
            getTripInfo: getTripInfo,
            setTripInfo: setTripInfo
        };

        ////////////////////////////////////////////////////////////////////

        function get () {
            return _POST(_tripInfo);
        }

        function getTripInfo () {
            return _tripInfo;
        }

        function setTripInfo (ti) {
            _tripInfo = ti;
        }


        function _POST (params) {
            return $http.post(endPoint, params)
                .success(function (data) {
                    console.log('get stuff!', data);
                    return data;
                });
        }
    }
})();
