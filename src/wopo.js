/**
 * wopo
 * @version v1.3.4 - 2015-09-19 * @link https://github.com/damasio34/wopo
 * @author Darlan Damasio <darlan@damasio34.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function (angular) {

    'use strict';

    // módulos
    angular.module('wopo.services', []);    

    // módulo root do app
    var app = angular.module('wopo', ['wopo.services']);   
    app.provider('$wopo', function() {      
        var _APP_ID, _REST_API_KEY;
        var _UsuarioPrecisaEstarAutenticado = true;
        
        this.setAppId = function (value) {
            _APP_ID = value;
        };
        
        this.setRestApiKey = function (value) {
            _REST_API_KEY = value;
        };
        
        this.setUsuarioPrecisaEstarAutenticado = function (value) {
            _UsuarioPrecisaEstarAutenticado = value;
        };
        
        this.$get = function() {
            if (!_APP_ID) console.error("A configuração APP_ID não foi definida"); 
            if (!_REST_API_KEY) console.error("A configuração REST_API_KEY não foi definida");
            return {
                APP_ID: _APP_ID,
                REST_API_KEY: _REST_API_KEY,
                UsuarioPrecisaEstarAutenticado: _UsuarioPrecisaEstarAutenticado
            };
        };

    });

})(angular);