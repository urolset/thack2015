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
                    tripQuery: ["$route", "wlTripQuery", function ($route, wlTripQuery) {
                        if ($route.current.params.startDate && $route.current.params.endDate && $route.current.params.theme) {
                            var tripInfo = {
                                startDate: new Date($route.current.params.startDate),
                                endDate: new Date($route.current.params.endDate),
                                theme: $route.current.params.theme.toUpperCase(),
                                budget:  $route.current.params.budget || 1000,
                            };

                            wlTripQuery.setTripInfo(tripInfo);
                        }

                        console.log('get trip query');
                        return wlTripQuery.get();
                    }]
                }
            })
            .when('/details/:tripIndex', {
                templateUrl: '/ng/details.html',
                controller: 'DetailCtrl',
                controllerAs: '$vm',
                resolve: {
                    tripDetails: ["$route", "wlTripQuery", function ($route, wlTripQuery) {
                        var index = $route.current.params.tripIndex;
                        return wlTripQuery.get(index);
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
    function DetailCtrl ($routeParams, tripDetails) {
        /* jshint validthis:true */
        var $vm = this;

        $vm.index = $routeParams.tripIndex;
        $vm.details = tripDetails;
    }
    DetailCtrl.$inject = ["$routeParams", "tripDetails"];
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
    function TripCtrl (tripQuery) {
        /* jshint validthis:true */
        var $vm = this;
        $vm.tripList = [];
        $vm.tripInfo = {};

        init();

        ////////////////////////////////////////////////////////////////////////////////

        function init () {
            $vm.tripList = tripQuery.data.FareInfo;

            $vm.tripInfo = {
                startDate: new Date($vm.tripList[0].DepartureDateTime),
                endDate: new Date($vm.tripList[0].ReturnDateTime),
                theme: $vm.tripList[0].Theme
            };
        }

    }
    TripCtrl.$inject = ["tripQuery"];
})();

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
    wlTripQueryFactory.$inject = ["$http", "$q", "$timeout"];
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tYWluLmpzIiwiY29udHJvbGxlcnMvZGV0YWlsLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9ob21lLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy90cmlwLmNvbnRyb2xsZXIuanMiLCJzZXJ2aWNlcy93bC10cmlwLXF1ZXJ5LnNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQyxZQUFZO0lBQ1QsUUFBUSxPQUFPLGlCQUFpQjtRQUM1QjtRQUNBO1FBQ0E7T0FDRCxPQUFPLFFBQVEsSUFBSTs7O0lBR3RCLFNBQVMsUUFBUSxnQkFBZ0IsbUJBQW1COztRQUVoRDthQUNLLEtBQUssS0FBSztnQkFDUCxhQUFhO2dCQUNiLFlBQVk7Z0JBQ1osY0FBYzs7YUFFakIsS0FBSyxTQUFTO2dCQUNYLGFBQWE7Z0JBQ2IsWUFBWTtnQkFDWixjQUFjO2dCQUNkLFNBQVM7b0JBQ0wscUNBQVcsVUFBVSxRQUFRLGFBQWE7d0JBQ3RDLElBQUksT0FBTyxRQUFRLE9BQU8sYUFBYSxPQUFPLFFBQVEsT0FBTyxXQUFXLE9BQU8sUUFBUSxPQUFPLE9BQU87NEJBQ2pHLElBQUksV0FBVztnQ0FDWCxXQUFXLElBQUksS0FBSyxPQUFPLFFBQVEsT0FBTztnQ0FDMUMsU0FBUyxJQUFJLEtBQUssT0FBTyxRQUFRLE9BQU87Z0NBQ3hDLE9BQU8sT0FBTyxRQUFRLE9BQU8sTUFBTTtnQ0FDbkMsU0FBUyxPQUFPLFFBQVEsT0FBTyxVQUFVOzs7NEJBRzdDLFlBQVksWUFBWTs7O3dCQUc1QixRQUFRLElBQUk7d0JBQ1osT0FBTyxZQUFZOzs7O2FBSTlCLEtBQUssdUJBQXVCO2dCQUN6QixhQUFhO2dCQUNiLFlBQVk7Z0JBQ1osY0FBYztnQkFDZCxTQUFTO29CQUNMLHVDQUFhLFVBQVUsUUFBUSxhQUFhO3dCQUN4QyxJQUFJLFFBQVEsT0FBTyxRQUFRLE9BQU87d0JBQ2xDLE9BQU8sWUFBWSxJQUFJOzs7O2FBSWxDLFVBQVU7O1FBRWYsa0JBQWtCLFVBQVU7Ozs7SUFHaEMsU0FBUyxTQUFTO1FBQ2QsRUFBRSxTQUFTOzs7QUFHbkI7QUMxREEsQ0FBQyxZQUFZO0lBQ1Q7O0lBRUEsUUFBUSxPQUFPO1NBQ1YsV0FBVyxjQUFjOzs7SUFHOUIsU0FBUyxZQUFZLGNBQWMsYUFBYTs7UUFFNUMsSUFBSSxNQUFNOztRQUVWLElBQUksUUFBUSxhQUFhO1FBQ3pCLElBQUksVUFBVTs7OztBQUd0QjtBQ2ZBLENBQUMsWUFBWTtJQUNUOztJQUVBLFFBQVEsT0FBTztTQUNWLFdBQVcsV0FBVzs7O0lBRzNCLFNBQVMsVUFBVSxXQUFXLGFBQWE7O1FBRXZDLElBQUksTUFBTTtZQUNOLFdBQVcsYUFBYSxJQUFJO1lBQzVCLGVBQWUsYUFBYSxJQUFJLEtBQUs7O1FBRXpDLElBQUksbUJBQW1CO1lBQ25CLFNBQVMsSUFBSTs7O1FBR2pCLElBQUksV0FBVztZQUNYLFdBQVc7WUFDWCxTQUFTO1lBQ1QsT0FBTztZQUNQLFFBQVE7OztRQUdaLElBQUksWUFBWTtZQUNaLEVBQUUsTUFBTSxTQUFTLEtBQUs7WUFDdEIsRUFBRSxNQUFNLFVBQVUsS0FBSztZQUN2QixFQUFFLE1BQU0sWUFBWSxLQUFLO1lBQ3pCLEVBQUUsTUFBTSxZQUFZLEtBQUs7WUFDekIsRUFBRSxNQUFNLGFBQWEsS0FBSztZQUMxQixFQUFFLE1BQU0sa0JBQWtCLEtBQUs7WUFDL0IsRUFBRSxNQUFNLFlBQVksS0FBSztZQUN6QixFQUFFLE1BQU0sWUFBWSxLQUFLO1lBQ3pCLEVBQUUsTUFBTSxZQUFZLEtBQUs7WUFDekIsRUFBRSxNQUFNLFVBQVUsS0FBSztZQUN2QixFQUFFLE1BQU0sY0FBYyxLQUFLO1lBQzNCLEVBQUUsTUFBTSxhQUFhLEtBQUs7OztRQUc5QixJQUFJLGFBQWE7Ozs7UUFJakIsU0FBUyxjQUFjO1lBQ25CLFlBQVksWUFBWSxJQUFJO1lBQzVCLFVBQVUsS0FBSyxTQUFTLE9BQU8sSUFBSTs7O1FBR3ZDLFNBQVMsY0FBYyxNQUFNO1lBQ3pCLE9BQU8sSUFBSSxLQUFLLEtBQUssUUFBUSxLQUFLLFlBQVk7Ozs7O0FBSTFEO0FDckRBLENBQUMsWUFBWTtJQUNUOztJQUVBLFFBQVEsT0FBTztTQUNWLFdBQVcsV0FBVzs7O0lBRzNCLFNBQVMsVUFBVSxXQUFXOztRQUUxQixJQUFJLE1BQU07UUFDVixJQUFJLFdBQVc7UUFDZixJQUFJLFdBQVc7O1FBRWY7Ozs7UUFJQSxTQUFTLFFBQVE7WUFDYixJQUFJLFdBQVcsVUFBVSxLQUFLOztZQUU5QixJQUFJLFdBQVc7Z0JBQ1gsV0FBVyxJQUFJLEtBQUssSUFBSSxTQUFTLEdBQUc7Z0JBQ3BDLFNBQVMsSUFBSSxLQUFLLElBQUksU0FBUyxHQUFHO2dCQUNsQyxPQUFPLElBQUksU0FBUyxHQUFHOzs7Ozs7O0FBTXZDO0FDN0JBLENBQUMsWUFBWTtJQUNUOztJQUVBLFFBQVEsT0FBTztTQUNWLFFBQVEsZUFBZTs7O0lBRzVCLFNBQVMsb0JBQW9CLE9BQU8sSUFBSSxVQUFVO1FBQzlDLElBQUksV0FBVztRQUNmLElBQUksWUFBWTtRQUNoQixJQUFJLFlBQVk7WUFDWixPQUFPO1lBQ1AsZUFBZSxJQUFJLEtBQUs7WUFDeEIsYUFBYSxJQUFJLEtBQUs7WUFDdEIsT0FBTztnQkFDSDtvQkFDSSxPQUFPO29CQUNQLE1BQU07b0JBQ04sS0FBSzt3QkFDRCxTQUFTO3dCQUNULGVBQWU7d0JBQ2YsYUFBYTt3QkFDYixlQUFlLElBQUksS0FBSzt3QkFDeEIsYUFBYSxJQUFJLEtBQUs7O29CQUUxQixJQUFJO3dCQUNBLFNBQVM7d0JBQ1QsZUFBZTt3QkFDZixhQUFhO3dCQUNiLGVBQWUsSUFBSSxLQUFLO3dCQUN4QixhQUFhLElBQUksS0FBSzs7O2dCQUc5QjtvQkFDSSxPQUFPO29CQUNQLE1BQU07b0JBQ04sS0FBSzt3QkFDRCxTQUFTO3dCQUNULGVBQWU7d0JBQ2YsYUFBYTt3QkFDYixlQUFlLElBQUksS0FBSzt3QkFDeEIsYUFBYSxJQUFJLEtBQUs7O29CQUUxQixJQUFJO3dCQUNBLFNBQVM7d0JBQ1QsZUFBZTt3QkFDZixhQUFhO3dCQUNiLGVBQWUsSUFBSSxLQUFLO3dCQUN4QixhQUFhLElBQUksS0FBSzs7Ozs7OztRQU90QyxPQUFPO1lBQ0gsS0FBSztZQUNMLGFBQWE7WUFDYixhQUFhOzs7OztRQUtqQixTQUFTLE9BQU87WUFDWixPQUFPLE1BQU07OztRQUdqQixTQUFTLGVBQWU7WUFDcEIsT0FBTzs7O1FBR1gsU0FBUyxhQUFhLElBQUk7WUFDdEIsWUFBWTs7OztRQUloQixTQUFTLE9BQU8sUUFBUTtZQUNwQixPQUFPLE1BQU0sS0FBSyxVQUFVO2lCQUN2QixRQUFRLFVBQVUsTUFBTTtvQkFDckIsUUFBUSxJQUFJLGNBQWM7b0JBQzFCLE9BQU87Ozs7OztBQUszQiIsImZpbGUiOiJ3YW5kZXJsdXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbiAgICBhbmd1bGFyLm1vZHVsZSgnV2FuZGVybHVzdEFwcCcsIFtcbiAgICAgICAgJ25nUm91dGUnLFxuICAgICAgICAnbmdBbmltYXRlJyxcbiAgICAgICAgJ3VpLmJvb3RzdHJhcCdcbiAgICBdKS5jb25maWcoY29uZmlnKS5ydW4oc2V0dXApO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gY29uZmlnICgkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcblxuICAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAgICAgLndoZW4oJy8nLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvbmcvaG9tZS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSG9tZUN0cmwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJyR2bSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbignL3RyaXAnLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvbmcvdHJpcC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVHJpcEN0cmwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJyR2bScsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICB0cmlwUXVlcnk6IGZ1bmN0aW9uICgkcm91dGUsIHdsVHJpcFF1ZXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHJvdXRlLmN1cnJlbnQucGFyYW1zLnN0YXJ0RGF0ZSAmJiAkcm91dGUuY3VycmVudC5wYXJhbXMuZW5kRGF0ZSAmJiAkcm91dGUuY3VycmVudC5wYXJhbXMudGhlbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHJpcEluZm8gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0RGF0ZTogbmV3IERhdGUoJHJvdXRlLmN1cnJlbnQucGFyYW1zLnN0YXJ0RGF0ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZERhdGU6IG5ldyBEYXRlKCRyb3V0ZS5jdXJyZW50LnBhcmFtcy5lbmREYXRlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlbWU6ICRyb3V0ZS5jdXJyZW50LnBhcmFtcy50aGVtZS50b1VwcGVyQ2FzZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWRnZXQ6ICAkcm91dGUuY3VycmVudC5wYXJhbXMuYnVkZ2V0IHx8IDEwMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdsVHJpcFF1ZXJ5LnNldFRyaXBJbmZvKHRyaXBJbmZvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2dldCB0cmlwIHF1ZXJ5Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2xUcmlwUXVlcnkuZ2V0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLndoZW4oJy9kZXRhaWxzLzp0cmlwSW5kZXgnLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvbmcvZGV0YWlscy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRGV0YWlsQ3RybCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnJHZtJyxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIHRyaXBEZXRhaWxzOiBmdW5jdGlvbiAoJHJvdXRlLCB3bFRyaXBRdWVyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gJHJvdXRlLmN1cnJlbnQucGFyYW1zLnRyaXBJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB3bFRyaXBRdWVyeS5nZXQoaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5vdGhlcndpc2UoXCIvXCIpO1xuXG4gICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXR1cCAoKSB7XG4gICAgICAgICQubWF0ZXJpYWwuaW5pdCgpO1xuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdXYW5kZXJsdXN0QXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0RldGFpbEN0cmwnLCBEZXRhaWxDdHJsKTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIERldGFpbEN0cmwgKCRyb3V0ZVBhcmFtcywgdHJpcERldGFpbHMpIHtcbiAgICAgICAgLyoganNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICAgIHZhciAkdm0gPSB0aGlzO1xuXG4gICAgICAgICR2bS5pbmRleCA9ICRyb3V0ZVBhcmFtcy50cmlwSW5kZXg7XG4gICAgICAgICR2bS5kZXRhaWxzID0gdHJpcERldGFpbHM7XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ1dhbmRlcmx1c3RBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignSG9tZUN0cmwnLEhvbWVDdHJsKTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIEhvbWVDdHJsICgkbG9jYXRpb24sIHdsVHJpcFF1ZXJ5KSB7XG4gICAgICAgIC8qIGpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgICB2YXIgJHZtID0gdGhpcyxcbiAgICAgICAgICAgIHRvbW9ycm93ID0gX2dldE5leHREYXRlKG5ldyBEYXRlKCkpLFxuICAgICAgICAgICAgZGF5QWZ0ZXJOZXh0ID0gX2dldE5leHREYXRlKG5ldyBEYXRlKHRvbW9ycm93KSk7XG5cbiAgICAgICAgJHZtLmRhdGVwaWNrZXJDb25maWcgPSB7XG4gICAgICAgICAgICBtaW5EYXRlOiBuZXcgRGF0ZSgpLFxuICAgICAgICB9O1xuXG4gICAgICAgICR2bS50cmlwSW5mbyA9IHtcbiAgICAgICAgICAgIHN0YXJ0RGF0ZTogdG9tb3Jyb3csXG4gICAgICAgICAgICBlbmREYXRlOiBkYXlBZnRlck5leHQsXG4gICAgICAgICAgICB0aGVtZTogJycsXG4gICAgICAgICAgICBidWRnZXQ6ICcxMDAwJyxcbiAgICAgICAgfTtcblxuICAgICAgICAkdm0udGhlbWVMaXN0ID0gW1xuICAgICAgICAgICAgeyBuYW1lOiAnQmVhY2gnLCBrZXk6ICdCRUFDSCcgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ0Rpc25leScsIGtleTogJ0RJU05FWScgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ0dhbWJsaW5nJywga2V5OiAnR0FNQkxJTkcnIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdIaXN0b3JpYycsIGtleTogJ0hJU1RPUklDJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnTW91bnRhaW5zJywga2V5OiAnTU9VTlRBSU5TJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnTmF0aW9uYWwtUGFya3MnLCBrZXk6ICdOQVRJT05BTC1QQVJLUycgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ091dGRvb3JzJywga2V5OiAnT1VURE9PUlMnIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdSb21hbnRpYycsIGtleTogJ1JPTUFOVElDJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnU2hvcHBpbmcnLCBrZXk6ICdTSE9QUElORycgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ1NraWluZycsIGtleTogJ1NLSUlORycgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ1RoZW1lLVBhcmsnLCBrZXk6ICdUSEVNRS1QQVJLJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnQ2FyaWJiZWFuJywga2V5OiAnQ0FSSUJCRUFOJyB9XG4gICAgICAgIF07XG5cbiAgICAgICAgJHZtLnN1Ym1pdEZvcm0gPSBzdWJtaXRGb3JtO1xuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgZnVuY3Rpb24gc3VibWl0Rm9ybSAoKSB7XG4gICAgICAgICAgICB3bFRyaXBRdWVyeS5zZXRUcmlwSW5mbygkdm0udHJpcEluZm8pO1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy90cmlwJykuc2VhcmNoKCR2bS50cmlwSW5mbyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfZ2V0TmV4dERhdGUgKGRhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyAxKSk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnV2FuZGVybHVzdEFwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdUcmlwQ3RybCcsVHJpcEN0cmwpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gVHJpcEN0cmwgKHRyaXBRdWVyeSkge1xuICAgICAgICAvKiBqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgICAgdmFyICR2bSA9IHRoaXM7XG4gICAgICAgICR2bS50cmlwTGlzdCA9IFtdO1xuICAgICAgICAkdm0udHJpcEluZm8gPSB7fTtcblxuICAgICAgICBpbml0KCk7XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiBpbml0ICgpIHtcbiAgICAgICAgICAgICR2bS50cmlwTGlzdCA9IHRyaXBRdWVyeS5kYXRhLkZhcmVJbmZvO1xuXG4gICAgICAgICAgICAkdm0udHJpcEluZm8gPSB7XG4gICAgICAgICAgICAgICAgc3RhcnREYXRlOiBuZXcgRGF0ZSgkdm0udHJpcExpc3RbMF0uRGVwYXJ0dXJlRGF0ZVRpbWUpLFxuICAgICAgICAgICAgICAgIGVuZERhdGU6IG5ldyBEYXRlKCR2bS50cmlwTGlzdFswXS5SZXR1cm5EYXRlVGltZSksXG4gICAgICAgICAgICAgICAgdGhlbWU6ICR2bS50cmlwTGlzdFswXS5UaGVtZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ1dhbmRlcmx1c3RBcHAnKVxuICAgICAgICAuZmFjdG9yeSgnd2xUcmlwUXVlcnknLCB3bFRyaXBRdWVyeUZhY3RvcnkpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gd2xUcmlwUXVlcnlGYWN0b3J5ICgkaHR0cCwgJHEsICR0aW1lb3V0KSB7XG4gICAgICAgIHZhciBlbmRQb2ludCA9ICcvZGVzdF9maW5kZXInO1xuICAgICAgICB2YXIgX3RyaXBJbmZvID0ge307XG4gICAgICAgIHZhciBfbW9ja0RhdGEgPSB7XG4gICAgICAgICAgICB0aGVtZTogJ1RIRU1FLVBBUksnLFxuICAgICAgICAgICAgZGVwYXJ0dXJlRGF0ZTogbmV3IERhdGUoJzEwLzAxLzIwMTUnKSxcbiAgICAgICAgICAgIGFycml2YWxEYXRlOiBuZXcgRGF0ZSgnMTAvMDQvMjAxNScpLFxuICAgICAgICAgICAgdHJpcHM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiAxLFxuICAgICAgICAgICAgICAgICAgICBjaXR5OiAnTG9zIEFuZ2VsZXMnLFxuICAgICAgICAgICAgICAgICAgICBvdXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFpcmxpbmU6ICdWaXJnaW4gQW1lcmljYScsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXBhcnR1cmVJQVRBOiAnU0ZPJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycml2YWxJQVRBOiAnTEFYJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcGFydHVyZURhdGU6IG5ldyBEYXRlKCcxMC8wMS8yMDE1IDA5OjAwJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJpdmFsRGF0ZTogbmV3IERhdGUoJzEwLzAxLzIwMTUgMTA6MzAnKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBpbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWlybGluZTogJ1ZpcmdpbiBBbWVyaWNhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcGFydHVyZUlBVEE6ICdMQVgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyaXZhbElBVEE6ICdTRk8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwYXJ0dXJlRGF0ZTogbmV3IERhdGUoJzEwLzA0LzIwMTUgMjA6MjUnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycml2YWxEYXRlOiBuZXcgRGF0ZSgnMTAvMDQvMjAxNSAyMjowMCcpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IDIsXG4gICAgICAgICAgICAgICAgICAgIGNpdHk6ICdCb3N0b24nLFxuICAgICAgICAgICAgICAgICAgICBvdXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFpcmxpbmU6ICdBbWVyaWNhbiBBaXJsaW5lcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXBhcnR1cmVJQVRBOiAnU0ZPJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycml2YWxJQVRBOiAnQk9TJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcGFydHVyZURhdGU6IG5ldyBEYXRlKCcxMC8wMS8yMDE1IDExOjAwJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJpdmFsRGF0ZTogbmV3IERhdGUoJzEwLzAxLzIwMTUgMTI6MzAnKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBpbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWlybGluZTogJ0FtZXJpY2FuIEFpcmxpbmVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcGFydHVyZUlBVEE6ICdCT1MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyaXZhbElBVEE6ICdTRk8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwYXJ0dXJlRGF0ZTogbmV3IERhdGUoJzEwLzA0LzIwMTUgMjI6MjUnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycml2YWxEYXRlOiBuZXcgRGF0ZSgnMTAvMDQvMjAxNSAyMzo1MCcpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG5cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0OiBnZXQsXG4gICAgICAgICAgICBnZXRUcmlwSW5mbzogZ2V0VHJpcEluZm8sXG4gICAgICAgICAgICBzZXRUcmlwSW5mbzogc2V0VHJpcEluZm9cbiAgICAgICAgfTtcblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX1BPU1QoX3RyaXBJbmZvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFRyaXBJbmZvICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdHJpcEluZm87XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRUcmlwSW5mbyAodGkpIHtcbiAgICAgICAgICAgIF90cmlwSW5mbyA9IHRpO1xuICAgICAgICB9XG5cblxuICAgICAgICBmdW5jdGlvbiBfUE9TVCAocGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChlbmRQb2ludCwgcGFyYW1zKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdnZXQgc3R1ZmYhJywgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==