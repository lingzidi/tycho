export class TimepickerController {
  constructor($rootScope, scope) {
    this.scope = scope;
    $rootScope.scene.tick(this.tick);
  }

  tick = (time) => {
    this.time = time;
    this.scope.$apply();
  }
}

TimepickerController.$inject = ['$rootScope', '$scope'];