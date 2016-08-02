export class TimepickerDirective {
  constructor() {
    this.scope = {};
  }

  link = (scope, element, attrs) => {
    console.log('state', scope.state)
    console.log('service', scope.service)
  }
}

