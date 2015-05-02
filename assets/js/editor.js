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
    var key = prompt("Please enter the configuration name");
    if(!key) return;

    var config = new Config({"key": key});
    Config.save(config);
    $scope.configs.push(config);
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
