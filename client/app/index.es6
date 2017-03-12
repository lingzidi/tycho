import config from './config';
import System from '../scene/stage/system';

angular
  .module('app', ['app.scene'])
  .config(config)
  .run(($rootScope) => {
    $rootScope.scene = new System();
  });