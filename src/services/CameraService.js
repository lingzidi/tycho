import TWEEN from 'tween.js';
import {Vector3} from 'three';
import Constants from '../constants';
import OrbitalService from './OrbitalService';
import Scale from '../utils/Scale';

export default class CameraService {

  static CAMERA_INITIAL_POSITION = new Vector3(300, 300, 300) // TODO: const

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
   * Calculates the min distance from target to camera to avoid collision.
   *
   * @param {Object[]} orbitals - list of orbitals
   * @param {String} targetName - id of active orbital target
   * @param {Number} scale - user-defined planet scale
   * @returns {Number} min distance
   */
  static getMinDistance = (orbitals, targetName, scale) => {
    const targetRadius = OrbitalService.getTargetByName(orbitals, targetName).radius;
    const scaledRadius = Scale(targetRadius, scale);

    return scaledRadius * 2;
  }
  
  /**
   * Creates an instance of Tween for moving a pivot to a given target.
   *
   * @param {Vector3} from - starting position
   * @param {Vector3} to - target position
   * @param {Object3D} target - new target
   * @param {Object3D} group - camera pivot
   * @returns {Tween}
   */
  static getPivotTween = (from, to, target, group) => {
    return new TWEEN
      .Tween(from)
      .to(to, 2000)
      .onUpdate(CameraService.setPivotPosition.bind(this, group, from))
      .onComplete(CameraService.movePivot.bind(this, group, target))
      .start();
  }

  /**
   * Moves the given pivot to the new target at <0>.
   *
   * @param {Object3D} group - camera pivot
   * @param {Object3D} target - new target
   */
  static movePivot = (group, target) => {
    target.add(group);
    group.position.set(0, 0, 0);
  }

  /**
   * Sets the camera pivot position.
   *
   * @param {Object3D} group - camera pivot
   * @param {Vector3} vect - new vector position
   */
  static setPivotPosition = (group, {x, y, z}) => {
    group.position.set(x, y, z);
  }

  /**
   * Returns the world position (i.e., w.r.t. <0>) of the given target.
   *
   * @param {Object3D} target - object to get world position of
   * @returns {Vector3} world position
   */
  static getWorldPosition = (target) => {
    target.updateMatrixWorld();

    const matrix = target.matrixWorld;
    const vect = new Vector3();

    vect.setFromMatrixPosition(matrix);

    return vect;
  }
}
