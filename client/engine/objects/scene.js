import Orbital from './orbital';
import THREE from 'three';
import Vector from '../physics/vector';
import moment from 'moment';
import Clock from '../global/clock';
import Controls from '../stage/controls';
import Constants from '../global/constants';
import deepAssign from 'deep-assign';

export default class Scene extends THREE.Scene {

  constructor() {
    super();
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
    return new Controls(this.camera);
  }

  /**
   * Binds renderer, camera, and controls to current scene
   * and appends it to the DOM.
   */
  renderScene = () => {
    this.renderer = this.getRenderer();
    this.camera   = this.getCamera();
    this.controls = this.getControls();

    this.add(this.camera);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);
  }

  /**
   * Animation loop.
   */
  animate = () => {
    this.testBody.updatePosition(this.clock.elapsedTime);
    this.controls.update();
    this.clock.update();

    requestAnimationFrame(this.animate);
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

  /* 
   **************************************************************
   ****** All API methods below are for components of scene *****
   **************************************************************
   */

  /**
   * Events to execute on each clock second ("tick")
   * @param  {Function} fn function to execute
   */
  tick = (fn) => {
    this.clock.tick(fn);
  }

  /**
   * Zooms to specified level
   * @param  {Number} level zoom percentage [0,1]
   */
  zoom = (level) => {
    this.controls.zoom(level);
  }

  /**
   * Change the proportion (scale) of the props in scene
   * @param  {Number} proportion scalar to multiply sizes by,
   *                             as an exponent of 10
   */
  size = (scale) => {
    // Math.pow(10, scale);
  }

  /**
   * Change the scale of the props in scene
   * @param  {Number} speed scalar to multiply time elapsed by,
   *                        as an exponent of 10
   */
  //TODO: change 'scale' property to 'speed' in Clock class
  speed = (speed) => {
    this.clock.scale = Math.pow(10, speed);
  }


  /* 
   ********************************************
   ****** Put all junk below this comment *****
   ********************************************
   */

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
      atmosphereColor: 0x808080,
      children: [{
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
        atmosphereColor: 0xFF0000
      }]
    }, this);
  }
}