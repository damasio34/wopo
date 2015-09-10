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