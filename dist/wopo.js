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
(function (angular, CryptoJS){
    
    if (!CryptoJS) console.error("É necessário importar a biblioteca cryptojs.js");

    var services = angular.module('wopo.services');
    services.factory('CryptSha1Service', function() {

        var _service = function() {

	        this.hash = function (value) {
	            var str = JSON.stringify(value);
	            return CryptoJS.SHA1(str).toString();
	        };
	    };

        return new _service();

    });

})(angular, CryptoJS);
// -- Form Helper --
// Serviço que centraliza as operações básicas de um formulário de inclusão/alteração de uma entidade.
(function (angular) {

    var services = angular.module('wopo.services');
    services.service('FormHelperService', function($location, $state, IonicPopupService) {

        var self = this;

        var _setDefaultRoute = function(defaultRoute) {
            self.defaultRoute = defaultRoute;
        };

        //Método Responsável por alternar o modo de Validação no Cliente, utilizado para modo Debug, para não validar os métodos no cliente
        var _habilitarOuDesabilitarValidacao = function($scope) {
            $scope.enabledValidations = !$scope.enabledValidations;
            return $scope.enabledValidations;
        };

        // Realiza o processo de inclusão do modelo imperativamente.
        var _salvarInclusao = function(model, $modelService, $scope) {
            return $modelService.incluir(model).success(function(data) {
                IonicPopupService.alert("Sucesso", "Dados cadastrados com sucess!", 3000);
                // ToDo: Trocar para state
                $location.path(self.defaultRoute);
                // $state.go(self.defaultRoute)
            }, function(ex) { throw ex; });
        };

        // Realiza o processo de alteração do modelo imperativamente.
        var _salvarAlteracao = function(model, $modelService, $scope) {
            return $modelService.editar(model).success(function(data) {
                $scope.OriginalModel = angular.copy(model);
            }, function(ex) { throw ex; });
        };

        // Verifica se os campos do formulario atendem as regras estabelecidas.
        var _formularioEhValido = function($scope) {
            if (!$scope.formulario) throw "Objeto Formulário não definido";

            return $scope.formulario.$valid;
        };

        var _canSubmit = function($scope) {
            return $scope.formularioEhValido() && $scope.usuarioAlterouFormulario();
        };

        // Determina o que fazer quando o usuário submter o formulário.
        var _submitForm = function($scope, formulario) {
            $scope.formulario = formulario;
            if ($scope.formularioEhValido()) {
                if ($scope.modoEdicao) {
                    if (!$scope.usuarioAlterouFormulario()) {
                        // AppNotificationsService.logWarning('Não há alterações a serem salvas.');
                        return;
                    }
                    return $scope.salvarAlteracao();
                } else return $scope.salvarInclusao();
            }
        };

        // verifica se há alterações a serem desfeitas no formulario.
        var _usuarioAlterouFormulario = function($scope) {
            return !angular.equals($scope.Model, $scope.OriginalModel);
        };

        // Desfaz as alterações realizadas no formulário.
        var _desfazerAlteracoesDoUsuario = function($scope) {
            angular.copy($scope.OriginalModel, $scope.Model);
            return $scope.Formulario.$setPristine();
        };

        var _isNullOrUndefined = function(objeto) {
            return objeto === null || objeto === undefined;
        };

        var _editByid = function(id, $scope, $modelService) {
            $scope.modoEdicao = true;

            //cria função padrão para obter o registro solicitado
            var obterRegistro = function(id, $scope, $modelService, sucesso, erro) {
                $modelService.getById(id).success(function(model) {
                    var hasValue = !!model;

                    if (hasValue) $scope.edit(model);

                    sucesso(model, model, hasValue);

                }, function(ex) {
                    throw ex;
                });
            };

            //cria prmoise que pode ser utilizada pelo desenvolvedor para controlar o momento
            //do retorno da resposta, incluindo a possibilidade de retornar as configurações carregadas
            return new Promise(function(sucesso, erro) {
                if ($scope.$config) {
                    configuracoesService.getByKey($scope.$config).then(function(result) {
                        $scope.$config = result;
                        obterRegistro(id, $scope, $modelService, sucesso, erro);
                    });
                }
                else obterRegistro(id, $scope, $modelService, sucesso, erro);
            });
        };

        var _edit = function(model, $scope) {
            // $scope.carregado = true;
            $scope.modoEdicao = true;
            $scope.Model = model;
            $scope.OriginalModel = angular.copy(model);
        };

        var _novoRegistro = function (defaultModel, $scope) {
            var novoModel = defaultModel || {};
            $scope.Model = novoModel;
            $scope.OriginalModel = angular.copy(novoModel);
            $scope.carregado = true;
        };

        // Determina comportamento que o formulário terá quando o usuário clicar em 'Sair'.
        var _sair = function($scope) {
            if ($scope.usuarioAlterouFormulario()) {
                // confirma se o usuário quer perder os dados não salvos.
                IonicPopupService.confirm("Alteração não salvas", "Deseja sair sem salvar as alterações?", 
                    function() { $location.path(self.defaultRoute);
                });
            } else $location.path(self.defaultRoute);
        };

        this.applySettings = function($controller, $scope, $modelService) {
            if (!$scope) throw "Variável '$scope' precisa ser definda";

            $scope.enabledValidations = true;

            $scope.salvarInclusao = function() {
                return _salvarInclusao($scope.Model, $modelService, $scope);
            };
            $scope.salvarAlteracao = function() {
                return _salvarAlteracao($scope.Model, $modelService, $scope);
            };
            $scope.formularioEhValido = function () {
                return _formularioEhValido($scope);
            };
            $scope.canSubmit = function() {
                return _canSubmit($scope);
            };
            $scope.submitForm = function(formulario) {                
                return _submitForm($scope, formulario);
            };
            $scope.usuarioAlterouFormulario = function() {
                return _usuarioAlterouFormulario($scope);
            };
            $scope.desfazerAlteracoesDoUsuario = function() {
                return _desfazerAlteracoesDoUsuario($scope);
            };
            $scope.sair = function() {
                return _sair($scope);
            };
            $scope.edit = function(model) {
                return _edit(model, $scope);
            };
            $controller.editById = function(id) {
                return _editByid(id, $scope, $modelService);
            };
            $controller.novoRegistro = function(model) {
                return _novoRegistro(model, $scope, $modelService);
            };
            $controller.isNullOrUndefined = function(objeto) {
                return _isNullOrUndefined(objeto);
            };
            $controller.setDefaultRoute = function(defaultRoute) {
                return _setDefaultRoute(defaultRoute);
            };
            $scope.habilitarOuDesabilitarValidacao = function() {
                return _habilitarOuDesabilitarValidacao($scope);
            };
            $scope.ExcluirModal = function(id, urlToRedirect) {
                return _excluirModal(id, urlToRedirect, $scope, $modelService);
            };
            $controller.confirmar = function(template, modelController) {
                return _confirmar($scope, template, modelController);
            };

            // $scope.MessageBox = kDialogo;
        };

        // // -------------------------------------------------------
        // // Incluido para tornar possível a exclusão do modelo direto na página de edição
        // // Abre o modal de exclusão
        // var _excluirModal = function(id, urlToRedirect, $scope, $modelService) {
        //     var modalInstance = $modal.open({
        //         templateUrl: "myModalContent.html",
        //         controller: 'ModalInstanceCtrl',
        //         resolve: {
        //             Model: function() {
        //                 return $modelService.getById(id).then(null, AppNotificationsService.showException);
        //             }
        //         }
        //     });
        //     modalInstance.result.then(function() {
        //         $modelService.removerPeloId(id).then(function() {
        //             var exibiu = AppNotificationsService.popupResponse(data);
        //             if (!exibiu) AppNotificationsService.logSuccess('Item excluído com sucesso.');
        //             $scope.sair(urlToRedirect);
        //         }); //AppNotificationsService.showException);
        //     }, function() {});
        // };
        // // -----------------------------------------------------------

    });

})(angular);
(function (angular) {

    var services = angular.module('wopo.services');
    services.factory('IonicPopupService', function($ionicPopup, $timeout) {

        var _service = function() {

            this.alert = function(titulo, template, fecharApos) {
                var alertPopup = $ionicPopup.alert({
                   title: titulo,
                   template: template
                });

                // alertPopup.then(function(res) {
                //     console.log('alert aberto');
                // });

                // Fecha o popup apóx 'x' segundo
                $timeout(function() { alertPopup.close(); }, fecharApos);
            };

            this.confirm = function(titulo, template, calbackSim, calbackNao) {
                var confirmPopup = $ionicPopup.confirm({
                    title: titulo,
                    template: template
                });

                confirmPopup.then(function(res) {
                    if (res) calbackSim();
                    else calbackNao();
                });
            };
        };

        return new _service();

    });

})(angular);

// angular.module('mySuperApp', ['ionic'])
// .controller('PopupCtrl',function($scope, $ionicPopup, $timeout) {

//  // Triggered on a button click, or some other target
//  $scope.showPopup = function() {
//    $scope.data = {}

//    // An elaborate, custom popup
//    var myPopup = $ionicPopup.show({
//      template: '<input type="password" ng-model="data.wifi">',
//      title: 'Enter Wi-Fi Password',
//      subTitle: 'Please use normal things',
//      scope: $scope,
//      buttons: [
//        { text: 'Cancel' },
//        {
//          text: '<b>Save</b>',
//          type: 'button-positive',
//          onTap: function(e) {
//            if (!$scope.data.wifi) {
//              //don't allow the user to close unless he enters wifi password
//              e.preventDefault();
//            } else {
//              return $scope.data.wifi;
//            }
//          }
//        },
//      ]
//    });
//    myPopup.then(function(res) {
//      console.log('Tapped!', res);
//    });
//    $timeout(function() {
//       myPopup.close(); //close the popup after 3 seconds for some reason
//    }, 3000);
//   };
//    // A confirm dialog
//    $scope.showConfirm = function() {
//      var confirmPopup = $ionicPopup.confirm({
//        title: 'Consume Ice Cream',
//        template: 'Are you sure you want to eat this ice cream?'
//      });
//      confirmPopup.then(function(res) {
//        if(res) {
//          console.log('You are sure');
//        } else {
//          console.log('You are not sure');
//        }
//      });
//    };

//    // An alert dialog
//    $scope.showAlert = function() {
//      var alertPopup = $ionicPopup.alert({
//        title: 'Don\'t eat that!',
//        template: 'It might taste good'
//      });
//      alertPopup.then(function(res) {
//        console.log('Thank you for not eating my delicious ice cream cone');
//      });
//    };
// });
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
(function (angular) {

    var services = angular.module('wopo.services');
    services.factory('RestServiceBase', function($http, Wopo, WebStorageService) {

        // console.log(Restangular.defaultHeaders);

        var _service = function() {

            self = this;
            this.mainRoute = undefined;
            this.urlBase = 'https://api.parse.com/1/classes/';

            this.getToken = function() {
                var token = WebStorageService.getLocalStorage('_$token') || WebStorageService.getSessionStorage('_$token');

                if (!token) throw "Usuário não autenticado, efetue login";
                else return token;
            };

            this.headers = {
                'X-Parse-Application-Id': Wopo.APP_ID,
                'X-Parse-REST-API-Key': Wopo.REST_API_KEY,
                'X-Parse-Session-Token': this.getToken(),
            };

            this.setMainRoute = function(mainRoute) {
                self.mainRoute = mainRoute;
            };

            this.getAll = function() {
                if (!self.mainRoute) throw "mainRoute não configurada.";

                // return Restangular.all(this.mainRoute).getList();

                return $http.get(self.urlBase + self.mainRoute, { headers: self.headers });
            };

            this.getById = function(id) {
                if (!id) throw "id não informado";
                if (!this.mainRoute) throw "mainRoute não configurada.";

                // return Restangular.one(this.mainRoute, id).get();

                return $http.get(self.urlBase + self.mainRoute + '/' + id, { headers: self.headers });
            };

            this.incluir = function(model) {
                if (!self.mainRoute) throw "mainRoute não configurada.";

                // return Restangular.all(self.mainRoute).post(model);

                return $http.post(self.urlBase + self.mainRoute, model, {
                    headers: self.headers
                    // headers:{
                    //     'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                    //     'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
                    //     'Content-Type':'application/json'
                    // }
                });
            };

            this.editar = function(model) {

                // if (!model.put) throw "Objeto a ser alterado inválido";
                if (!this.mainRoute) throw "mainRoute não configurada.";

                // return model.put();

                return $http.put(self.urlBase + self.mainRoute + '/' + model.objectId, 
                    model, { headers: self.headers });
            };

            this.excluir = function(id) {
                if (!this.mainRoute) throw "mainRoute não configurada.";

                // return Restangular.one(this.mainRoute, id).remove();

                return $http.delete(self.urlBase + self.mainRoute + '/' + id, { headers: self.headers });
            };
       	};

        return _service;

    });

})(angular);
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