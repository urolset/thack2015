(function () {
    'use strict';

    angular.module('WanderlustApp')
        .factory('wlTripQuery', wlTripQueryFactory);

    /* @ngInject */
    function wlTripQueryFactory ($http, $q, $timeout) {
        var endPoint = '/dest_finder',
            _tripInfo = {},
            _trip = {};

        return {
            get: get,
            getIndex: getIndex,
            getTripInfo: getTripInfo,
            setTripInfo: setTripInfo
        };

        ////////////////////////////////////////////////////////////////////

        function get () {
            if (_trip.FareInfo) {
                return _trip;
            }

            if (_tripInfo)

            return _POST(_tripInfo);
        }

        function getIndex (i) {
            console.log('index', i);
            if (_trip.FareInfo && _trip.FareInfo.length > 0) {
                return _trip.FareInfo[i];
            }

            return _POST(_tripInfo).then(function (data) {
                    console.log('get index', data);
                    return data.FareInfo[i];
                });
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
                    _trip = data;

                    return data;
                });
        }
    }
})();
