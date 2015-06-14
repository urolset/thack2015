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
