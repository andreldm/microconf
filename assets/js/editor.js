angular.module('microconf', ['ngResource'])
.factory('Config', function($resource) {
  return $resource('/api/:key',
    { key: "@key" },
      { "save": {method:"PUT"} }
  );
})
.controller('MainCtrl', function($scope, Config) {
  $scope.configs = new Config.query();

  this.new = function() {
    swal({
      title: "",
      text: "Please enter the configuration name:",
      type: "input",
      showCancelButton: true,
      closeOnConfirm: false,
      confirmButtonColor: "#337AB7",
      animation: "slide-from-top",
      inputPlaceholder: "Write something"
      },
      function(key) {
        if (!key) {
          swal.showInputError("You need to write something!");
          return false;
        }

        var config = new Config({"key": key});
        Config.save(config);
        $scope.configs.push(config);
        swal.close();
      }
    );
  };

  $scope.save = function(config) {
    config.$save();
  };

  $scope.delete = function(config) {
    config.$delete({"key": config.key});
    var index = $scope.configs .indexOf(config);
    if (index > -1) {
      $scope.configs.splice(index, 1);
    }
  };
});
