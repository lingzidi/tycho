import { TimepickerDirective }
  from '../../../../client/directives/timepicker/timepicker.directive';
import { TimepickerController }
  from '../../../../client/directives/timepicker/timepicker.controller';
import '../../../../client';

describe('TimepickerDirective', () => {
  
  let $scope, $compile, element, ctrl;

  beforeEach(() => {
    angular.mock.module('app');

    inject(function($rootScope, _$compile_) {
      $scope = $rootScope.$new();
      $compile = _$compile_;
      ctrl = new TimepickerController($rootScope, $scope);
    });

    element = $compile('<timepicker></timepicker>')($scope);
    element.data('$timepickerController', ctrl);

    $scope.$digest();
  });

  it('should be ok', () => {
    element.should.be.ok;
  });

});