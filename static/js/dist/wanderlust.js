(function () {
    angular.module('WanderlustApp', [
        //'ngRoute',
        'ngAnimate',
        'ui.router',
        'ui.bootstrap'
    ]).config(config).run(setup);

    /* @ngInject */
    function config ($stateProvider, $urlRouterProvider, $locationProvider) {
        /*$routeProvider
            .when('/', {
                templateUrl: '/ng/home.html'
            })
            .otherwise({
                redirectTo: '/404'
            });*/

        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/ng/home.html',
                controller: 'HomeCtrl',
                controllerAs: '$vm'
            })
            .state('trip', {
                url: '/trip',
                templateUrl: '/ng/trip.html',
                controller: 'TripCtrl',
                controllerAs: '$vm',
                resolve: {
                    tripQuery: ["wlTripQuery", function (wlTripQuery) {
                        return wlTripQuery.get();
                    }]
                }
            })
            .state('details', {
                url: '/details/:tripIndex',
                templateUrl: '/ng/details.html',
                controller: 'DetailCtrl',
                controllerAs: '$vm',
                resolve: {
                    tripDetails: ["$stateParams", "wlTripQuery", function ($stateParams, wlTripQuery) {
                        var index = $stateParams.tripIndex;
                        return wlTripQuery.get(index);
                    }]
                }
            });

        $locationProvider.html5Mode(true);
    }
    config.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider"];

    function setup () {
        $.material.init();
    }
})();

(function () {
    'use strict';

    angular.module('WanderlustApp')
        .controller('DetailCtrl', DetailCtrl);

    /* @ngInject */
    function DetailCtrl ($stateParams, tripDetails) {
        /* jshint validthis:true */
        var $vm = this;

        $vm.index = $stateParams.tripIndex;
        $vm.details = tripDetails;
    }
    DetailCtrl.$inject = ["$stateParams", "tripDetails"];
})();

(function () {
    'use strict';

    angular.module('WanderlustApp')
        .controller('HomeCtrl',HomeCtrl);

    /* @ngInject */
    function HomeCtrl ($state) {
        /* jshint validthis:true */
        var $vm = this;

        $vm.datepickerConfig = {
            minDate: new Date(),
        };

        $vm.tripInfo = {
            startDate: new Date(),
            endDate: new Date(),
            budget: '',
            theme: '',
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
            $state.go('trip');
        }
    }
    HomeCtrl.$inject = ["$state"];
})();

(function () {
    'use strict';

    angular.module('WanderlustApp')
        .controller('TripCtrl',TripCtrl);

    /* @ngInject */
    function TripCtrl ($state, tripQuery) {
        /* jshint validthis:true */
        var $vm = this;
        $vm.tripList = [];
        $vm.tripInfo = {};

        init();

        ////////////////////////////////////////////////////////////////////////////////

        function init () {
            $vm.tripInfo = {
                startDate: tripQuery.departureDate,
                endDate: tripQuery.arrivalDate,
                theme: tripQuery.theme
            };

            $vm.tripList = tripQuery.trips;
        }

    }
    TripCtrl.$inject = ["$state", "tripQuery"];
})();

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
    wlTripQueryFactory.$inject = ["$q", "$timeout"];
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tYWluLmpzIiwiY29udHJvbGxlcnMvZGV0YWlsLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9ob21lLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy90cmlwLmNvbnRyb2xsZXIuanMiLCJzZXJ2aWNlcy93bC10cmlwLXF1ZXJ5LnNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQyxZQUFZO0lBQ1QsUUFBUSxPQUFPLGlCQUFpQjs7UUFFNUI7UUFDQTtRQUNBO09BQ0QsT0FBTyxRQUFRLElBQUk7OztJQUd0QixTQUFTLFFBQVEsZ0JBQWdCLG9CQUFvQixtQkFBbUI7Ozs7Ozs7OztRQVNwRSxtQkFBbUIsVUFBVTs7UUFFN0I7YUFDSyxNQUFNLFFBQVE7Z0JBQ1gsS0FBSztnQkFDTCxhQUFhO2dCQUNiLFlBQVk7Z0JBQ1osY0FBYzs7YUFFakIsTUFBTSxRQUFRO2dCQUNYLEtBQUs7Z0JBQ0wsYUFBYTtnQkFDYixZQUFZO2dCQUNaLGNBQWM7Z0JBQ2QsU0FBUztvQkFDTCwyQkFBVyxVQUFVLGFBQWE7d0JBQzlCLE9BQU8sWUFBWTs7OzthQUk5QixNQUFNLFdBQVc7Z0JBQ2QsS0FBSztnQkFDTCxhQUFhO2dCQUNiLFlBQVk7Z0JBQ1osY0FBYztnQkFDZCxTQUFTO29CQUNMLDZDQUFhLFVBQVUsY0FBYyxhQUFhO3dCQUM5QyxJQUFJLFFBQVEsYUFBYTt3QkFDekIsT0FBTyxZQUFZLElBQUk7Ozs7O1FBS3ZDLGtCQUFrQixVQUFVOzs7O0lBR2hDLFNBQVMsU0FBUztRQUNkLEVBQUUsU0FBUzs7O0FBR25CO0FDMURBLENBQUMsWUFBWTtJQUNUOztJQUVBLFFBQVEsT0FBTztTQUNWLFdBQVcsY0FBYzs7O0lBRzlCLFNBQVMsWUFBWSxjQUFjLGFBQWE7O1FBRTVDLElBQUksTUFBTTs7UUFFVixJQUFJLFFBQVEsYUFBYTtRQUN6QixJQUFJLFVBQVU7Ozs7QUFHdEI7QUNmQSxDQUFDLFlBQVk7SUFDVDs7SUFFQSxRQUFRLE9BQU87U0FDVixXQUFXLFdBQVc7OztJQUczQixTQUFTLFVBQVUsUUFBUTs7UUFFdkIsSUFBSSxNQUFNOztRQUVWLElBQUksbUJBQW1CO1lBQ25CLFNBQVMsSUFBSTs7O1FBR2pCLElBQUksV0FBVztZQUNYLFdBQVcsSUFBSTtZQUNmLFNBQVMsSUFBSTtZQUNiLFFBQVE7WUFDUixPQUFPOzs7UUFHWCxJQUFJLFlBQVk7WUFDWixFQUFFLE1BQU0sU0FBUyxLQUFLO1lBQ3RCLEVBQUUsTUFBTSxVQUFVLEtBQUs7WUFDdkIsRUFBRSxNQUFNLFlBQVksS0FBSztZQUN6QixFQUFFLE1BQU0sWUFBWSxLQUFLO1lBQ3pCLEVBQUUsTUFBTSxhQUFhLEtBQUs7WUFDMUIsRUFBRSxNQUFNLGtCQUFrQixLQUFLO1lBQy9CLEVBQUUsTUFBTSxZQUFZLEtBQUs7WUFDekIsRUFBRSxNQUFNLFlBQVksS0FBSztZQUN6QixFQUFFLE1BQU0sWUFBWSxLQUFLO1lBQ3pCLEVBQUUsTUFBTSxVQUFVLEtBQUs7WUFDdkIsRUFBRSxNQUFNLGNBQWMsS0FBSztZQUMzQixFQUFFLE1BQU0sYUFBYSxLQUFLOzs7UUFHOUIsSUFBSSxhQUFhOzs7O1FBSWpCLFNBQVMsY0FBYztZQUNuQixPQUFPLEdBQUc7Ozs7O0FBSXRCO0FDOUNBLENBQUMsWUFBWTtJQUNUOztJQUVBLFFBQVEsT0FBTztTQUNWLFdBQVcsV0FBVzs7O0lBRzNCLFNBQVMsVUFBVSxRQUFRLFdBQVc7O1FBRWxDLElBQUksTUFBTTtRQUNWLElBQUksV0FBVztRQUNmLElBQUksV0FBVzs7UUFFZjs7OztRQUlBLFNBQVMsUUFBUTtZQUNiLElBQUksV0FBVztnQkFDWCxXQUFXLFVBQVU7Z0JBQ3JCLFNBQVMsVUFBVTtnQkFDbkIsT0FBTyxVQUFVOzs7WUFHckIsSUFBSSxXQUFXLFVBQVU7Ozs7OztBQUtyQztBQzdCQSxDQUFDLFlBQVk7SUFDVDs7SUFFQSxRQUFRLE9BQU87U0FDVixRQUFRLGVBQWU7OztJQUc1QixTQUFTLG9CQUFvQixJQUFJLFVBQVU7UUFDdkMsSUFBSSxZQUFZO1lBQ1osT0FBTztZQUNQLGVBQWUsSUFBSSxLQUFLO1lBQ3hCLGFBQWEsSUFBSSxLQUFLO1lBQ3RCLE9BQU87Z0JBQ0g7b0JBQ0ksT0FBTztvQkFDUCxNQUFNO29CQUNOLEtBQUs7d0JBQ0QsU0FBUzt3QkFDVCxlQUFlO3dCQUNmLGFBQWE7d0JBQ2IsZUFBZSxJQUFJLEtBQUs7d0JBQ3hCLGFBQWEsSUFBSSxLQUFLOztvQkFFMUIsSUFBSTt3QkFDQSxTQUFTO3dCQUNULGVBQWU7d0JBQ2YsYUFBYTt3QkFDYixlQUFlLElBQUksS0FBSzt3QkFDeEIsYUFBYSxJQUFJLEtBQUs7OztnQkFHOUI7b0JBQ0ksT0FBTztvQkFDUCxNQUFNO29CQUNOLEtBQUs7d0JBQ0QsU0FBUzt3QkFDVCxlQUFlO3dCQUNmLGFBQWE7d0JBQ2IsZUFBZSxJQUFJLEtBQUs7d0JBQ3hCLGFBQWEsSUFBSSxLQUFLOztvQkFFMUIsSUFBSTt3QkFDQSxTQUFTO3dCQUNULGVBQWU7d0JBQ2YsYUFBYTt3QkFDYixlQUFlLElBQUksS0FBSzt3QkFDeEIsYUFBYSxJQUFJLEtBQUs7Ozs7Ozs7UUFPdEMsT0FBTztZQUNILEtBQUs7Ozs7O1FBS1QsU0FBUyxLQUFLLE9BQU87WUFDakIsSUFBSSxRQUFRLEdBQUc7O1lBRWYsU0FBUyxZQUFZO2dCQUNqQixJQUFJLFNBQVMsUUFBUSxTQUFTLFNBQVMsU0FBUztvQkFDNUMsUUFBUSxJQUFJO29CQUNaLE1BQU0sUUFBUSxVQUFVLE1BQU0sTUFBTTt1QkFDakM7b0JBQ0gsTUFBTSxRQUFROztlQUVuQjs7WUFFSCxPQUFPLE1BQU07Ozs7O0FBSXpCIiwiZmlsZSI6IndhbmRlcmx1c3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuICAgIGFuZ3VsYXIubW9kdWxlKCdXYW5kZXJsdXN0QXBwJywgW1xuICAgICAgICAvLyduZ1JvdXRlJyxcbiAgICAgICAgJ25nQW5pbWF0ZScsXG4gICAgICAgICd1aS5yb3V0ZXInLFxuICAgICAgICAndWkuYm9vdHN0cmFwJ1xuICAgIF0pLmNvbmZpZyhjb25maWcpLnJ1bihzZXR1cCk7XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBjb25maWcgKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAgICAgIC8qJHJvdXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC53aGVuKCcvJywge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL25nL2hvbWUuaHRtbCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAub3RoZXJ3aXNlKHtcbiAgICAgICAgICAgICAgICByZWRpcmVjdFRvOiAnLzQwNCdcbiAgICAgICAgICAgIH0pOyovXG5cbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShcIi9cIik7XG5cbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZScsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy9ob21lLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ3RybCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnJHZtJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgndHJpcCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvdHJpcCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvbmcvdHJpcC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVHJpcEN0cmwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJyR2bScsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICB0cmlwUXVlcnk6IGZ1bmN0aW9uICh3bFRyaXBRdWVyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdsVHJpcFF1ZXJ5LmdldCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnZGV0YWlscycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlscy86dHJpcEluZGV4JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy9kZXRhaWxzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdEZXRhaWxDdHJsJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICckdm0nLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgdHJpcERldGFpbHM6IGZ1bmN0aW9uICgkc3RhdGVQYXJhbXMsIHdsVHJpcFF1ZXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAkc3RhdGVQYXJhbXMudHJpcEluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdsVHJpcFF1ZXJ5LmdldChpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0dXAgKCkge1xuICAgICAgICAkLm1hdGVyaWFsLmluaXQoKTtcbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnV2FuZGVybHVzdEFwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdEZXRhaWxDdHJsJywgRGV0YWlsQ3RybCk7XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBEZXRhaWxDdHJsICgkc3RhdGVQYXJhbXMsIHRyaXBEZXRhaWxzKSB7XG4gICAgICAgIC8qIGpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgICB2YXIgJHZtID0gdGhpcztcblxuICAgICAgICAkdm0uaW5kZXggPSAkc3RhdGVQYXJhbXMudHJpcEluZGV4O1xuICAgICAgICAkdm0uZGV0YWlscyA9IHRyaXBEZXRhaWxzO1xuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdXYW5kZXJsdXN0QXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJyxIb21lQ3RybCk7XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBIb21lQ3RybCAoJHN0YXRlKSB7XG4gICAgICAgIC8qIGpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgICB2YXIgJHZtID0gdGhpcztcblxuICAgICAgICAkdm0uZGF0ZXBpY2tlckNvbmZpZyA9IHtcbiAgICAgICAgICAgIG1pbkRhdGU6IG5ldyBEYXRlKCksXG4gICAgICAgIH07XG5cbiAgICAgICAgJHZtLnRyaXBJbmZvID0ge1xuICAgICAgICAgICAgc3RhcnREYXRlOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgZW5kRGF0ZTogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIGJ1ZGdldDogJycsXG4gICAgICAgICAgICB0aGVtZTogJycsXG4gICAgICAgIH07XG5cbiAgICAgICAgJHZtLnRoZW1lTGlzdCA9IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ0JlYWNoJywga2V5OiAnQkVBQ0gnIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdEaXNuZXknLCBrZXk6ICdESVNORVknIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdHYW1ibGluZycsIGtleTogJ0dBTUJMSU5HJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnSGlzdG9yaWMnLCBrZXk6ICdISVNUT1JJQycgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ01vdW50YWlucycsIGtleTogJ01PVU5UQUlOUycgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ05hdGlvbmFsLVBhcmtzJywga2V5OiAnTkFUSU9OQUwtUEFSS1MnIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdPdXRkb29ycycsIGtleTogJ09VVERPT1JTJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnUm9tYW50aWMnLCBrZXk6ICdST01BTlRJQycgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ1Nob3BwaW5nJywga2V5OiAnU0hPUFBJTkcnIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdTa2lpbmcnLCBrZXk6ICdTS0lJTkcnIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdUaGVtZS1QYXJrJywga2V5OiAnVEhFTUUtUEFSSycgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ0NhcmliYmVhbicsIGtleTogJ0NBUklCQkVBTicgfVxuICAgICAgICBdO1xuXG4gICAgICAgICR2bS5zdWJtaXRGb3JtID0gc3VibWl0Rm9ybTtcblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Ym1pdEZvcm0gKCkge1xuICAgICAgICAgICAgJHN0YXRlLmdvKCd0cmlwJyk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnV2FuZGVybHVzdEFwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdUcmlwQ3RybCcsVHJpcEN0cmwpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gVHJpcEN0cmwgKCRzdGF0ZSwgdHJpcFF1ZXJ5KSB7XG4gICAgICAgIC8qIGpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgICB2YXIgJHZtID0gdGhpcztcbiAgICAgICAgJHZtLnRyaXBMaXN0ID0gW107XG4gICAgICAgICR2bS50cmlwSW5mbyA9IHt9O1xuXG4gICAgICAgIGluaXQoKTtcblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIGluaXQgKCkge1xuICAgICAgICAgICAgJHZtLnRyaXBJbmZvID0ge1xuICAgICAgICAgICAgICAgIHN0YXJ0RGF0ZTogdHJpcFF1ZXJ5LmRlcGFydHVyZURhdGUsXG4gICAgICAgICAgICAgICAgZW5kRGF0ZTogdHJpcFF1ZXJ5LmFycml2YWxEYXRlLFxuICAgICAgICAgICAgICAgIHRoZW1lOiB0cmlwUXVlcnkudGhlbWVcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICR2bS50cmlwTGlzdCA9IHRyaXBRdWVyeS50cmlwcztcbiAgICAgICAgfVxuXG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ1dhbmRlcmx1c3RBcHAnKVxuICAgICAgICAuZmFjdG9yeSgnd2xUcmlwUXVlcnknLCB3bFRyaXBRdWVyeUZhY3RvcnkpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gd2xUcmlwUXVlcnlGYWN0b3J5ICgkcSwgJHRpbWVvdXQpIHtcbiAgICAgICAgdmFyIF9tb2NrRGF0YSA9IHtcbiAgICAgICAgICAgIHRoZW1lOiAnVEhFTUUtUEFSSycsXG4gICAgICAgICAgICBkZXBhcnR1cmVEYXRlOiBuZXcgRGF0ZSgnMTAvMDEvMjAxNScpLFxuICAgICAgICAgICAgYXJyaXZhbERhdGU6IG5ldyBEYXRlKCcxMC8wNC8yMDE1JyksXG4gICAgICAgICAgICB0cmlwczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IDEsXG4gICAgICAgICAgICAgICAgICAgIGNpdHk6ICdMb3MgQW5nZWxlcycsXG4gICAgICAgICAgICAgICAgICAgIG91dDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWlybGluZTogJ1ZpcmdpbiBBbWVyaWNhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcGFydHVyZUlBVEE6ICdTRk8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyaXZhbElBVEE6ICdMQVgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwYXJ0dXJlRGF0ZTogbmV3IERhdGUoJzEwLzAxLzIwMTUgMDk6MDAnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycml2YWxEYXRlOiBuZXcgRGF0ZSgnMTAvMDEvMjAxNSAxMDozMCcpXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGluOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhaXJsaW5lOiAnVmlyZ2luIEFtZXJpY2EnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwYXJ0dXJlSUFUQTogJ0xBWCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJpdmFsSUFUQTogJ1NGTycsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXBhcnR1cmVEYXRlOiBuZXcgRGF0ZSgnMTAvMDQvMjAxNSAyMDoyNScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyaXZhbERhdGU6IG5ldyBEYXRlKCcxMC8wNC8yMDE1IDIyOjAwJylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpbmRleDogMixcbiAgICAgICAgICAgICAgICAgICAgY2l0eTogJ0Jvc3RvbicsXG4gICAgICAgICAgICAgICAgICAgIG91dDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWlybGluZTogJ0FtZXJpY2FuIEFpcmxpbmVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcGFydHVyZUlBVEE6ICdTRk8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyaXZhbElBVEE6ICdCT1MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwYXJ0dXJlRGF0ZTogbmV3IERhdGUoJzEwLzAxLzIwMTUgMTE6MDAnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycml2YWxEYXRlOiBuZXcgRGF0ZSgnMTAvMDEvMjAxNSAxMjozMCcpXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGluOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhaXJsaW5lOiAnQW1lcmljYW4gQWlybGluZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwYXJ0dXJlSUFUQTogJ0JPUycsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJpdmFsSUFUQTogJ1NGTycsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXBhcnR1cmVEYXRlOiBuZXcgRGF0ZSgnMTAvMDQvMjAxNSAyMjoyNScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyaXZhbERhdGU6IG5ldyBEYXRlKCcxMC8wNC8yMDE1IDIzOjUwJylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcblxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXQ6IGdldFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0IChpbmRleCkge1xuICAgICAgICAgICAgdmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcblxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCAmJiBhbmd1bGFyLmlzTnVtYmVyKHBhcnNlSW50KGluZGV4KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2dldCBzcGVjaWZpYyBpbmRleCcpO1xuICAgICAgICAgICAgICAgICAgICBkZWZlci5yZXNvbHZlKF9tb2NrRGF0YS50cmlwc1tpbmRleC0xXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXIucmVzb2x2ZShfbW9ja0RhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEwKTtcblxuICAgICAgICAgICAgcmV0dXJuIGRlZmVyLnByb21pc2U7XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9