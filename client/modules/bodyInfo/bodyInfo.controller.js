import Scene from '../../engine/objects/scene';

export class BodyInfoController {
  constructor($rootScope, scope) {//BodyInfoService
  	// this.BodyInfoService = BodyInfoService;
    this.scope = scope;

    this.currentTime = 500;

    $rootScope.scene.tick(this.tick.bind(this));
  }

  tick = (time) => {
    this.currentTime = time;
    this.scope.$apply();
  }
}

BodyInfoController.$inject = ['$rootScope', '$scope'];