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
})();
