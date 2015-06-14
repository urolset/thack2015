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
        $(".select").dropdown({ "autoinit" : ".select" });
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tYWluLmpzIiwiY29udHJvbGxlcnMvZGV0YWlsLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9ob21lLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy90cmlwLmNvbnRyb2xsZXIuanMiLCJzZXJ2aWNlcy91dGlscy5zZXJ2aWNlLmpzIiwic2VydmljZXMvd2wtaG90ZWxzLnNlcnZpY2UuanMiLCJzZXJ2aWNlcy93bC10cmlwLWl0aW5lcmFyeS5zZXJ2aWNlLmpzIiwic2VydmljZXMvd2wtdHJpcC1xdWVyeS5zZXJ2aWNlLmpzIiwic2VydmljZXMvd2wtdmVudWVzLnNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQyxZQUFZO0lBQ1QsUUFBUSxPQUFPLGlCQUFpQjtRQUM1QjtRQUNBO1FBQ0E7T0FDRCxPQUFPLFFBQVEsSUFBSTs7O0lBR3RCLFNBQVMsUUFBUSxnQkFBZ0IsbUJBQW1COztRQUVoRDthQUNLLEtBQUssS0FBSztnQkFDUCxhQUFhO2dCQUNiLFlBQVk7Z0JBQ1osY0FBYzs7YUFFakIsS0FBSyxTQUFTO2dCQUNYLGFBQWE7Z0JBQ2IsWUFBWTtnQkFDWixjQUFjO2dCQUNkLFNBQVM7b0JBQ0wsOENBQVcsVUFBVSxRQUFRLE9BQU8sYUFBYTt3QkFDN0MsSUFBSSxNQUFNLFFBQVEsWUFBWTtnQ0FDdEIsT0FBTyxRQUFRLE9BQU87Z0NBQ3RCLE9BQU8sUUFBUSxPQUFPO2dDQUN0QixPQUFPLFFBQVEsT0FBTzt3QkFDOUI7NEJBQ0ksSUFBSSxXQUFXO2dDQUNYLFdBQVcsSUFBSSxLQUFLLE9BQU8sUUFBUSxPQUFPO2dDQUMxQyxTQUFTLElBQUksS0FBSyxPQUFPLFFBQVEsT0FBTztnQ0FDeEMsT0FBTyxPQUFPLFFBQVEsT0FBTyxNQUFNO2dDQUNuQyxTQUFTLE9BQU8sUUFBUSxPQUFPLFVBQVU7Ozs0QkFHN0MsWUFBWSxZQUFZOzs7d0JBRzVCLE9BQU8sWUFBWTs7OzthQUk5QixLQUFLLG9CQUFvQjtnQkFD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bnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbiAgICBhbmd1bGFyLm1vZHVsZSgnV2FuZGVybHVzdEFwcCcsIFtcbiAgICAgICAgJ25nUm91dGUnLFxuICAgICAgICAnbmdBbmltYXRlJyxcbiAgICAgICAgJ3VpLmJvb3RzdHJhcCdcbiAgICBdKS5jb25maWcoY29uZmlnKS5ydW4oc2V0dXApO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gY29uZmlnICgkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcblxuICAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAgICAgLndoZW4oJy8nLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvbmcvaG9tZS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSG9tZUN0cmwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJyR2bSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbignL3RyaXAnLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvbmcvdHJpcC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVHJpcEN0cmwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJyR2bScsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICB0cmlwUXVlcnk6IGZ1bmN0aW9uICgkcm91dGUsIHV0aWxzLCB3bFRyaXBRdWVyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHV0aWxzLmlzRW1wdHkod2xUcmlwUXVlcnkuZ2V0VHJpcEluZm8oKSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvdXRlLmN1cnJlbnQucGFyYW1zLnN0YXJ0RGF0ZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm91dGUuY3VycmVudC5wYXJhbXMuZW5kRGF0ZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm91dGUuY3VycmVudC5wYXJhbXMudGhlbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRyaXBJbmZvID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydERhdGU6IG5ldyBEYXRlKCRyb3V0ZS5jdXJyZW50LnBhcmFtcy5zdGFydERhdGUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmREYXRlOiBuZXcgRGF0ZSgkcm91dGUuY3VycmVudC5wYXJhbXMuZW5kRGF0ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW1lOiAkcm91dGUuY3VycmVudC5wYXJhbXMudGhlbWUudG9VcHBlckNhc2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVkZ2V0OiAgJHJvdXRlLmN1cnJlbnQucGFyYW1zLmJ1ZGdldCB8fCAxMDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3bFRyaXBRdWVyeS5zZXRUcmlwSW5mbyh0cmlwSW5mbyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB3bFRyaXBRdWVyeS5nZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbignL3RyaXAvOnRyaXBJbmRleCcsIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy9kZXRhaWxzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdEZXRhaWxDdHJsJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICckdm0nLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgdHJpcERldGFpbHM6IGZ1bmN0aW9uICgkcm91dGUsIHdsVHJpcFF1ZXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAkcm91dGUuY3VycmVudC5wYXJhbXMudHJpcEluZGV4O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2xUcmlwUXVlcnkuZ2V0SW5kZXgoaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5vdGhlcndpc2UoXCIvXCIpO1xuXG4gICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXR1cCAoKSB7XG4gICAgICAgICQubWF0ZXJpYWwuaW5pdCgpO1xuICAgICAgICAkKFwiLnNlbGVjdFwiKS5kcm9wZG93bih7IFwiYXV0b2luaXRcIiA6IFwiLnNlbGVjdFwiIH0pO1xuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdXYW5kZXJsdXN0QXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0RldGFpbEN0cmwnLCBEZXRhaWxDdHJsKTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIERldGFpbEN0cmwgKCRyb3V0ZVBhcmFtcywgdHJpcERldGFpbHMsIHdsVHJpcEl0aW5lcmFyeSwgd2xIb3RlbHMsIHdsVmVudWVzKSB7XG4gICAgICAgIC8qIGpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgICB2YXIgJHZtID0gdGhpcztcblxuICAgICAgICAkdm0uaW5kZXggPSAkcm91dGVQYXJhbXMudHJpcEluZGV4O1xuICAgICAgICAkdm0uZGV0YWlscyA9IHRyaXBEZXRhaWxzIHx8IHdsVHJpcEl0aW5lcmFyeS5nZXRUcmlwKCk7XG5cbiAgICAgICAgJHZtLmhvdGVscyA9IG51bGw7XG4gICAgICAgICR2bS52ZW51ZXMgPSBudWxsO1xuXG4gICAgICAgIGluaXQoKTtcblxuICAgICAgICBmdW5jdGlvbiBpbml0ICgpIHtcbiAgICAgICAgICAgIHdsSG90ZWxzLmdldCgpLnRoZW4oZnVuY3Rpb24gKGhvdGVscykge1xuICAgICAgICAgICAgICAgICR2bS5ob3RlbHMgPSBob3RlbHMuZGF0YS5yZXN1bHRzO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgd2xWZW51ZXMuZ2V0KCkudGhlbihmdW5jdGlvbiAodmVudWVzKSB7XG4gICAgICAgICAgICAgICAgJHZtLnZlbnVlcyA9IHZlbnVlcy5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdXYW5kZXJsdXN0QXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJyxIb21lQ3RybCk7XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBIb21lQ3RybCAoJGxvY2F0aW9uLCB3bFRyaXBRdWVyeSkge1xuICAgICAgICAvKiBqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgICAgdmFyICR2bSA9IHRoaXMsXG4gICAgICAgICAgICB0b21vcnJvdyA9IF9nZXROZXh0RGF0ZShuZXcgRGF0ZSgpKSxcbiAgICAgICAgICAgIGRheUFmdGVyTmV4dCA9IF9nZXROZXh0RGF0ZShuZXcgRGF0ZSh0b21vcnJvdykpO1xuXG4gICAgICAgICR2bS5kYXRlcGlja2VyQ29uZmlnID0ge1xuICAgICAgICAgICAgbWluRGF0ZTogbmV3IERhdGUoKSxcbiAgICAgICAgfTtcblxuICAgICAgICAkdm0udHJpcEluZm8gPSB7XG4gICAgICAgICAgICBzdGFydERhdGU6IHRvbW9ycm93LFxuICAgICAgICAgICAgZW5kRGF0ZTogZGF5QWZ0ZXJOZXh0LFxuICAgICAgICAgICAgdGhlbWU6ICcnLFxuICAgICAgICAgICAgYnVkZ2V0OiAnMTAwMCcsXG4gICAgICAgIH07XG5cbiAgICAgICAgJHZtLnRoZW1lTGlzdCA9IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ0JlYWNoJywga2V5OiAnQkVBQ0gnIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdEaXNuZXknLCBrZXk6ICdESVNORVknIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdHYW1ibGluZycsIGtleTogJ0dBTUJMSU5HJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnSGlzdG9yaWMnLCBrZXk6ICdISVNUT1JJQycgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ01vdW50YWlucycsIGtleTogJ01PVU5UQUlOUycgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ05hdGlvbmFsLVBhcmtzJywga2V5OiAnTkFUSU9OQUwtUEFSS1MnIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdPdXRkb29ycycsIGtleTogJ09VVERPT1JTJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnUm9tYW50aWMnLCBrZXk6ICdST01BTlRJQycgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ1Nob3BwaW5nJywga2V5OiAnU0hPUFBJTkcnIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdTa2lpbmcnLCBrZXk6ICdTS0lJTkcnIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdUaGVtZS1QYXJrJywga2V5OiAnVEhFTUUtUEFSSycgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ0NhcmliYmVhbicsIGtleTogJ0NBUklCQkVBTicgfVxuICAgICAgICBdO1xuXG4gICAgICAgICR2bS5zdWJtaXRGb3JtID0gc3VibWl0Rm9ybTtcblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Ym1pdEZvcm0gKCkge1xuICAgICAgICAgICAgd2xUcmlwUXVlcnkuc2V0VHJpcEluZm8oJHZtLnRyaXBJbmZvKTtcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvdHJpcCcpLnNlYXJjaCgkdm0udHJpcEluZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX2dldE5leHREYXRlIChkYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgMSkpO1xuICAgICAgICB9XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ1dhbmRlcmx1c3RBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignVHJpcEN0cmwnLFRyaXBDdHJsKTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIFRyaXBDdHJsICgkbG9jYXRpb24sIHRyaXBRdWVyeSwgd2xUcmlwUXVlcnksIHdsVHJpcEl0aW5lcmFyeSwgd2xIb3RlbHMsIHdsVmVudWVzKSB7XG4gICAgICAgIC8qIGpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgICB2YXIgJHZtID0gdGhpcztcbiAgICAgICAgJHZtLnRyaXBRdWVyeSA9IHt9O1xuICAgICAgICAkdm0udHJpcExpc3QgPSBbXTtcbiAgICAgICAgJHZtLnRyaXBJbmZvID0ge307XG5cbiAgICAgICAgJHZtLnNlbGVjdFRyaXAgPSBzZWxlY3RUcmlwO1xuXG4gICAgICAgIGluaXQoKTtcblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIGluaXQgKCkge1xuICAgICAgICAgICAgJHZtLnRyaXBRdWVyeSA9IHRyaXBRdWVyeSB8fCB0cmlwUXVlcnkuZGF0YTtcbiAgICAgICAgICAgICR2bS50cmlwTGlzdCA9IHRyaXBRdWVyeS5GYXJlSW5mbyB8fCB0cmlwUXVlcnkuZGF0YS5GYXJlSW5mbztcblxuICAgICAgICAgICAgdmFyIHNhdmVkVHJpcEluZm8gPSB3bFRyaXBRdWVyeS5nZXRUcmlwSW5mbygpO1xuICAgICAgICAgICAgJHZtLnRyaXBJbmZvID0ge1xuICAgICAgICAgICAgICAgIHN0YXJ0RGF0ZTogc2F2ZWRUcmlwSW5mby5zdGFydERhdGUgfHwgbmV3IERhdGUoJHZtLnRyaXBMaXN0WzBdLkRlcGFydHVyZURhdGVUaW1lKSxcbiAgICAgICAgICAgICAgICBlbmREYXRlOiBzYXZlZFRyaXBJbmZvLmVuZERhdGUgfHwgbmV3IERhdGUoJHZtLnRyaXBMaXN0WzBdLlJldHVybkRhdGVUaW1lKSxcbiAgICAgICAgICAgICAgICB0aGVtZTogc2F2ZWRUcmlwSW5mby50aGVtZSB8fCAkdm0udHJpcExpc3RbMF0uVGhlbWVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZWxlY3RUcmlwICh0cmlwKSB7XG4gICAgICAgICAgICB3bFRyaXBJdGluZXJhcnkuc2V0VHJpcCh0cmlwKTtcbiAgICAgICAgICAgIHdsSG90ZWxzLnNldEhvdGVsUGFyYW1zKHRyaXApO1xuICAgICAgICAgICAgd2xWZW51ZXMuc2V0UGFyYW1zKCR2bS50cmlwSW5mbywgdHJpcC5jaXR5KTtcbiAgICAgICAgfVxuXG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ1dhbmRlcmx1c3RBcHAnKVxuICAgICAgICAuZmFjdG9yeSgndXRpbHMnLCB1dGlscyk7XG5cbiAgICBmdW5jdGlvbiB1dGlscyAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpc0VtcHR5OiBpc0VtcHR5XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gaXNFbXB0eSAob2JqKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdXYW5kZXJsdXN0QXBwJylcbiAgICAgICAgLmZhY3RvcnkoJ3dsSG90ZWxzJywgd2xIb3RlbHNGYWN0b3J5KTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIHdsSG90ZWxzRmFjdG9yeSAoJGh0dHApIHtcbiAgICAgICAgdmFyIGVuZFBvaW50ID0gJy9ob3RlbF9zZWFyY2gnO1xuICAgICAgICB2YXIgcGFyYW1zID0ge1xuICAgICAgICAgICAgJ2FpcnBvcnRfY29kZSc6ICcnLFxuICAgICAgICAgICAgJ2NoZWNrLWluJzogJycsXG4gICAgICAgICAgICAnY2hlY2stb3V0JzogJydcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0OiBnZXQsXG4gICAgICAgICAgICBzZXRIb3RlbFBhcmFtczogc2V0SG90ZWxQYXJhbXMsXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0ICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfUE9TVCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0SG90ZWxQYXJhbXMgKGhvdGVsSW5mbykge1xuICAgICAgICAgICAgcGFyYW1zLmFpcnBvcnRfY29kZSA9IGhvdGVsSW5mby5EZXN0aW5hdGlvbkxvY2F0aW9uO1xuICAgICAgICAgICAgcGFyYW1zWydjaGVjay1pbiddID0gbmV3IERhdGUoaG90ZWxJbmZvLkRlcGFydHVyZURhdGVUaW1lKTtcbiAgICAgICAgICAgIHBhcmFtc1snY2hlY2stb3V0J10gPSBuZXcgRGF0ZShob3RlbEluZm8uUmV0dXJuRGF0ZVRpbWUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3BhcmFtcycsIHBhcmFtcyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfUE9TVCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChlbmRQb2ludCwgcGFyYW1zKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ1dhbmRlcmx1c3RBcHAnKVxuICAgICAgICAuZmFjdG9yeSgnd2xUcmlwSXRpbmVyYXJ5Jywgd2xUcmlwSXRpbmVyYXJ5RmFjdG9yeSk7XG5cbiAgICBmdW5jdGlvbiB3bFRyaXBJdGluZXJhcnlGYWN0b3J5ICgpIHtcbiAgICAgICAgdmFyIF90cmlwID0gJyc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNldFRyaXA6IHNldFRyaXAsXG4gICAgICAgICAgICBnZXRUcmlwOiBnZXRUcmlwXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0VHJpcCAodCkge1xuICAgICAgICAgICAgX3RyaXAgPSB0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0VHJpcCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RyaXA7XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnV2FuZGVybHVzdEFwcCcpXG4gICAgICAgIC5mYWN0b3J5KCd3bFRyaXBRdWVyeScsIHdsVHJpcFF1ZXJ5RmFjdG9yeSk7XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiB3bFRyaXBRdWVyeUZhY3RvcnkgKCRodHRwLCAkcSwgJHRpbWVvdXQpIHtcbiAgICAgICAgdmFyIGVuZFBvaW50ID0gJy9kZXN0X2ZpbmRlcicsXG4gICAgICAgICAgICBfdHJpcEluZm8gPSB7fSxcbiAgICAgICAgICAgIF90cmlwID0ge307XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldDogZ2V0LFxuICAgICAgICAgICAgZ2V0SW5kZXg6IGdldEluZGV4LFxuICAgICAgICAgICAgZ2V0VHJpcEluZm86IGdldFRyaXBJbmZvLFxuICAgICAgICAgICAgc2V0VHJpcEluZm86IHNldFRyaXBJbmZvXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiBnZXQgKCkge1xuICAgICAgICAgICAgaWYgKF90cmlwLkZhcmVJbmZvKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF90cmlwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX3RyaXBJbmZvKVxuXG4gICAgICAgICAgICByZXR1cm4gX1BPU1QoX3RyaXBJbmZvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEluZGV4IChpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaW5kZXgnLCBpKTtcbiAgICAgICAgICAgIGlmIChfdHJpcC5GYXJlSW5mbyAmJiBfdHJpcC5GYXJlSW5mby5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF90cmlwLkZhcmVJbmZvW2ldO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gX1BPU1QoX3RyaXBJbmZvKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdnZXQgaW5kZXgnLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEuRmFyZUluZm9baV07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRUcmlwSW5mbyAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RyaXBJbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0VHJpcEluZm8gKHRpKSB7XG4gICAgICAgICAgICBfdHJpcEluZm8gPSB0aTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIF9QT1NUIChwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGVuZFBvaW50LCBwYXJhbXMpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RyaXAgPSBkYXRhO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ1dhbmRlcmx1c3RBcHAnKVxuICAgICAgICAuZmFjdG9yeSgnd2xWZW51ZXMnLCB3bFZlbnVlc0ZhY3RvcnkpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gd2xWZW51ZXNGYWN0b3J5ICgkaHR0cCkge1xuICAgICAgICB2YXIgZW5kUG9pbnQgPSAnL3NlYXJjaF92ZW51ZScsXG4gICAgICAgICAgICBwYXJhbXMgPSB7fTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0OiBnZXQsXG4gICAgICAgICAgICBzZXRQYXJhbXM6IHNldFBhcmFtc1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX1BPU1QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldFBhcmFtcyAodHJpcEluZm8sIGNpdHkpIHtcbiAgICAgICAgICAgIHBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICAndHJpcHR5cGUnOiAncmVzdGF1cmFudHMnLCAvL3RyaXBJbmZvLnRoZW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICAgICAgJ2J1ZGdldCc6IHRyaXBJbmZvLmJ1ZGdldCB8fCA1MDAsXG4gICAgICAgICAgICAgICAgJ2NpdHknOiBjaXR5XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc29sZS5sb2cocGFyYW1zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIF9QT1NUICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGVuZFBvaW50LCBwYXJhbXMpO1xuICAgICAgICB9XG4gICAgfVxufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==