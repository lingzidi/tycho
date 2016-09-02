import config from './config';
import Scene from './engine/objects/scene';

angular
  .module('app', ['app.scene'])
  .config(config)
  .run(($rootScope) => {
    $rootScope.scene = new Scene();
  });