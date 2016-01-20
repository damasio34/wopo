(function (angular, CryptoJS){
    'use strict';
    
    if (!CryptoJS) console.error("É necessário importar a biblioteca cryptojs-sha1.js");

    angular
        .module('wopo.services')
        .factory('CryptSha1Service', CryptSha1Service);
        
    function CryptSha1Service() {

        var _service = {
             hash: hash   
        };
    
        return _service;
        
        // Implementação        
        function hash(value) {
            var str = JSON.stringify(value);
            return CryptoJS.SHA1(str).toString();
        }
    }

})(angular, CryptoJS);