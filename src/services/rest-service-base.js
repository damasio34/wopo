(function (angular) {
    'use strict';

    angular
        .module('wopo.services')
        .service('RestServiceBase', RestServiceBase);

    RestServiceBase.$inject = ['$http', '$wopo', 'WebStorageService', 'LoginService'];

    function RestServiceBase($http, $wopo, WebStorageService, LoginService) {
        var self = this;
        this.mainRoute = undefined;
        this.urlBase = 'https://api.parse.com/1/classes/';

        this.headers = {
            'X-Parse-Application-Id': $wopo.APP_ID,
            'X-Parse-REST-API-Key': $wopo.REST_API_KEY
        };

        var _service = {
            editar: editar,
            excluir: excluir,
            getAll: getAll,
            getById: getById,
            incluir: incluir,
            setMainRoute: setMainRoute
        };

        return _service;

        // Implementação
        function setMainRoute(mainRoute) {
            self.mainRoute = mainRoute;
        }

        function getAll() {
            if (!self.mainRoute) throw "mainRoute não configurada.";
            if ($wopo.UsuarioPrecisaEstarAutenticado) self.headers['X-Parse-Session-Token'] = LoginService.getToken();

            return $http.get(self.urlBase + self.mainRoute, { headers: self.headers });
        }

        function getById(id) {
            if (!id) throw "id não informado";
            if (!self.mainRoute) throw "mainRoute não configurada.";
            if ($wopo.UsuarioPrecisaEstarAutenticado) self.headers['X-Parse-Session-Token'] = LoginService.getToken();

            return $http.get(self.urlBase + self.mainRoute + '/' + id, { headers: self.headers });
        }

        function incluir(model) {
            if (!self.mainRoute) throw "mainRoute não configurada.";
            if ($wopo.UsuarioPrecisaEstarAutenticado) self.headers['X-Parse-Session-Token'] = LoginService.getToken();

            return $http.post(self.urlBase + self.mainRoute, model, { headers: self.headers });
        }

        function editar(model) {
            if (!self.mainRoute) throw "mainRoute não configurada.";
            if ($wopo.UsuarioPrecisaEstarAutenticado) self.headers['X-Parse-Session-Token'] = LoginService.getToken();

            return $http.put(self.urlBase + self.mainRoute + '/' + model.objectId,
                model, { headers: self.headers });
        }

        function excluir(id) {
            if (!self.mainRoute) throw "mainRoute não configurada.";
            if ($wopo.UsuarioPrecisaEstarAutenticado) self.headers['X-Parse-Session-Token'] = LoginService.getToken();

            return $http.delete(self.urlBase + self.mainRoute + '/' + id, { headers: self.headers });
        }

    }

})(angular);
