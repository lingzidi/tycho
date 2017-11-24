import * as THREE from 'three';
import Math2 from './Math2';
import Scale from '../utils/Scale';
import Constants from '../constants';

export default class OrbitalService {

  /**
   * Ascension of the ecliptic plane.
   * @type {Number}
   */
  static ASCENSION = 90
  
  /**
   * Calculates the Eulerian rotation set of the ecliptic group.
   *
   * @param {Object} props - OrbitalContainer props
   * @param {Number} props.longitudeOfAscendingNode - longitude of ascending node, in degrees
   * @returns {THREE.Euler} Eulerian rotation set
   */
  static getEclipticGroupRotation = ({longitudeOfAscendingNode, isSatellite}) => {
    const ascension = isSatellite ? 0 : -OrbitalService.ASCENSION;

    return OrbitalService.toEuler({
      x: ascension,
      z: OrbitalService.ASCENSION + longitudeOfAscendingNode
    });
  }

  /**
   * Calculates the Eulerian rotation set of the orbital group.
   *
   * @param {Object} props - OrbitalContainer props
   * @param {Number} props.inclination - inclination, in degrees
   * @param {Number} props.argumentOfPeriapsis - argument of periapsis, in degrees
   * @returns {THREE.Euler} Eulerian rotation set
   */
  static getOrbitalGroupRotation = ({inclination, argumentOfPeriapsis}) => {
    return OrbitalService.toEuler({
      x: inclination,
      z: OrbitalService.ASCENSION + argumentOfPeriapsis
    });
  }

  /**
   * Calculates 3D rotation of the spherical orbital body.
   *
   * @param {Object} props - OrbitalContainer props
   * @param {Number} props.axialTilt - axis tilt
   * @param {Number} props.sidereal - apparent sidereal rotation of orbital (in sidereal days)
   * @param {Number} props.time - UNIX timestamp at position (in milliseconds)
   * @returns {THREE.Euler} Eulerian vector
   */
  static getBodyRotation = ({axialTilt, sidereal, time}) => {
    return OrbitalService.toEuler({
      x: axialTilt,
      z: OrbitalService.getRotationCompleted(sidereal, time)
    });
  }

  /**
   * Returns the rotation of the given sidereal in degrees w.r.t. time.
   *
   * @note All rotation periods are w.r.t. to one Earth day (not sidereal days!)
   * @param {Number} sidereal - apparent sidereal rotation of orbital (in sidereal days)
   * @param {Number} time - UNIX timestamp at position (in seconds)
   * @returns {Number} degree of rotation [0,360]
   */
  static getRotationCompleted = (sidereal, time) => {
    const unixTimeToDays = time / 60 / 60 / 24; // seconds to days
    const percentRotated = (unixTimeToDays / sidereal) % 1;
    const degreesRotated = percentRotated * 360;
    
    return degreesRotated;
  }

  /**
   * Returns the present position vector w.r.t. the elliptical plane.
   *
   * @param {Object} props - OrbitalContainer props
   * @param {Object} props.periapses - Orbital periapses
   * @param {Number} props.time - current time, in seconds
   * @param {Ellipse} ellipse - instance of ellipse
   * @returns {THREE.Vector3} projected body position
   */
  static getBodyPosition = ({periapses, time}, ellipse) => {
    return ellipse.getPosition(time, periapses);
  }

  /**
   * Scales the body radius by the global scaling factor.
   *
   * @param {Object} props - OrbitalContainer props
   * @param {Number} props.radius - body radius, in kilometers
   * @param {Number} props.scale=1 - scalar multiple
   * @returns {Number} scaled body radius
   */
  static getBodyRadius = ({radius, scale}) => {
    return Scale(radius, scale);
  }

  /**
   * Calculates path opacity based on whether or not the orbital with
   * the given id is in the set of highlighted orbitals.
   *
   * @param {Object} props - OrbitalContainer props
   * @param {String} props.id - id of orbital
   * @param {String[]} highlightedOrbitals - list of highlighted orbital ids
   * @returns {Number} opacity
   */
  static getPathOpacity = ({id}, highlightedOrbitals) => {
    if (Array.isArray(highlightedOrbitals)) {
      const isHighlighted = highlightedOrbitals
        .filter((orbital) => orbital === id)
        .length;

      if (isHighlighted) {
        return Constants.UI.HOVER_OPACITY_ON;
      }
    }
    return Constants.UI.HOVER_OPACITY_OFF;
  }

  /**
   * Returns the max camera viewing distance, in WebGL units.
   * 
   * @param  {Boolean} isSatellite
   * @return {Number}
   */
  static getMaxViewDistance = (isSatellite) => {
    if (isSatellite) {
      return 7;
    }
    return Infinity;
  }

  /**
   * Checks if the given vector is within the given camera frustum.
   *
   * @param {THREE.Camera} camera - active renderer camera
   * @param {THREE.Matrix4} matrix - projection matrix
   * @param {THREE.Vector3} vector - vector to check if in frustum
   * @returns {Boolean} whether or not vector is in frustum
   */
  static isInCameraView = (camera, matrix, vector) => { // TODO: move to CameraService?
    const frustum = new THREE.Frustum();
    frustum.setFromMatrix(matrix);
    
    return frustum.containsPoint(vector);
  }

  /**
   * Translate 3D space coordinates to 2D screen ones.
   *
   * @param {THREE.Vector3} position - current position in ellipse
   * @param {THREE.Camera} camera - active renderer camera
   * @returns {Object} coordinates with `top` and `left` values
   */
  static translateWorldToScreen = (position, camera) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const matrix = new THREE.Matrix4();

    if (position && camera) {
      const {x, y, z} = position;
      const pos = new THREE.Vector3(x, y, z);
      
      matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);

      if (OrbitalService.isInCameraView(camera, matrix, pos)) {
        pos.applyMatrix4(matrix);

        const left = (1 + pos.x) * width / 2;
        const top = (1 - pos.y) * height / 2;
        
        return {top, left};
      }
    }
    return null;
  }

  /**
   * Returns the vector w.r.t. <0> of the given mesh.
   *
   * @param {THREE.Object3D} mesh - object3d to get vector position of
   * @returns {THREE.Vector3} world position
   */
  static getWorldPosition = (mesh) => {
    if (mesh) {
      const vect = new THREE.Vector3();
      const matrix = mesh
        ._reactInternalInstance
        ._threeObject
        .matrixWorld;

      vect.setFromMatrixPosition(matrix);

      const {x, y, z} = vect;
      return {x, y, z};
    }
    return null;
  }

  /**
   * Converts a rotational vector to an Eulerian rotation set.
   *
   * @param {Object} coords - rotations
   * @param {Number} [coords.x = 0] - x rotation, in degrees
   * @param {Number} [coords.y = 0] - y rotation, in degrees
   * @param {Number} [coords.z = 0] - z rotation, in degrees
   * @returns {THREE.Euler} Eulerian rotation set
   */
  static toEuler = ({x, y, z}) => {
    const rad = (x) => {
      if (x) {
        return Math2.toRadians(x);
      }
      return 0;
    }
    return new THREE.Euler(rad(x), rad(y), rad(z))//, 'ZYX');
  }

  /**
   * Calculates the real-world distance at present position to the Sun.
   *
   * @param {Object} positions - positions map of orbitals
   * @param {String} targetId - name of the active target
   * @returns {Number} current distance to the Sun, in kilometers
   */
  static getDistanceToSun = (positions, targetId) => {
    if (positions && positions[targetId]) {
      const {x, y, z} = positions[targetId].position3d;
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      
      return magnitude * Constants.WebGL.UNIT_SCALE;
    }
    return 0;
  }

  /**
   * Finds the planet with the given targetId.
   *
   * @param {Object[]} orbitals - list of orbitals
   * @param {String} targetId - id of active orbital target
   * @returns {Number} orbital radius
   */
  static getTargetByName = (orbitals, targetId) => {
    let target;

    orbitals.forEach((orbital) => {
      if (!target) {
        if (orbital.id === targetId) {
          target = orbital;
        } else if (orbital.satellites) {
          target = OrbitalService
            .getTargetByName(orbital.satellites, targetId);
        }
      }
    });
    return target;
  }
}