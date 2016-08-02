import Scene from '../../engine/objects/scene';

export class BodyInfoController {
  constructor($rootScope, scope) {//BodyInfoService
  	// this.BodyInfoService = BodyInfoService;
    this.scope = scope;
  }
}

BodyInfoController.$inject = ['$rootScope', '$scope'];