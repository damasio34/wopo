(function (angular) {

    var services = angular.module('wopo.services');
    services.service('ListHelperService', function() {

        var _listarItens = function ($modelService, $scope) {
            return $modelService.getAll().success(function(data) {
				$scope.itens = data.results;
                // console.log(data.results);
			}, function(ex) { throw ex; });
        };

        var _atualizarItens = function($modelService, $scope) {
            _listarItens($modelService, $scope).success(function () {
                $scope.$broadcast('scroll.refreshComplete');            
            }, function(ex) { throw ex; });
        };

        var _excluirItem = function($modelService, $scope, item) {
            return $modelService.excluir(item.objectId).success(function(data) {
                $scope.itens.splice($scope.itens.indexOf(item), 1);
            }, function(ex) { throw ex; });
        };

        this.applySettings = function($controller, $scope, $modelService) {
            if (!$scope) throw "Variável '$scope' precisa ser definda";

            if (!$scope) throw "Variável '$modelService' precisa ser definda";

            // $scope.showDelete = true;

            if (!!$scope.queryBuscar) {
	            $scope.limparBuscar = function() {
		    		$scope.queryBuscar = '';
		  		};
		  	}

		  	$controller.listarItens = function() {
                return _listarItens($modelService, $scope);
            };
            $scope.atualizarItens = function() {
                return _atualizarItens($modelService, $scope);
            };
            $scope.excluirItem = function(item) {
                return _excluirItem($modelService, $scope, item);
            };
        };

    });

})(angular);