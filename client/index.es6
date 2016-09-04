import config from './config';
import System from './engine/stage/system';

angular
  .module('app', ['app.scene'])
  .config(config)
  .run(($rootScope) => {
    $rootScope.scene = new System();
  });