import TWEEN from 'tween.js';
import {Vector3} from 'three';

export default class SceneService {

  /**
   * Converts an instance of Vector3 to a plain object with x, y, z properties.
   *
   * @param {Vector3} v - vector to convert
   * @returns {Object} - plain object with x, y, z properties
   */
  static vectorToObject = (v) => {
    const {x, y, z} = v;
    return {x, y, z};
  }

  /**
   * Converts a plain object to an instance of Vector3.
   *
   * @param {Object} o - object, with x, y, z properties
   * @returns {Vector3} - converted vector
   */
  static objectToVector = (o) => {
    return new Vector3(o.x, o.y, o.z);
  }

  /**
   * Runs a given tween instance with the provided params.
   *
   * @param {Tween} tween - instance of tween
   * @param {Vector3} dest - destination vector
   * @param {Function} onComplete - callback
   */
  static startTween = (tween, dest, onComplete) => {
    return tween
      .easing(TWEEN.Easing.Quadratic.Out)
      .to(SceneService.vectorToObject(dest), 2000)
      .onComplete(onComplete)
      .start();
  }

  /**
   * Returns the vector of the active target position.
   * If no target position is found, it will return <0>.
   *
   * @param {Object} state - scene state
   * @param {Object} props - scene props
   * @returns {Vector3} - active target vector
   */
  static getTargetPosition = (state, props) => {
    if (state) {
      const {positions} = state;
      const {perspective, targetName} = props;

      if (positions[targetName] && !perspective) {
        return positions[targetName].position3d;
      }
    }
    return new Vector3(0, 0, 0);
  }

  /**
   * Updates the camera position and lookAt vectors for the given target positions.
   *
   * @param {Object} state - scene state
   * @param {Object} props - scene props
   * @param {Camera} camera - scene camera
   */
  static updateCameraVectors = (state, props, camera) => {
    const {positions, targetName} = state;
    const {perspective, lookAtName} = props;

    if(positions[targetName] && positions[lookAtName] && perspective) {
      camera.position.copy(positions[targetName].position3d);
      camera.lookAt(positions[lookAtName].position3d);
    }
  }

  /**
   * Gets the zoom delta from controls and invokes the given action if zoom has changed.
   *
   * @param {Event} event - DOM mousewheel event
   * @param {Controls} controls - instance of controls
   * @param {Function} action - callback action
   */
  static mapZoom = (event, controls, action) => {
    const zoom = controls.getZoomDelta(event.deltaY);
    const current = Math.round(controls.level * 100);

    if (current !== zoom) {
      action(zoom);
    }
  }
}
