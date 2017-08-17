import THREE from 'three';
import Clock from 'engine/clock';
import Orbital from 'scene/objects/orbital';
import Scene from 'scene/objects/scene';
import Controls from 'scene/stage/controls';
import Fixtures from './__fixtures__';

describe('Scene', () => {

  let scene;

  beforeEach(() => {
    scene = new Scene(new Clock());
  });

  describe('constructor', () => {

    it('should initialize the internal engine clock', () => {
      scene.clock.should.be.instanceOf(Clock);
    });

  });

  describe('setUp', () => {

    it('should call all available setup functions', () => {
      let renderScene = sinon.spy(scene, 'renderScene'),
          setSettings = sinon.spy(scene, 'setSettings');

      scene.setUp();

      renderScene.should.have.been.calledOnce;
      setSettings.should.have.been.calledOnce;
    });

    it('should start the animation loop', () => {
      let animate = sinon.spy(scene, 'animate');
      scene.setUp();
      animate.should.have.been.called;
    });
  });

  describe('getRenderer', () => {

    it('should return a new THREE.WebGLRenderer', () => {
      let renderer = scene.getRenderer();

      renderer.should.be.instanceOf(THREE.WebGLRenderer);
    });

  });

  describe('getCamera', () => {

    let camera,
        aspect = window.innerWidth / window.innerHeight;

    beforeEach(() => {
      camera = scene.getCamera();
    });

    it('should return an instance of THREE.PerspectiveCamera', () => {
      camera.should.be.instanceOf(THREE.PerspectiveCamera);
    });

    it('should set the camera\'s aspect ratio to that of the window', () => {
      camera.aspect.should.be.a.number;
      camera.aspect.should.equal(aspect);
    });

    it('should start with a fov of 50', () => {
      camera.fov.should.be.a.number;
      camera.fov.should.equal(50);
    });

    it('should always have a frustum in [1, 10000]', (done) => {
      // the animation loop should only change the fov of the camera frustum
      // ensure that the frustum far and near planes are never changed
      let n = 0, intervalId;

      let specNearFar = () => {
        camera.near.should.be.a.number;
        camera.near.should.equal(1);
        camera.far.should.be.a.number;
        camera.far.should.equal(10000);
        camera.far.should.be.above(camera.near);

        if (++n === 3) {
          window.clearInterval(intervalId);
          done();
        }
      };

      intervalId = setInterval(specNearFar, 200);
      specNearFar();
    });

  });

  describe('getControls', () => {

    it('should return a new instance of Controls', () => {
      let controls = scene.getControls();
      scene.camera = scene.getCamera();
      controls.should.be.instanceOf(Controls);
    });

  });

  describe('renderScene', () => {

    it('should call the getter methods for the scene user controls', () => {

      let userControls = [
        'getRenderer',
        'getCamera',
        'getControls'
      ];

      userControls.forEach(userControl => {
        sinon.spy(scene, userControl);
        scene.renderScene();
        scene[userControl].should.have.been.called;
      });

    });

    it('should add the camera to the THREE scene', () => {
      let add = sinon.spy(scene, 'add');
      scene.renderScene();
      add.should.have.been.calledWith(scene.camera);
    });

    it('should set width and height of window as the renderer dimensions', () => {
      let width  = window.innerWidth,
          height = window.innerHeight,
      
      sinon.spy(scene.renderer, 'setSize');

      scene.renderScene();
      scene.renderer.setSize.should.have.been.calledWith(width, height);
    });

  });

});