(function (angular) {
    'use strict';

    angular
        .module('wopo.services')
        .factory('LoginService', LoginService);

    LoginService.$inject = ['$rootElement', '$http', '$wopo', 'WebStorageService', 'CryptSha1Service'];

    function LoginService($rootElement, $http, $wopo, WebStorageService, CryptSha1Service) {
        var self = this;
        var appName = $rootElement.attr('ng-app');

        this.headers = {
            'X-Parse-Application-Id': $wopo.APP_ID,
            'X-Parse-REST-API-Key': $wopo.REST_API_KEY
        };

        var _service = {
            getToken: _getToken,
            setToken: _setToken,
            getUsuario: getUsuario,
            incluir: incluir,
            login: login,
            logout: logout,
            recuperarSenha: recuperarSenha,
            usuarioAutenticado: usuarioAutenticado
        };

        return _service;

        // ToDo: Repetição de código pensar em solução melhor
        function _getToken() {
            if (!usuarioAutenticado()) {
                console.error("Usuário não autenticado, por favor efetue login.");
                return;
            }
            return WebStorageService.getLocalStorage(appName + '_$token') || WebStorageService.getSessionStorage( + '_$token');
        }

        function _setToken(token, temporario) {
            if (temporario) WebStorageService.setLocalStorage(appName + '_$token', token);
            else WebStorageService.setSessionStorage(appName + '_$token', token);
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

                    _setToken(data.sessionToken, model.salvarSenha)
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
                    _setToken(data.sessionToken, model.salvarSenha)
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
            var token = _getToken();
            if (!token || token === null) return false;
            else return true;
        }
    }

})(angular);
