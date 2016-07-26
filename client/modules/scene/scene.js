import Orbital from '../../props/orbital';
import THREE from 'three';
import Vector from '../../physics/vector';
import OrbitControls from 'three-orbit-controls';

export default class {

  constructor() {
    this.scene = new THREE.Scene();
    this.renderScene();
    this.renderProps();
    this.animate();
    this.c = 0;//test
  }

  addProps(props) {
    props.forEach((prop) => {
      // ...
    });
  }

  getRenderer = () => {
    return new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
  }

  getCamera = () => {
    let ratio = window.innerWidth / window.innerHeight;
    return new THREE.PerspectiveCamera(50, ratio, 1, 10000);
  }

  getControls = () => {
    let _orbitControls = OrbitControls(THREE);

    return new _orbitControls(this.camera);
  }

  renderScene = () => {
    this.renderer = this.getRenderer();
    this.camera   = this.getCamera();
    this.controls = this.getControls();

    this.camera.position.z = 500;
    this.camera.rotation.order = 'YXZ';

    // this.controls.zoomSpeed = 0.001;
    // this.controls.zoom0 = 200;
    // 
    this.controls.minDistance = 0;
    this.controls.maxDistance = 500;

    this.scene.add(this.camera);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);
  }

  getTime = () => {
    if(!this.c) {
      this.c = 1;
    }
    this.c++;//test
    let t = new Date();

    return (t.getTime() / 1000) + (this.c * 20000);

  }

  animate = () => {
    this.testBody.updatePosition(this.getTime());
    // this.camera.updateProjectionMatrix();
    // this.scene.updateMatrixWorld();

    // this.skybox.render(this.renderer);
    
    let distance = this.controls.maxDistance - this.controls.minDistance;
    let radius = Vector.magnitude(this.camera.position);

    this.camera.fov = radius / distance;


    if(this.camera.fov > 100) {
      this.camera.fov = 100;
    }
    // this.camera.updateProjectionMatrix();
    this.controls.update();
    // this.skybox.update();
    
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
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