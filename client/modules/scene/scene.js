import Orbital from '../../props/orbital';
import THREE from 'three';

export default class {

  constructor() {
    this.scene = new THREE.Scene();
    this.renderScene();
    this.renderProps();
    this.animate();
  }

  addProps(props) {
    props.forEach((prop) => {
      // ...
    });
  }

  getRenderer() {
    return new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
  }

  getCamera() {
    let ratio = window.innerWidth / window.innerHeight;
    return new THREE.PerspectiveCamera(100, ratio, 1, 10000);
  }

  getControls() {
    return new THREE.OrbitControls(this.camera);
  }

  renderScene() {
    this.renderer = this.getRenderer();
    this.camera = this.getCamera();
    this.setRenderer(this.renderer);
    // this.controls = this.getControls(); // TODO: install node module!
console.log('dom element: ', this.renderer.domElement);
    document.body.appendChild(this.renderer.domElement);
  }

  animate() {
    this.testBody.updatePosition();
    this.camera.updateProjectionMatrix();
    this.scene.updateMatrixWorld();
    // this.skybox.render(this.renderer);
    this.renderer.render(this.scene, this.camera);
    
    // let distance = this.controls.maxDistance - this.controls.minDistance;
    // let radius = this.controls.getRadius();

    if(!this.perspectiveMode) {
      // this.camera.fov = radius / distance;
    }
 
    if(this.camera.fov > 100) {
      this.camera.fov = 100;
    }
    
    this.camera.updateProjectionMatrix();
    // this.controls.update();
    // this.skybox.update();
    
    requestAnimationFrame(this.animate.bind(this));
  }

  setRenderer(renderer) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.physicallyBasedShading = true;
    renderer.autoClear = false; //allow render overlay on top of skybox
    renderer.shadowMapEnabled = true;

    // controls.minDistance = 0;
    // controls.maxDistance = 500;

    this.camera.position.set(180, 50, 180);
    this.camera.rotation.order = 'YXZ';
  }

  // just a test
  renderProps() {
    this.testBody = new Orbital({
      GM: 6836529,
      axialTilt: 23.26,
      semimajor: 149598261,
      semiminor: 149556483,
      radius: 6378.0,
      rotation: 15.0411, // in arcseconds
      inclination: 1.57869,
      argPeriapsis: 114.20763,
      lastPeriapsis: 1136419200+3600*3, // UNIX time
      nextPeriapsis: 1167976800+3600*3, // UNIX time
      eccentricity: 0.01671123,
      longAscNode: 348.73936,
    });
    console.log(this.testBody.mesh.mesh);
    this.scene.add(this.testBody.mesh.mesh);
  }
}