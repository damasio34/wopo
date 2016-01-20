(function (angular) {
	'use strict';

	angular
		.module('wopo.services')
		.factory('WebStorageService', WebStorageService);

	function WebStorageService() {

		var _service = {
			getLocalStorage: getLocalStorage,
			getSessionStorage: getSessionStorage,
			setLocalStorage: setLocalStorage,
			setSessionStorage: setSessionStorage			
		};
		
		return _service;

		function setLocalStorage(key, value){
			if (!!value) localStorage[key] = JSON.stringify(value);
		}

		function getLocalStorage(key){
			if (!!localStorage[key]) return JSON.parse(localStorage[key]);
			else return null;
		}

		function setSessionStorage(key, value){
			if (!!value) sessionStorage[key] = JSON.stringify(value);
		}

		function getSessionStorage(key){
			if (!!sessionStorage[key]) return JSON.parse(sessionStorage[key]);
			else return null;
		}
	}

})(angular);