(function (angular) {
    'use strict';

    angular
        .module('wopo.services')
        .service('ListHelperService', ListHelperService);

    function ListHelperService() {

        var _service = {
            applySettings: applySettings,
            _listarItens: _listarItens,
            _atualizarItens: _atualizarItens,
            _excluirItem: _excluirItem
        };

        return _service;

        function applySettings($controller, $scope, $modelService) {

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
        }

        function _listarItens($modelService, $scope) {
            return $modelService.getAll().success(function(data) {
				$scope.itens = data.results;
                // console.log(data.results);
			}, function(ex) { throw ex; });
        }

        function _atualizarItens($modelService, $scope) {
            _listarItens($modelService, $scope).success(function () {
                $scope.$broadcast('scroll.refreshComplete');
            }, function(ex) { throw ex; });
        }

        function _excluirItem($modelService, $scope, item) {
            return $modelService.excluir(item.objectId).success(function(data) {
                $scope.itens.splice($scope.itens.indexOf(item), 1);
            }, function(ex) { throw ex; });
        }

    }

})(angular);
