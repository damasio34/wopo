/**
 * Bla bla bla
 * @version v1.4.0 - 2015-04-03 * @link https://github.com/damasio34/wopo
 * @author Darlan Damasio <darlan@damasio34.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function (angular) {

	'use strict';

	// módulos
	angular.module('wopo.services', []);	

	// módulo root do app
	var app = angular.module('wopo', ['wopo.services']);    
    app.provider('Wopo', function() {      
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