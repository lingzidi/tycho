import angular from 'angular';
import uirouter from 'angular-ui-router';

export default class Directives {

  constructor() {
    this.module = angular.module('app.scene');
  }

  /**
   * Returns all files from a given directive.
   * @param  {String} directiveName
   * @return {Object} with properties: controller, directive, and template
   */
  getFiles = (directiveName) => {
    return {
      controller: require(`./${directiveName}/${directiveName}.controller`),
      directive:  require(`./${directiveName}/${directiveName}.directive`),
      template:   require(
        `ngtemplate!html!./${directiveName}/${directiveName}.html`
      )
    };
  }

  /**
   * Registers the directive with all of its components.
   * @param  {String} directiveName
   * @param  {String} moduleName
   */
  registerDirective = (directiveName, moduleName) => {
    let config = require(`./${directiveName}/index`);
    let files  = this.getFiles(directiveName);

    let directive = new files.directive[config.directive];
        directive.controller   = files.controller[config.controller];
        directive.templateUrl  = files.template;
        directive.controllerAs = config.controllerAs;
        directive.restrict     = config.restrict;

    this.module.directive(config.controllerAs, () => directive);
  }
}