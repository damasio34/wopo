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