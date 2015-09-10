(function (angular) {

    var services = angular.module('wopo.services');
    services.factory('RestServiceBase', function($http, WopoProvider, WebStorageService) {

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
                'X-Parse-Application-Id': WopoProvider.APP_ID,
                'X-Parse-REST-API-Key': WopoProvider.REST_API_KEY,
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