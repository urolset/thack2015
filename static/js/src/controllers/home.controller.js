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
})();
