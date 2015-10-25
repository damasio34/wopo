(function (angular) {
    'use strict';

    angular
        .module('wopo.interceptors')
        .factory('RequestInterceptor', RequestInterceptor);
    
    RequestInterceptor.$inject = ['CookiesSession', '$wopo'];
      
    function RequestInterceptor(CookiesSession, $wopo) {
        return {
            request: function (config) {
                config.headers['X-Parse-Application-Id'] = $wopo.APP_ID;
                config.headers['X-Parse-REST-API-Key'] = $wopo.REST_API_KEY;
            
                var usuario = CookiesSession.getUsuario();
                if (usuario) {
                    config.headers['X-Parse-Session-Token'] = usuario.sessionToken;
                
                    // if (config.method === 'POST') {
                    //     if (!('ACL' in config.data)) {
                    //         config.data.ACL = {};
                    //     }
                    //     // Adding the access control list for the current request
                    //     config.data.ACL[usuario.objectId] = { read: true, write: true };
                    // }
                }
                return config; //|| $q.when(config);
            },
        };
    }
  
  })(angular);