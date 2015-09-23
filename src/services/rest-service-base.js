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