import THREE from 'three';
import moment from 'moment';
import deepAssign from 'deep-assign';
import Constants from 'constants';
import Vector from 'engine/vector';
import Orbital from 'scene/objects/orbital';
import Controls from 'scene/stage/controls';

export default class Scene extends THREE.Scene {

  constructor(clock) {
    super();
    this.clock = clock;
    this.setUp();
  }

  /**
   * Calls all setup functions.
   */
  setUp = () => {
    this.renderScene();
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
      alpha: true,
      logging: false
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
  getControls = (camera) => {
    return new Controls(camera);
  }

  /**
   * Binds renderer, camera, and controls to current scene
   * and appends it to the DOM.
   */
  renderScene = () => {
    this.renderer = this.getRenderer();
    this.camera   = this.getCamera();
    this.controls = this.getControls(this.camera);

    this.add(this.camera);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);
  }

  /**
   * Animation loop.
   */
  animate = () => {
    this.controls.update();
    this.renderer.render(this, this.camera);
  }

  /**
   * Set settings defined in constants for defined scene components.
   */
  setSettings = () => {
    let settings = Constants.SCENE_SETTINGS;

    for(let component in settings) {
      this[component] = deepAssign(this[component], settings[component]);
    }
    this.camera.position.x = 300;
    this.camera.position.y = 300;
    this.camera.position.z = 300;//???
  }
}
