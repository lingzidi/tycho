import * as THREE from 'three';
import OrbitControls from 'three-orbit-controls';

export default class Controls extends OrbitControls(THREE) {

  constructor(camera, domElement) {
    super(camera, domElement);

    this.camera = camera;
    this.level = 0;
    this.enabled = true;
    this.enableZoom = false;
    this.maxDistance = 500;
    this.minDistance = 1;
  }

  /**
   * Change zoom. Overrides the existing zoom tween in progress.
   *
   * @param {level} level - destination zoom level [0,100]
   */
  zoom = (level) => {
    level = level / 100;

    if(this.level !== level) {
      this.pan(level);
      this.level = level;
    }
  }

  /**
   * Calculates the zoom percentage from the given mousewheel delta.
   *
   * @param {Number} delta - mousewheel delta
   * @return {Number} new zoom level
   */
  getZoomDelta = (delta) => {
    let zoom = this.level * 100;
    
    zoom += (delta / 50); // TODO: constant
    zoom = Math.max(zoom, 1);
    zoom = Math.min(zoom, 100);
   
    return zoom;
  }

  /**
   * Sets the current camera position to the scaled zoom vector.
   *
   * @param {Number} percent - percentage of zoom [0,1]
   */
  pan = (percent) => {
    let p = this.camera.position;
    let v = this.getZoomVector(p, percent);
    
    p.set(v.x, v.y, v.z);
  }

  /**
   * Returns the current vector scaled to the desired zoom.
   * @param {Vector3} v - current position vector
   * @param {Number} p - percentage of zoom [0,1]
   * @return {Vector3}
   */
  getZoomVector = (v, p) => {
    return v
      .clone()
      .normalize()
      .multiplyScalar(
        this.maxDistance * p
      );
  }

  /**
   * Returns the distance between <0> and current camera position.
   * @return {Number} distance
   */
  getDistance = () => {
    return this.maxDistance - this.minDistance;
  }

  /**
   * Enable controls.
   */
  enable = () => {
    this.enabled = true;
  }

  /**
   * Disable controls.
   */
  disable = () => {
    this.enabled = false;
  }
}
