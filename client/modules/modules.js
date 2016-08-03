import angular from 'angular';
import uirouter from 'angular-ui-router';

export default class Modules {

  constructor() {
    this.module = angular.module('app.scene', [uirouter]);
  }

  /**
   * Registers a service.
   * @param  {String} serviceName
   * @param  {Module} module instance of Angular.module
   */
  registerService = (path, serviceName, module) => {
    const service = require(path);
    module.factory(config.service, () => new service[config.service]());
  }

  /**
   * Returns the webpack-ready template for the module.
   * @param  {String} moduleName
   * @return {ngTemplate}
   */
  getTemplate = (moduleName) => {
    return require(
      `ngtemplate!html!./${moduleName}/${moduleName}.html`
    );
  }

  /**
   * Registers the controller, service (if exists), and config for each module.
   * @param  {String} moduleName
   * @return {String} name of registered module
   */
  registerModule = (moduleName) => {
    const modulePath = `./${moduleName}`;
    const controller = require(`${modulePath}/${moduleName}.controller`);
    const config     = require(`${modulePath}/index`);

    config.templateUrl = this.getTemplate(moduleName);

    if(config.service) {
      this.registerService(`${modulePath}/${moduleName}.service`);
    }

    return this
      .module
      .controller(config.controller, controller[config.controller])
      .name;
  }
}