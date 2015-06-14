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
                    tripQuery: function (wlTripQuery) {
                        return wlTripQuery.get();
                    }
                }
            })
            .state('details', {
                url: '/details/:tripIndex',
                templateUrl: '/ng/details.html',
                controller: 'DetailCtrl',
                controllerAs: '$vm',
                resolve: {
                    tripDetails: function ($stateParams, wlTripQuery) {
                        var index = $stateParams.tripIndex;
                        return wlTripQuery.get(index);
                    }
                }
            });

        $locationProvider.html5Mode(true);
    }

    function setup () {
        $.material.init();
    }
})();
