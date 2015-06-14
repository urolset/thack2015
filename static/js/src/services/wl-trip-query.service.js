(function () {
    'use strict';

    angular.module('WanderlustApp')
        .factory('wlTripQuery', wlTripQueryFactory);

    /* @ngInject */
    function wlTripQueryFactory ($q, $timeout) {
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
            get: get
        };

        ////////////////////////////////////////////////////////////////////

        function get (index) {
            var defer = $q.defer();

            $timeout(function () {
                if (index && angular.isNumber(parseInt(index))) {
                    console.log('get specific index');
                    defer.resolve(_mockData.trips[index-1]);
                } else {
                    defer.resolve(_mockData);
                }
            }, 10);

            return defer.promise;
        }
    }
})();
