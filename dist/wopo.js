/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(e,m){var p={},j=p.lib={},l=function(){},f=j.Base={extend:function(a){l.prototype=this;var c=new l;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
n=j.WordArray=f.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=m?c:4*a.length},toString:function(a){return(a||h).stringify(this)},concat:function(a){var c=this.words,q=a.words,d=this.sigBytes;a=a.sigBytes;this.clamp();if(d%4)for(var b=0;b<a;b++)c[d+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((d+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[d+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=e.ceil(c/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*e.random()|0);return new n.init(c,a)}}),b=p.enc={},h=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++){var f=c[d>>>2]>>>24-8*(d%4)&255;b.push((f>>>4).toString(16));b.push((f&15).toString(16))}return b.join("")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d+=2)b[d>>>3]|=parseInt(a.substr(d,
2),16)<<24-4*(d%8);return new n.init(b,c/2)}},g=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++)b.push(String.fromCharCode(c[d>>>2]>>>24-8*(d%4)&255));return b.join("")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d++)b[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return new n.init(b,c)}},r=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(g.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return g.parse(unescape(encodeURIComponent(a)))}},
k=j.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new n.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=r.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,d=c.sigBytes,f=this.blockSize,h=d/(4*f),h=a?e.ceil(h):e.max((h|0)-this._minBufferSize,0);a=h*f;d=e.min(4*a,d);if(a){for(var g=0;g<a;g+=f)this._doProcessBlock(b,g);g=b.splice(0,a);c.sigBytes-=d}return new n.init(g,d)},clone:function(){var a=f.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});j.Hasher=k.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){k.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,b){return(new a.init(b)).finalize(c)}},_createHmacHelper:function(a){return function(b,f){return(new s.HMAC.init(a,
f)).finalize(b)}}});var s=p.algo={};return p}(Math);
(function(){var e=CryptoJS,m=e.lib,p=m.WordArray,j=m.Hasher,l=[],m=e.algo.SHA1=j.extend({_doReset:function(){this._hash=new p.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(f,n){for(var b=this._hash.words,h=b[0],g=b[1],e=b[2],k=b[3],j=b[4],a=0;80>a;a++){if(16>a)l[a]=f[n+a]|0;else{var c=l[a-3]^l[a-8]^l[a-14]^l[a-16];l[a]=c<<1|c>>>31}c=(h<<5|h>>>27)+j+l[a];c=20>a?c+((g&e|~g&k)+1518500249):40>a?c+((g^e^k)+1859775393):60>a?c+((g&e|g&k|e&k)-1894007588):c+((g^e^
k)-899497514);j=k;k=e;e=g<<30|g>>>2;g=h;h=c}b[0]=b[0]+h|0;b[1]=b[1]+g|0;b[2]=b[2]+e|0;b[3]=b[3]+k|0;b[4]=b[4]+j|0},_doFinalize:function(){var f=this._data,e=f.words,b=8*this._nDataBytes,h=8*f.sigBytes;e[h>>>5]|=128<<24-h%32;e[(h+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(h+64>>>9<<4)+15]=b;f.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=j.clone.call(this);e._hash=this._hash.clone();return e}});e.SHA1=j._createHelper(m);e.HmacSHA1=j._createHmacHelper(m)})();
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
(function (angular) {

    var services = angular.module('wopo.services');
    services.factory('LoginService', ['$http', '$wopo', 'WebStorageService', 'CryptSha1Service', function($http, $wopo, WebStorageService, CryptSha1Service) {
        
		var _service = function() {
            
            var self = this;

            this.headers = {
                'X-Parse-Application-Id': $wopo.APP_ID,
                'X-Parse-REST-API-Key': $wopo.REST_API_KEY
            };  

            // ToDo: Repetição de código pensar em solução melhor 
            this.getToken = function() {
                if (!self.usuarioAutenticado()) {
                    console.error("Usuário não autenticado, por favor efetue login.");
                    return;
                }           
                return WebStorageService.getLocalStorage('_$token') || WebStorageService.getSessionStorage('_$token');
            };

            this.incluir = function(model) {
                var _headers = angular.copy(self.headers, _headers);
                _headers['Content-Type'] = 'application/json';
                
                var user = {
                    username: model.usuario,
                    password: CryptSha1Service.hash(model.senha),
                    email: model.email
                };
                                
               	return $http.post('https://api.parse.com/1/users', user, { headers: _headers })
                   .success(function(data, status) {
					if (status == 201 && !!data.sessionToken) {
						   //      Role: {
									// "__op": "AddRelation",
							  //         "objects": [
							  //           {
							  //             "__type": "Pointer",
							  //             "className": "Role",
							  //             "objectId": "jqK7bj0mex"
							  //           },
						   //      	]
						   //      }
						
						if (model.salvarSenha) WebStorageService.setLocalStorage('_$token', data.sessionToken);
						else WebStorageService.setSessionStorage('_$token', data.sessionToken);
					}
                }).error(function (data, status) {
                    if (status === 400 && data.code === 202) {
                        console.warn('O nome de usuário ' + model.usuario + ' já está cadastrado.');   
                    }
					console.log(data);
				});
            };

			this.login = function (model) {
                // var whereQuery = {type: subtype};

				if (self.usuarioAutenticado()) self.logout();
                var _headers = angular.copy(self.headers, _headers);
                _headers['Content-Type'] = 'application/x-www-form-urlencoded';

                return $http.get('https://api.parse.com/1/login', {
                    headers:_headers,
                    params: {
                     	username: model.usuario, password: CryptSha1Service.hash(model.senha),
                      	// where: {username: _usuario, password: _senha},
                     	// limit: 2,
                     	// count: 1
                     	// include: "something"
                    }

                }).success(function(data, status) {
					if (status == 200 && !!data.sessionToken) {
						if (model.salvarSenha) WebStorageService.setLocalStorage('_$token', data.sessionToken);
						else WebStorageService.setSessionStorage('_$token', data.sessionToken);
					}
                }).error(function (data, status) {
                    if (status == 404) {
                        console.error('Usuário ou senha inválido.');
                    }
                	// console.log(status);
					// console.log(data);
				});
			};

			this.logout = function() {
				var _headers = angular.copy(self.headers, _headers);                
				var token = self.getToken();
                _headers['X-Parse-Session-Token'] = token;
                
				if (!!token) {
					return $http.post('https://api.parse.com/1/logout', '', {
	                    headers: _headers
	                }).success(function(data, status, headers) {
						if (status == 200) {
							sessionStorage.removeItem('_$token');
							sessionStorage.clear();
							localStorage.removeItem('_$token');
							localStorage.clear();
						}
	                }).error(function (data, status) {
	                	console.log(status);
	                	console.log(data.error);
					});
				}
			};

			this.recuperarSenha = function(model) {
                var _headers = angular.copy(self.headers, _headers);
                _headers['Content-Type'] = 'application/json';
                                
               	return $http.post('https://api.parse.com/1/requestPasswordReset', model, { headers: _headers })
                   .success(function(data, status) {
						console.log('Senha enviada com sucesso.');
                }).error(function (data, status) {
                    if (status === 400 && data.code === 202) {
                        console.warn('O nome de usuário ' + model.usuario + ' já está cadastrado.');   
                    }
					console.log(data);
				});
            };

			this.getUsuario = function() {
                var token = self.getToken();
                var _headers = angular.copy(self.headers, _headers);				
                _headers['X-Parse-Session-Token'] = token;
                
				return $http.get('https://api.parse.com/1/users/me', {
                    headers: _headers
                }).success(function(data, status) {
					if (status == 200) {
						console.log(data);
					}
                }).error(function (data, status) {
                	console.log(data.error);
				});			
			};

			this.usuarioAutenticado = function() {
				var token = WebStorageService.getLocalStorage('_$token') || WebStorageService.getSessionStorage('_$token');
				if (!token || token === null) return false;
				else return true;
			};
		};

		return new _service();

	}]);
        
})(angular);
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
    services.factory('RestServiceBase', ['$http', '$wopo', 'WebStorageService', 'LoginService', function($http, $wopo, WebStorageService, LoginService) {

        var _service = function() {

            self = this;
            this.mainRoute = undefined;
            this.urlBase = 'https://api.parse.com/1/classes/';
            
            this.headers = {
                'X-Parse-Application-Id': $wopo.APP_ID,
                'X-Parse-REST-API-Key': $wopo.REST_API_KEY
            };           

            this.setMainRoute = function(mainRoute) {
                self.mainRoute = mainRoute;
            };

            this.getAll = function() {
                if (!self.mainRoute) throw "mainRoute não configurada.";
                if ($wopo.UsuarioPrecisaEstarAutenticado) self.headers['X-Parse-Session-Token'] = LoginService.getToken();

                return $http.get(self.urlBase + self.mainRoute, { headers: self.headers });
            };

            this.getById = function(id) {
                if (!id) throw "id não informado";
                if (!this.mainRoute) throw "mainRoute não configurada.";
                if ($wopo.UsuarioPrecisaEstarAutenticado) self.headers['X-Parse-Session-Token'] = LoginService.getToken();

                return $http.get(self.urlBase + self.mainRoute + '/' + id, { headers: self.headers });
            };

            this.incluir = function(model) {
                if (!self.mainRoute) throw "mainRoute não configurada.";
                if ($wopo.UsuarioPrecisaEstarAutenticado) self.headers['X-Parse-Session-Token'] = LoginService.getToken();

                return $http.post(self.urlBase + self.mainRoute, model, { headers: self.headers });
            };

            this.editar = function(model) {
                if (!this.mainRoute) throw "mainRoute não configurada.";
                if ($wopo.UsuarioPrecisaEstarAutenticado) self.headers['X-Parse-Session-Token'] = LoginService.getToken();

                return $http.put(self.urlBase + self.mainRoute + '/' + model.objectId, 
                    model, { headers: self.headers });
            };

            this.excluir = function(id) {
                if (!this.mainRoute) throw "mainRoute não configurada.";
                if ($wopo.UsuarioPrecisaEstarAutenticado) self.headers['X-Parse-Session-Token'] = LoginService.getToken();

                return $http.delete(self.urlBase + self.mainRoute + '/' + id, { headers: self.headers });
            };
        };

        return _service;

    }]);

})(angular);