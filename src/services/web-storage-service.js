(function (angular) {

	var services = angular.module('wopo.services');
	services.factory('WebStorageService', function(){

		var _service = function(){

			this.setLocalStorage = function(key, value){
				if (!!value) localStorage[key] = JSON.stringify(value);
			};

			this.getLocalStorage = function(key){
				if (!!localStorage[key]) return JSON.parse(localStorage[key]);
				else return null;
			};

			this.setSessionStorage = function(key, value){
				if (!!value) sessionStorage[key] = JSON.stringify(value);
			};

			this.getSessionStorage = function(key){
				if (!!sessionStorage[key]) return JSON.parse(sessionStorage[key]);
				else return null;
			};

		};

		return new _service();
	});

})(angular);