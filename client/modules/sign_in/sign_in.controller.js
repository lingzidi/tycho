import Scene from '../scene/scene';

export class SignInController {
  constructor(SignInService) {
  	this.SignInService = SignInService;
    this.scene = new Scene();
  }
}

SignInController.$inject = ['SignInService'];