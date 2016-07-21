import angular from 'angular';
import uirouter from 'angular-ui-router';

export default class ModulesService {
  constructor() {
  }

  /**
   * registers the ui-router $stateProvider for a module
   * 
   * @param  {Object}         config     the config object for the module
   * @param  {String}         modulePath path to the module files
   * @return {$stateProvider}
   */
  registerRoute(config, moduleName) {
    config.templateUrl = require(`ngtemplate!html!./${moduleName}/${moduleName}.html`);

    return ['$stateProvider', ($stateProvider) => $stateProvider.state(config.url, config)];
  }

  /**
   * for a given module name, requires its corresponding LESS file
   * @param  {String} moduleName
   */
  registerLess(moduleName) {
    require(`./${moduleName}/${moduleName}.less`);
  }

  /**
   * registers the controller, service (if exists), and config for each module
   * 
   * @param  {String} moduleName
   * @return {String} name of registered module
   */
  registerModule(moduleName) {
    const modulePath = `./${moduleName}`;
    const controller = require(`${modulePath}/${moduleName}.controller`);
    const config = require(`${modulePath}/index`);
    const module = angular.module(`app.${moduleName}`, [uirouter]);

    if(config.service) {
      // initialize service, if one exists
      const service = require(`${modulePath}/${moduleName}.service`);

      module.factory(config.service, () => new service[config.service]());
    }

    return module
      .controller(config.controller, controller[config.controller])
      .config(this.registerRoute(config, moduleName))
      .name;
  }
}