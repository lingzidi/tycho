

export class TimepickerController {
  constructor($rootScope, scope) {
    this.time = 'testing';
    this.root = $rootScope;
  }

  testTime = () => {
    console.log(this.root.elapsedTime);
  }
}

TimepickerController.$inject = ['$rootScope', '$scope'];