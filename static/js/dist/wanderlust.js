(function () {
    angular.module('WanderlustApp', [
        'ngRoute',
        'ngAnimate',
        'ui.bootstrap'
    ]).config(config).run(setup);

    /* @ngInject */
    function config ($routeProvider, $locationProvider) {

        $routeProvider
            .when('/', {
                templateUrl: '/ng/home.html',
                controller: 'HomeCtrl',
                controllerAs: '$vm'
            })
            .when('/trip', {
                templateUrl: '/ng/trip.html',
                controller: 'TripCtrl',
                controllerAs: '$vm',
                resolve: {
                    tripQuery: ["$route", "utils", "wlTripQuery", function ($route, utils, wlTripQuery) {
                        if (utils.isEmpty(wlTripQuery.getTripInfo()) &&
                                $route.current.params.startDate &&
                                $route.current.params.endDate &&
                                $route.current.params.theme)
                        {
                            var tripInfo = {
                                startDate: new Date($route.current.params.startDate),
                                endDate: new Date($route.current.params.endDate),
                                theme: $route.current.params.theme.toUpperCase(),
                                budget:  $route.current.params.budget || 1000,
                            };

                            wlTripQuery.setTripInfo(tripInfo);
                        }

                        return wlTripQuery.get();
                    }]
                }
            })
            .when('/trip/:tripIndex', {
                templateUrl: '/ng/details.html',
                controller: 'DetailCtrl',
                controllerAs: '$vm',
                resolve: {
                    tripDetails: ["$route", "wlTripQuery", function ($route, wlTripQuery) {
                        var index = $route.current.params.tripIndex;

                        return wlTripQuery.getIndex(index);
                    }]
                }
            })
            .otherwise("/");

        $locationProvider.html5Mode(true);
    }
    config.$inject = ["$routeProvider", "$locationProvider"];

    function setup () {
        $.material.init();
    }
})();

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
                console.log(venues);
            });
        }

    }
    DetailCtrl.$inject = ["$routeParams", "tripDetails", "wlTripItinerary", "wlHotels", "wlVenues"];
})();

(function () {
    'use strict';

    angular.module('WanderlustApp')
        .controller('HomeCtrl',HomeCtrl);

    /* @ngInject */
    function HomeCtrl ($location, wlTripQuery) {
        /* jshint validthis:true */
        var $vm = this,
            tomorrow = _getNextDate(new Date()),
            dayAfterNext = _getNextDate(new Date(tomorrow));

        $vm.datepickerConfig = {
            minDate: new Date(),
        };

        $vm.tripInfo = {
            startDate: tomorrow,
            endDate: dayAfterNext,
            theme: '',
            budget: '1000',
        };

        $vm.themeList = [
            { name: 'Beach', key: 'BEACH' },
            { name: 'Disney', key: 'DISNEY' },
            { name: 'Gambling', key: 'GAMBLING' },
            { name: 'Historic', key: 'HISTORIC' },
            { name: 'Mountains', key: 'MOUNTAINS' },
            { name: 'National-Parks', key: 'NATIONAL-PARKS' },
            { name: 'Outdoors', key: 'OUTDOORS' },
            { name: 'Romantic', key: 'ROMANTIC' },
            { name: 'Shopping', key: 'SHOPPING' },
            { name: 'Skiing', key: 'SKIING' },
            { name: 'Theme-Park', key: 'THEME-PARK' },
            { name: 'Caribbean', key: 'CARIBBEAN' }
        ];

        $vm.submitForm = submitForm;

        ////////////////////////////////////////////////////////////////////////////////

        function submitForm () {
            wlTripQuery.setTripInfo($vm.tripInfo);
            $location.path('/trip').search($vm.tripInfo);
        }

        function _getNextDate (date) {
            return new Date(date.setDate(date.getDate() + 1));
        }
    }
    HomeCtrl.$inject = ["$location", "wlTripQuery"];
})();

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
            $vm.tripQuery = tripQuery.data;
            $vm.tripList = tripQuery.data.FareInfo;

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
    TripCtrl.$inject = ["$location", "tripQuery", "wlTripQuery", "wlTripItinerary", "wlHotels", "wlVenues"];
})();

(function () {
    'use strict';

    angular.module('WanderlustApp')
        .factory('utils', utils);

    function utils () {
        return {
            isEmpty: isEmpty
        };

        function isEmpty (obj) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        }
    }
})();

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
    wlHotelsFactory.$inject = ["$http"];
})();

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

(function () {
    'use strict';

    angular.module('WanderlustApp')
        .factory('wlTripQuery', wlTripQueryFactory);

    /* @ngInject */
    function wlTripQueryFactory ($http, $q, $timeout) {
        var endPoint = '/dest_finder',
            _tripInfo = {},
            _trip = {};

        return {
            get: get,
            getIndex: getIndex,
            getTripInfo: getTripInfo,
            setTripInfo: setTripInfo
        };

        ////////////////////////////////////////////////////////////////////

        function get () {
            if (_trip.FareInfo) {
                return _trip;
            }

            if (_tripInfo)

            return _POST(_tripInfo);
        }

        function getIndex (i) {
            console.log('index', i);
            if (_trip.FareInfo && _trip.FareInfo.length > 0) {
                return _trip.FareInfo[i];
            }

            return _POST(_tripInfo).then(function (data) {
                    console.log('get index', data);
                    return data.FareInfo[i];
                });
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
                    _trip = data;

                    return data;
                });
        }
    }
    wlTripQueryFactory.$inject = ["$http", "$q", "$timeout"];
})();

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
    wlVenuesFactory.$inject = ["$http"];
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tYWluLmpzIiwiY29udHJvbGxlcnMvZGV0YWlsLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9ob21lLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy90cmlwLmNvbnRyb2xsZXIuanMiLCJzZXJ2aWNlcy91dGlscy5zZXJ2aWNlLmpzIiwic2VydmljZXMvd2wtaG90ZWxzLnNlcnZpY2UuanMiLCJzZXJ2aWNlcy93bC10cmlwLWl0aW5lcmFyeS5zZXJ2aWNlLmpzIiwic2VydmljZXMvd2wtdHJpcC1xdWVyeS5zZXJ2aWNlLmpzIiwic2VydmljZXMvd2wtdmVudWVzLnNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQyxZQUFZO0lBQ1QsUUFBUSxPQUFPLGlCQUFpQjtRQUM1QjtRQUNBO1FBQ0E7T0FDRCxPQUFPLFFBQVEsSUFBSTs7O0lBR3RCLFNBQVMsUUFBUSxnQkFBZ0IsbUJBQW1COztRQUVoRDthQUNLLEtBQUssS0FBSztnQkFDUCxhQUFhO2dCQUNiLFlBQVk7Z0JBQ1osY0FBYzs7YUFFakIsS0FBSyxTQUFTO2dCQUNYLGFBQWE7Z0JBQ2IsWUFBWTtnQkFDWixjQUFjO2dCQUNkLFNBQVM7b0JBQ0wsOENBQVcsVUFBVSxRQUFRLE9BQU8sYUFBYTt3QkFDN0MsSUFBSSxNQUFNLFFBQVEsWUFBWTtnQ0FDdEIsT0FBTyxRQUFRLE9BQU87Z0NBQ3RCLE9BQU8sUUFBUSxPQUFPO2dDQUN0QixPQUFPLFFBQVEsT0FBTzt3QkFDOUI7NEJBQ0ksSUFBSSxXQUFXO2dDQUNYLFdBQVcsSUFBSSxLQUFLLE9BQU8sUUFBUSxPQUFPO2dDQUMxQyxTQUFTLElBQUksS0FBSyxPQUFPLFFBQVEsT0FBTztnQ0FDeEMsT0FBTyxPQUFPLFFBQVEsT0FBTyxNQUFNO2dDQUNuQyxTQUFTLE9BQU8sUUFBUSxPQUFPLFVBQVU7Ozs0QkFHN0MsWUFBWSxZQUFZOzs7d0JBRzVCLE9BQU8sWUFBWTs7OzthQUk5QixLQUFLLG9CQUFvQjtnQkFD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IGFuZ3VsYXIubW9kdWxlKCdXYW5kZXJsdXN0QXBwJywgW1xuICAgICAgICAnbmdSb3V0ZScsXG4gICAgICAgICduZ0FuaW1hdGUnLFxuICAgICAgICAndWkuYm9vdHN0cmFwJ1xuICAgIF0pLmNvbmZpZyhjb25maWcpLnJ1bihzZXR1cCk7XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBjb25maWcgKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuXG4gICAgICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgICAgICAgICAud2hlbignLycsIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy9ob21lLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ3RybCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnJHZtJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKCcvdHJpcCcsIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy90cmlwLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdUcmlwQ3RybCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnJHZtJyxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIHRyaXBRdWVyeTogZnVuY3Rpb24gKCRyb3V0ZSwgdXRpbHMsIHdsVHJpcFF1ZXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodXRpbHMuaXNFbXB0eSh3bFRyaXBRdWVyeS5nZXRUcmlwSW5mbygpKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm91dGUuY3VycmVudC5wYXJhbXMuc3RhcnREYXRlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb3V0ZS5jdXJyZW50LnBhcmFtcy5lbmREYXRlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb3V0ZS5jdXJyZW50LnBhcmFtcy50aGVtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHJpcEluZm8gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0RGF0ZTogbmV3IERhdGUoJHJvdXRlLmN1cnJlbnQucGFyYW1zLnN0YXJ0RGF0ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZERhdGU6IG5ldyBEYXRlKCRyb3V0ZS5jdXJyZW50LnBhcmFtcy5lbmREYXRlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlbWU6ICRyb3V0ZS5jdXJyZW50LnBhcmFtcy50aGVtZS50b1VwcGVyQ2FzZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWRnZXQ6ICAkcm91dGUuY3VycmVudC5wYXJhbXMuYnVkZ2V0IHx8IDEwMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdsVHJpcFF1ZXJ5LnNldFRyaXBJbmZvKHRyaXBJbmZvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdsVHJpcFF1ZXJ5LmdldCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKCcvdHJpcC86dHJpcEluZGV4Jywge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL25nL2RldGFpbHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0RldGFpbEN0cmwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJyR2bScsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICB0cmlwRGV0YWlsczogZnVuY3Rpb24gKCRyb3V0ZSwgd2xUcmlwUXVlcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9ICRyb3V0ZS5jdXJyZW50LnBhcmFtcy50cmlwSW5kZXg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB3bFRyaXBRdWVyeS5nZXRJbmRleChpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm90aGVyd2lzZShcIi9cIik7XG5cbiAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldHVwICgpIHtcbiAgICAgICAgJC5tYXRlcmlhbC5pbml0KCk7XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ1dhbmRlcmx1c3RBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignRGV0YWlsQ3RybCcsIERldGFpbEN0cmwpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gRGV0YWlsQ3RybCAoJHJvdXRlUGFyYW1zLCB0cmlwRGV0YWlscywgd2xUcmlwSXRpbmVyYXJ5LCB3bEhvdGVscywgd2xWZW51ZXMpIHtcbiAgICAgICAgLyoganNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICAgIHZhciAkdm0gPSB0aGlzO1xuXG4gICAgICAgICR2bS5pbmRleCA9ICRyb3V0ZVBhcmFtcy50cmlwSW5kZXg7XG4gICAgICAgICR2bS5kZXRhaWxzID0gdHJpcERldGFpbHMgfHwgd2xUcmlwSXRpbmVyYXJ5LmdldFRyaXAoKTtcblxuICAgICAgICAkdm0uaG90ZWxzID0gbnVsbDtcbiAgICAgICAgJHZtLnZlbnVlcyA9IG51bGw7XG5cbiAgICAgICAgaW5pdCgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGluaXQgKCkge1xuICAgICAgICAgICAgd2xIb3RlbHMuZ2V0KCkudGhlbihmdW5jdGlvbiAoaG90ZWxzKSB7XG4gICAgICAgICAgICAgICAgJHZtLmhvdGVscyA9IGhvdGVscy5kYXRhLnJlc3VsdHM7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB3bFZlbnVlcy5nZXQoKS50aGVuKGZ1bmN0aW9uICh2ZW51ZXMpIHtcbiAgICAgICAgICAgICAgICAkdm0udmVudWVzID0gdmVudWVzLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codmVudWVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnV2FuZGVybHVzdEFwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdIb21lQ3RybCcsSG9tZUN0cmwpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gSG9tZUN0cmwgKCRsb2NhdGlvbiwgd2xUcmlwUXVlcnkpIHtcbiAgICAgICAgLyoganNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICAgIHZhciAkdm0gPSB0aGlzLFxuICAgICAgICAgICAgdG9tb3Jyb3cgPSBfZ2V0TmV4dERhdGUobmV3IERhdGUoKSksXG4gICAgICAgICAgICBkYXlBZnRlck5leHQgPSBfZ2V0TmV4dERhdGUobmV3IERhdGUodG9tb3Jyb3cpKTtcblxuICAgICAgICAkdm0uZGF0ZXBpY2tlckNvbmZpZyA9IHtcbiAgICAgICAgICAgIG1pbkRhdGU6IG5ldyBEYXRlKCksXG4gICAgICAgIH07XG5cbiAgICAgICAgJHZtLnRyaXBJbmZvID0ge1xuICAgICAgICAgICAgc3RhcnREYXRlOiB0b21vcnJvdyxcbiAgICAgICAgICAgIGVuZERhdGU6IGRheUFmdGVyTmV4dCxcbiAgICAgICAgICAgIHRoZW1lOiAnJyxcbiAgICAgICAgICAgIGJ1ZGdldDogJzEwMDAnLFxuICAgICAgICB9O1xuXG4gICAgICAgICR2bS50aGVtZUxpc3QgPSBbXG4gICAgICAgICAgICB7IG5hbWU6ICdCZWFjaCcsIGtleTogJ0JFQUNIJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnRGlzbmV5Jywga2V5OiAnRElTTkVZJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnR2FtYmxpbmcnLCBrZXk6ICdHQU1CTElORycgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ0hpc3RvcmljJywga2V5OiAnSElTVE9SSUMnIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdNb3VudGFpbnMnLCBrZXk6ICdNT1VOVEFJTlMnIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdOYXRpb25hbC1QYXJrcycsIGtleTogJ05BVElPTkFMLVBBUktTJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnT3V0ZG9vcnMnLCBrZXk6ICdPVVRET09SUycgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ1JvbWFudGljJywga2V5OiAnUk9NQU5USUMnIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdTaG9wcGluZycsIGtleTogJ1NIT1BQSU5HJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnU2tpaW5nJywga2V5OiAnU0tJSU5HJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnVGhlbWUtUGFyaycsIGtleTogJ1RIRU1FLVBBUksnIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdDYXJpYmJlYW4nLCBrZXk6ICdDQVJJQkJFQU4nIH1cbiAgICAgICAgXTtcblxuICAgICAgICAkdm0uc3VibWl0Rm9ybSA9IHN1Ym1pdEZvcm07XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiBzdWJtaXRGb3JtICgpIHtcbiAgICAgICAgICAgIHdsVHJpcFF1ZXJ5LnNldFRyaXBJbmZvKCR2bS50cmlwSW5mbyk7XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3RyaXAnKS5zZWFyY2goJHZtLnRyaXBJbmZvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIF9nZXROZXh0RGF0ZSAoZGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIDEpKTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdXYW5kZXJsdXN0QXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1RyaXBDdHJsJyxUcmlwQ3RybCk7XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBUcmlwQ3RybCAoJGxvY2F0aW9uLCB0cmlwUXVlcnksIHdsVHJpcFF1ZXJ5LCB3bFRyaXBJdGluZXJhcnksIHdsSG90ZWxzLCB3bFZlbnVlcykge1xuICAgICAgICAvKiBqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgICAgdmFyICR2bSA9IHRoaXM7XG4gICAgICAgICR2bS50cmlwUXVlcnkgPSB7fTtcbiAgICAgICAgJHZtLnRyaXBMaXN0ID0gW107XG4gICAgICAgICR2bS50cmlwSW5mbyA9IHt9O1xuXG4gICAgICAgICR2bS5zZWxlY3RUcmlwID0gc2VsZWN0VHJpcDtcblxuICAgICAgICBpbml0KCk7XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiBpbml0ICgpIHtcbiAgICAgICAgICAgICR2bS50cmlwUXVlcnkgPSB0cmlwUXVlcnkuZGF0YTtcbiAgICAgICAgICAgICR2bS50cmlwTGlzdCA9IHRyaXBRdWVyeS5kYXRhLkZhcmVJbmZvO1xuXG4gICAgICAgICAgICB2YXIgc2F2ZWRUcmlwSW5mbyA9IHdsVHJpcFF1ZXJ5LmdldFRyaXBJbmZvKCk7XG4gICAgICAgICAgICAkdm0udHJpcEluZm8gPSB7XG4gICAgICAgICAgICAgICAgc3RhcnREYXRlOiBzYXZlZFRyaXBJbmZvLnN0YXJ0RGF0ZSB8fCBuZXcgRGF0ZSgkdm0udHJpcExpc3RbMF0uRGVwYXJ0dXJlRGF0ZVRpbWUpLFxuICAgICAgICAgICAgICAgIGVuZERhdGU6IHNhdmVkVHJpcEluZm8uZW5kRGF0ZSB8fCBuZXcgRGF0ZSgkdm0udHJpcExpc3RbMF0uUmV0dXJuRGF0ZVRpbWUpLFxuICAgICAgICAgICAgICAgIHRoZW1lOiBzYXZlZFRyaXBJbmZvLnRoZW1lIHx8ICR2bS50cmlwTGlzdFswXS5UaGVtZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdFRyaXAgKHRyaXApIHtcbiAgICAgICAgICAgIHdsVHJpcEl0aW5lcmFyeS5zZXRUcmlwKHRyaXApO1xuICAgICAgICAgICAgd2xIb3RlbHMuc2V0SG90ZWxQYXJhbXModHJpcCk7XG4gICAgICAgICAgICB3bFZlbnVlcy5zZXRQYXJhbXMoJHZtLnRyaXBJbmZvLCB0cmlwLmNpdHkpO1xuICAgICAgICB9XG5cbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnV2FuZGVybHVzdEFwcCcpXG4gICAgICAgIC5mYWN0b3J5KCd1dGlscycsIHV0aWxzKTtcblxuICAgIGZ1bmN0aW9uIHV0aWxzICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlzRW1wdHk6IGlzRW1wdHlcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBpc0VtcHR5IChvYmopIHtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ1dhbmRlcmx1c3RBcHAnKVxuICAgICAgICAuZmFjdG9yeSgnd2xIb3RlbHMnLCB3bEhvdGVsc0ZhY3RvcnkpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gd2xIb3RlbHNGYWN0b3J5ICgkaHR0cCkge1xuICAgICAgICB2YXIgZW5kUG9pbnQgPSAnL2hvdGVsX3NlYXJjaCc7XG4gICAgICAgIHZhciBwYXJhbXMgPSB7XG4gICAgICAgICAgICAnYWlycG9ydF9jb2RlJzogJycsXG4gICAgICAgICAgICAnY2hlY2staW4nOiAnJyxcbiAgICAgICAgICAgICdjaGVjay1vdXQnOiAnJ1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXQ6IGdldCxcbiAgICAgICAgICAgIHNldEhvdGVsUGFyYW1zOiBzZXRIb3RlbFBhcmFtcyxcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBnZXQgKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9QT1NUKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRIb3RlbFBhcmFtcyAoaG90ZWxJbmZvKSB7XG4gICAgICAgICAgICBwYXJhbXMuYWlycG9ydF9jb2RlID0gaG90ZWxJbmZvLkRlc3RpbmF0aW9uTG9jYXRpb247XG4gICAgICAgICAgICBwYXJhbXNbJ2NoZWNrLWluJ10gPSBuZXcgRGF0ZShob3RlbEluZm8uRGVwYXJ0dXJlRGF0ZVRpbWUpO1xuICAgICAgICAgICAgcGFyYW1zWydjaGVjay1vdXQnXSA9IG5ldyBEYXRlKGhvdGVsSW5mby5SZXR1cm5EYXRlVGltZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncGFyYW1zJywgcGFyYW1zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIF9QT1NUICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGVuZFBvaW50LCBwYXJhbXMpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnV2FuZGVybHVzdEFwcCcpXG4gICAgICAgIC5mYWN0b3J5KCd3bFRyaXBJdGluZXJhcnknLCB3bFRyaXBJdGluZXJhcnlGYWN0b3J5KTtcblxuICAgIGZ1bmN0aW9uIHdsVHJpcEl0aW5lcmFyeUZhY3RvcnkgKCkge1xuICAgICAgICB2YXIgX3RyaXAgPSAnJztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2V0VHJpcDogc2V0VHJpcCxcbiAgICAgICAgICAgIGdldFRyaXA6IGdldFRyaXBcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBzZXRUcmlwICh0KSB7XG4gICAgICAgICAgICBfdHJpcCA9IHQ7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRUcmlwICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdHJpcDtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdXYW5kZXJsdXN0QXBwJylcbiAgICAgICAgLmZhY3RvcnkoJ3dsVHJpcFF1ZXJ5Jywgd2xUcmlwUXVlcnlGYWN0b3J5KTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIHdsVHJpcFF1ZXJ5RmFjdG9yeSAoJGh0dHAsICRxLCAkdGltZW91dCkge1xuICAgICAgICB2YXIgZW5kUG9pbnQgPSAnL2Rlc3RfZmluZGVyJyxcbiAgICAgICAgICAgIF90cmlwSW5mbyA9IHt9LFxuICAgICAgICAgICAgX3RyaXAgPSB7fTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0OiBnZXQsXG4gICAgICAgICAgICBnZXRJbmRleDogZ2V0SW5kZXgsXG4gICAgICAgICAgICBnZXRUcmlwSW5mbzogZ2V0VHJpcEluZm8sXG4gICAgICAgICAgICBzZXRUcmlwSW5mbzogc2V0VHJpcEluZm9cbiAgICAgICAgfTtcblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldCAoKSB7XG4gICAgICAgICAgICBpZiAoX3RyaXAuRmFyZUluZm8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RyaXA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfdHJpcEluZm8pXG5cbiAgICAgICAgICAgIHJldHVybiBfUE9TVChfdHJpcEluZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0SW5kZXggKGkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbmRleCcsIGkpO1xuICAgICAgICAgICAgaWYgKF90cmlwLkZhcmVJbmZvICYmIF90cmlwLkZhcmVJbmZvLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RyaXAuRmFyZUluZm9baV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBfUE9TVChfdHJpcEluZm8pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2dldCBpbmRleCcsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YS5GYXJlSW5mb1tpXTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFRyaXBJbmZvICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdHJpcEluZm87XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRUcmlwSW5mbyAodGkpIHtcbiAgICAgICAgICAgIF90cmlwSW5mbyA9IHRpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX1BPU1QgKHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoZW5kUG9pbnQsIHBhcmFtcylcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBfdHJpcCA9IGRhdGE7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnV2FuZGVybHVzdEFwcCcpXG4gICAgICAgIC5mYWN0b3J5KCd3bFZlbnVlcycsIHdsVmVudWVzRmFjdG9yeSk7XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiB3bFZlbnVlc0ZhY3RvcnkgKCRodHRwKSB7XG4gICAgICAgIHZhciBlbmRQb2ludCA9ICcvc2VhcmNoX3ZlbnVlJyxcbiAgICAgICAgICAgIHBhcmFtcyA9IHt9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXQ6IGdldCxcbiAgICAgICAgICAgIHNldFBhcmFtczogc2V0UGFyYW1zXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0ICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfUE9TVCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0UGFyYW1zICh0cmlwSW5mbywgY2l0eSkge1xuICAgICAgICAgICAgcGFyYW1zID0ge1xuICAgICAgICAgICAgICAgICd0cmlwdHlwZSc6ICdyZXN0YXVyYW50cycsIC8vdHJpcEluZm8udGhlbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAgICAgICAnYnVkZ2V0JzogdHJpcEluZm8uYnVkZ2V0IHx8IDUwMCxcbiAgICAgICAgICAgICAgICAnY2l0eSc6IGNpdHlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwYXJhbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX1BPU1QgKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoZW5kUG9pbnQsIHBhcmFtcyk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9