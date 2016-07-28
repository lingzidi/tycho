import Scene from '../../engine/objects/scene';

export class SignInController {
  constructor(SignInService) {
    this.scene = new Scene();
  	this.SignInService = SignInService;
  }
}

SignInController.$inject = ['SignInService'];