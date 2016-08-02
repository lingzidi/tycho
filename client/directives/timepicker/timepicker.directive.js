import TimepickerController from './timepicker.controller';

export class TimepickerDirective {
  constructor() {
    this.scope = {};
    this.restrict = 'E';
    // this.templateUrl = 'timepicker.html';
  }

  link = (scope, element, attrs) => {
    console.log('state', scope.state)
    console.log('service', scope.service)
  }
}

