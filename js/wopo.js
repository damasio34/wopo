(function (angular) {

	'use strict';

	// módulo de services
	angular.module('wopo.services', []);
	angular.module('wopo.providers', []);

	// módulo root do app
	angular.module('wopo', ['wopo.services', 'wopo.providers']);

})(angular);