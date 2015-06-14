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
})();
