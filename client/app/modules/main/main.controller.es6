
export class MainController {
  constructor(root, scope) {
    let main  = this;
    let scene = root.scene;

    main.controls = scene.controls;
    main.settings = {
      zoom: 100,
      size: 0,
      speed: 0
    };

    Object
      .keys(main.settings)
      .forEach((setting) => {
        scope.$watch(`main.settings.${setting}`, scene[setting]);
      });
  }
}

MainController.$inject = ['$rootScope', '$scope'];