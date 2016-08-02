import Orbital from './orbital';
import THREE from 'three';
import Vector from '../physics/vector';
import OrbitControls from 'three-orbit-controls';
import moment from 'moment';
import Clock from '../global/clock';
import Constants from '../global/constants';
import deepAssign from 'deep-assign';

export default class {

  constructor() {
    this.scene = new THREE.Scene();
    this.clock = new Clock();
    
    this.renderScene();
    this.renderProps();
    this.setSettings();
    this.animate();
  }

  /**
   * New instance of WebGL renderer
   * @return {THREE.WebGLRenderer}
   */
  getRenderer = () => {
    return new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
  }

  /**
   * New camera instance
   * @return {THREE.Camera}
   */
  getCamera = () => {
    let ratio = window.innerWidth / window.innerHeight;
    return new THREE.PerspectiveCamera(50, ratio, 1, 10000);
  }

  /**
   * New instance of OrbitControls
   * @return {THREE.OrbitControls}
   */
  getControls = () => {
    let _orbitControls = OrbitControls(THREE);
    return new _orbitControls(this.camera);
  }

  /**
   * Binds renderer, camera, and controls to current scene
   * and appends it to the DOM.
   */
  renderScene = () => {
    this.renderer = this.getRenderer();
    this.camera   = this.getCamera();
    this.controls = this.getControls();

    this.scene.add(this.camera);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);
  }

  /**
   * Animation loop.
   */
  animate = () => {
    this.testBody.updatePosition(this.clock.elapsedTime);
    this.controls.update();
    this.updateCameraFov();
    this.clock.update();

    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Updates the field of view of the camera so that all objects
   * on the screen are visible within the current camera frustum.
   */
  updateCameraFov = () => {
    let distance = this.controls.maxDistance - this.controls.minDistance;
    let radius = Vector.magnitude(this.camera.position);

    this.camera.fov = radius / distance;

    if(this.camera.fov > 100) {
      this.camera.fov = 100;
    }
  }

  /**
   * Events to execute on each clock second ("tick")
   * @param  {Function} fn function to execute
   */
  tick = (fn) => {
    this.clock.tick(fn);
  }

  /**
   * Set settings defined in constants for defined scene components.
   */
  setSettings = () => {
    let settings = Constants.SCENE_SETTINGS;

    for(let component in settings) {
      this[component] = deepAssign(this[component], settings[component]);
    }
    this.camera.position.z = 500;//???
  }

  // just a test
  renderProps = () => {
    this.testBody = new Orbital({
      GM: 6836529,
      axialTilt: 23.26,
      semimajor: 149598261,
      semiminor: 149556483,
      radius: 637800.0,
      rotation: 15.0411, // in arcseconds
      inclination: 1.57869,
      argPeriapsis: 114.20763,
      lastPeriapsis: 1136419200+3600*3, // UNIX time
      nextPeriapsis: 1167976800+3600*3, // UNIX time
      eccentricity: 0.01671123,
      longAscNode: 348.73936,
    });
    this.scene.add(this.testBody.getOrbital());
  }
}