(function (angular) {
    'use strict';

    angular
		.module('wopo.interceptors')
		.factory('ResultInterceptor', ResultInterceptor);
		
	// ResultInterceptor.$inject = ['$q'];
	
	function ResultInterceptor() {
		return {
			response: function (response) {
				if (angular.isObject(response.data) && ('results' in response.data)) {
					response.data = response.data.results;
				}
				
				return response; //|| $q.when(response);
			},
		};
	}
  
  })(angular);