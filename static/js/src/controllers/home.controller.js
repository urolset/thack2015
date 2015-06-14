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
})();
