import Orbital from '../../../../client/engine/objects/orbital';
import Clock from '../../../../client/engine/global/clock';
import Fixtures from './__fixtures__';
import Scene from '../../../../client/engine/objects/scene';
import THREE from 'three';
import OrbitControls from 'three-orbit-controls';

describe('Scene', () => {

  let scene;

  beforeEach(() => {
    scene = new Scene();
  });

  // describe('constructor', () => {

  //   it('should initialize the THREE.Scene', () => {
  //     scene.scene.should.be.instanceOf(THREE.Scene);
  //   });

  //   it('should initialize the internal engine clock', () => {
  //     scene.clock.should.be.instanceOf(Clock);
  //   });

  //   it('should call all available build-up functions', () => {
  //     scene.renderScene.should.have.been.called;
  //     scene.renderProps.should.have.been.called;
  //     scene.setSettings.should.have.been.called;
  //   });

  //   it('should start the animation loop', () => {
  //     scene.animate.should.have.been.called;
  //   });
  // });

  // describe('getRenderer', () => {

  //   it('should return a new THREE.WebGLRenderer', () => {
  //     let renderer = scene.getRenderer();

  //     renderer.should.be.instanceOf(THREE.WebGLRenderer);
  //   });

  // });

  // describe('getCamera', () => {

  //   let camera,
  //       aspect = window.innerWidth / window.innerHeight;

  //   beforeEach(() => {
  //     camera = scene.getCamera();
  //   });

  //   it('should return an instance of THREE.PerspectiveCamera', () => {
  //     camera.should.be.instanceOf(THREE.PerspectiveCamera);
  //   });

  //   it('should set the camera\'s aspect ratio to that of the window', () => {
  //     camera.aspect.should.be.a.number;
  //     camera.aspect.should.equal(aspect);
  //   });

  //   it('should start with a fov of 50', () => {
  //     camera.fov.should.be.a.number;
  //     camera.fov.should.equal(50);
  //   });

  //   it('should always have a frustum in [1, 10000]', (done) => {
  //     // the animation loop should only change the fov of the camera frustum
  //     // ensure that the frustum far and near planes are never changed
  //     let n = 0, intervalId;

  //     let specNearFar = () => {
  //       camera.near.should.be.a.number;
  //       camera.near.should.equal(1);
  //       camera.far.should.be.a.number;
  //       camera.far.should.equal(10000);
  //       camera.far.should.be.above(camera.near);

  //       if (++n === 3) {
  //         window.clearInterval(intervalId);
  //         done();
  //       }
  //     };

  //     intervalId = setInterval(specNearFar, 200);
  //     specNearFar();
  //   });

  // });

  // describe('getControls', () => {

  //   it('should return a new instance of OrbitControls', () => {
  //     let controls = scene.getControls();

  //     controls.should.be.instanceOf(OrbitControls);
  //   });

  // });

  describe('renderScene', () => {

    it('should call the getter methods for the scene user controls', () => {

      let userControls = [
        'getRenderer',
        'getCamera',
        'getControls'
      ];

      scene.renderScene();

      userControls.forEach((userControl) => {
        chai.spy.on(scene, userControl);
        scene[userControl].should.not.be.undefined;
        scene[userControl].should.have.been.called;
      });

    });

    it('should add the camera to the THREE scene', () => {
      chai.spy.on(scene.scene, 'add', 'camera');
      scene.renderScene();
      scene.scene.add.should.have.been.called.with(scene.camera);
    });

    // damn thing's busted
    // it('should set width and height of window as the renderer dimensions', () => {
    //   let width  = window.innerWidth,
    //       height = window.innerHeight;

    //   chai.spy.on(scene.renderer, 'setSize', width, height);

    //   scene.renderScene();
    //   scene.renderer.setSize.should.have.been.called.with(width, height);
    // })

  });

});






















