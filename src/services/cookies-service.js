(function (angular) {
    'use strict';

    angular
        .module('wopo.services')
        .factory('CookiesSession', CookiesSession);

    CookiesSession.$injector = ['WebStorageService', '$rootScope'];

    function CookiesSession(WebStorageService, $rootScope) {

        // Public API here
        var _service = {
            getUsuario: getUsuario,
            // logout: logout,
            // setUsuario: setUsuario
        };

        return _service;

        // Implementação
        function getUsuario() {
            if (WebStorageService.getLocalStorage('_$currentUser')) {
                $rootScope.currentUser = WebStorageService.getLocalStorage('_$currentUser');
            }

            return $rootScope.currentUser;
        }
    }

})(angular);
