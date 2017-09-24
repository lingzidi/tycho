import TWEEN from 'tween.js';
import {Vector3} from 'three';
import Constants from '../constants';
import Scale from '../utils/Scale';

export default class CameraService {

  static CAMERA_INITIAL_POSITION = new Vector3(300, 300, 300)

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
      .to(CameraService.vectorToObject(dest), Constants.WebGL.Tween.NORMAL)
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
  static getTargetPosition = (positions, targetName) => {
    if (positions && positions[targetName]) {
      return positions[targetName].position3d;
    }
    return new Vector3(0, 0, 0);
  }

  /**
   * Calculates the min distance from target to camera to avoid collision.
   *
   * @param {Object[]} orbitals - list of orbitals
   * @param {String} targetName - id of active orbital target
   * @param {Number} scale - user-defined planet scale
   * @returns {Number} min distance
   */
  static getMinDistance = (orbitals, targetName, scale) => {
    const targetRadius = CameraService.getTargetRadius(orbitals, targetName);
    const scaledRadius = Scale(targetRadius, scale);

    return scaledRadius * 2;
  }

  /**
   * Finds the planet with the given targetName and returns its radius.
   *
   * @param {Object[]} orbitals - list of orbitals
   * @param {String} targetName - id of active orbital target
   * @returns {Number} orbital radius
   */
  static getTargetRadius = (orbitals, targetName) => {
    let targetRadius;

    orbitals.forEach((orbital) => {
      if (!targetRadius) {
        if (orbital.id === targetName) {
          targetRadius = orbital.radius;
        } else if (orbital.satellites) {
          targetRadius = CameraService
            .getTargetRadius(orbital.satellites, targetName);
        }
      }
    });
    return targetRadius;
  }
}
