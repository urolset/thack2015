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
                    tripQuery: function ($route, utils, wlTripQuery) {
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
                    }
                }
            })
            .when('/trip/:tripIndex', {
                templateUrl: '/ng/details.html',
                controller: 'DetailCtrl',
                controllerAs: '$vm',
                resolve: {
                    tripDetails: function ($route, wlTripQuery) {
                        var index = $route.current.params.tripIndex;

                        return wlTripQuery.getIndex(index);
                    }
                }
            })
            .otherwise("/");

        $locationProvider.html5Mode(true);
    }

    function setup () {
        $.material.init();
        $(".select").dropdown({ "autoinit" : ".select" });
    }
})();
