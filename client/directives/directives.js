import angular from 'angular';
import uirouter from 'angular-ui-router';

export default class Directives {

  /**
   * Returns all files from a given directive
   * @param  {String} directiveName
   * @return {Object} with properties: controller, directive, and template
   */
  static getFiles(directiveName) {
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
  static registerDirective(directiveName, moduleName) {
    let module = angular.module(`app.${moduleName}`);
    let files = this.getFiles(directiveName);

    let config = require(`./${directiveName}/index`);

    let directive = new files.directive[config.directive];
        directive.controller  = files.controller[config.controller];
        directive.templateUrl = files.template;

    module.directive(config.controllerAs, () => directive);
  }
}