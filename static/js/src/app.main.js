(function () {
    angular.module('WanderlustApp', [
        'ngRoute',
        'ngAnimate'
    ]).config(config);

    /* @ngInject */
    function config ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/ng/home.html'
            })
            .otherwise({
                redirectTo: '/404'
            });

        $locationProvider.html5Mode(true);
    }
})();
