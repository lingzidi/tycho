import modules from './modules';
import directives from './directives';

export default ['$stateProvider', '$urlRouterProvider', '$locationProvider', 
  function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    modules.forEach((module) => {
      let config = require(`./modules/${module}/index`);
      $stateProvider.state(config.name, config);
    });
  }];