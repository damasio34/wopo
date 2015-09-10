(function(angular) {

    var wopo = angular.module('wopo');
    wopo.provider('wopoProvider', function() {      
        var _APP_ID, _REST_API_KEY;

        return {
            setAppId: function (value) {
                _APP_ID = value;
            },
            setRestApiKey: function (value) {
                _REST_API_KEY = value;
            },
            $get: function () {
                return {
                    APP_ID: _APP_ID,
                    REST_API_KEY: _REST_API_KEY                    
                };
            }
        };
    });
      
})(angular);