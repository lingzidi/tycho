import routing from './config';
import modules from './modules';
import directives from './directives';
import Scene from './engine/objects/scene';

angular
  .module('app', modules)
  .config(routing)
  .run(($rootScope) => {
    $rootScope.scene = new Scene();
  });