import THREE from 'three';
import Clock from 'engine/clock';
import Orbital from './Objects/Orbital';
import Scene from './Scene';
import Controls from './Utils/Controls';
import Fixtures from './fixtures';

describe('Scene', () => {
  let scene, sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(THREE, 'WebGLRenderer').returns({
      render: () => {},
      setSize: () => {},
      domElement: document.createElement('canvas')
    });

    scene = new Scene(new Clock());
  });

  afterEach(() => sandbox.restore());

  describe('constructor', () => {
    it('should initialize the internal engine clock', () => {
      scene.clock.should.be.instanceOf(Clock);
    });
  });

  describe('setUp', () => {
    it('should call all available setup functions', () => {
      sandbox.spy(scene, 'renderScene');
      sandbox.spy(scene, 'setSettings');

      scene.setUp();

      scene.renderScene.should.have.been.calledOnce;
      scene.setSettings.should.have.been.calledOnce;
    });

    it('should start the animation loop', () => {
      sandbox.spy(scene, 'animate');
      scene.setUp();

      scene.animate.should.have.been.called;
    });
  });

  describe('getCamera', () => {
    const aspect = window.innerWidth / window.innerHeight;
    let camera;

    beforeEach(() => {
      camera = scene.getCamera();
    });

    it('should return an instance of THREE.PerspectiveCamera', () => {
      camera.should.be.instanceOf(THREE.PerspectiveCamera);
    });

    it('should set the camera\'s aspect ratio to that of the window', () => {
      camera.aspect.should.be.a('number');
      camera.aspect.should.equal(aspect);
    });

    it('should start with a fov of 50', () => {
      camera.fov.should.be.a('number');
      camera.fov.should.equal(50);
    });

    it('should always have a frustum in [1, 10000]', (done) => {
      // the animation loop should only change the fov of the camera frustum
      // ensure that the frustum far and near planes are never changed
      let n = 0;
      let intervalId;

      const specNearFar = () => {
        camera.near.should.be.a('number');
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
      const controls = scene.getControls();

      scene.camera = scene.getCamera();
      controls.should.be.instanceOf(Controls);
    });

  });

  describe('renderScene', () => {
    it('should call the getter methods for the scene user controls', () => {
      const userControls = [
        'getRenderer',
        'getCamera',
        'getControls'
      ];

      userControls.forEach(userControl => {
        sandbox.spy(scene, userControl);
        scene.renderScene();
        scene[userControl].should.have.been.called;
      });
    });

    it('should add the camera to the THREE scene', () => {
      sandbox.spy(scene, 'add');
      scene.renderScene();
      
      scene.add.should.have.been.calledWith(scene.camera);
    });

    // TODO: replace with React
    xit('should set width and height of window as the renderer dimensions', () => {
      const width  = window.innerWidth;
      const height = window.innerHeight;
      
      sandbox.spy(scene.renderer, 'setSize');
      scene.renderScene();

      scene.renderer.setSize.should.have.been.calledWith(width, height);
    });
  });
});
