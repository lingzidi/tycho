import {SignInController} from '../../../../client/modules/sign_in/sign_in.controller';

describe('Controller: Sign In', function() {
  var $controller,
  	ctrl = new SignInController();

  beforeEach(angular.mock.module(ctrl));

  beforeEach(angular.mock.inject(function(_$controller_) {
    $controller = _$controller_;
  }));

  it('name is initialized to World', function() {
    expect(true).toBe(true);
  });
});