
import THREE from 'three';
import OrbitControls from 'three-orbit-controls';
import Vector from '../physics/vector';

export default class Controls extends OrbitControls(THREE) {

  constructor(camera) {
    super(camera);
    this.camera = camera;
    this.level = 0;
    this.enabled = false;
  }

  /**
   * Change zoom. Overrides the existing zoom tween in progress.
   * @param {level} zoom level [0,100]
   */
  zoom = (level) => {
    level = level / 100;

    if(this.level !== level) {
      this.pan(level);
      this.level = level;
    }
  }

  /**
   * Sets the current camera position to the scaled zoom vector.
   * @param  {Number} percent percentage of zoom [0,1]
   */
  pan = (percent) => {
    var p = this.camera.position;
    var v = this.getZoomVector(p, percent);

    p.set(v.x, v.y, v.z);
  }

  /**
   * Returns the current vector scaled to the desired zoom.
   * @param  {Vector3} v current position vector
   * @param  {Number}  p percentage of zoom [0,1]
   * @return {Vector3}
   */
  getZoomVector = (v, p) => {
    return v
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