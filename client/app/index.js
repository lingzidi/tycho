import config from './config';
import System from '../components/Scene/System';

angular
  .module('app', ['app.scene'])
  .config(config)
  .run(($rootScope) => {
    $rootScope.scene = new System();
  });
