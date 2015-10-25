(function (angular) {
    'use strict';

    angular
        .module('wopo.services')
        .factory('LoginService', LoginService);
        
    LoginService.$inject = ['$http', '$wopo', 'WebStorageService', 'CryptSha1Service'];

    function LoginService($http, $wopo, WebStorageService, CryptSha1Service) {
        var self = this;
        this.headers = {
            'X-Parse-Application-Id': $wopo.APP_ID,
            'X-Parse-REST-API-Key': $wopo.REST_API_KEY
        };  
        
        var _service = {
            getToken: getToken,
            getUsuario: getUsuario,
            incluir: incluir,
            login: login,
            logout: logout,
            recuperarSenha: recuperarSenha,            
            usuarioAutenticado: usuarioAutenticado
        };
        
        return _service;

        // ToDo: Repetição de código pensar em solução melhor 
        function getToken() {
            if (!usuarioAutenticado()) {
                console.error("Usuário não autenticado, por favor efetue login.");
                return;
            }           
            return WebStorageService.getLocalStorage('_$token') || WebStorageService.getSessionStorage('_$token');
        }
        
        function getUsuario() {
            var token = getToken();
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
        }

        function incluir(model) {
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
        }

        function login(model) {
            // var whereQuery = {type: subtype};

            if (usuarioAutenticado()) logout();
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
        }

        function logout() {
            var _headers = angular.copy(self.headers, _headers);                
            var token = getToken();
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
        }

        function recuperarSenha(model) {
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
        }
        
        function usuarioAutenticado() {
            var token = WebStorageService.getLocalStorage('_$token') || WebStorageService.getSessionStorage('_$token');
            if (!token || token === null) return false;
            else return true;
        }       
    }
        
})(angular);