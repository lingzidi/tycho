import * as THREE from 'three';
import Math2 from './Math2';
import Scale from '../utils/Scale';
import Constants from '../constants';
import Physics from './Physics';

export default class OrbitalService {
  
  /**
   * Calculates inclination at a right angle if parity matches.
   *
   * @param {Number} inclination - angle of inclination, in degrees
   * @param {Boolean} [isSatellite = false] - parity
   * @returns {Number} calculated inclination
   */
  static getInclination = (inclination, isSatellite = false) => {
    if (isSatellite) {
      return inclination;
    }
    return inclination - 90;
  }

  /**
   * Calculates the Eulerian vector of the ecliptic group
   *
   * @param {Object} props - OrbitalContainer props
   * @param {Number} props.inclination - angle of inclination, in degrees
   * @param {Number} props.longitudeOfAscendingNode - longitude of ascending node, in degrees
   * @param {Boolean} props.isSatellite - orbital parity
   * @returns {THREE.Euler} Eulerian vector
   */
  static getEclipticGroupRotation = ({inclination, longitudeOfAscendingNode, isSatellite}) => {
    return OrbitalService.toEuler({
      x: OrbitalService.getInclination(inclination, isSatellite),
      z: longitudeOfAscendingNode
    });
  }

  /**
   * Calculates the Eulerian vector of the orbital group
   *
   * @param {Object} props - OrbitalContainer props
   * @param {Number} props.argumentOfPeriapsis - argument of periapsis, in degrees
   * @returns {THREE.Euler} Eulerian vector
   */
  static getOrbitalGroupRotation = ({argumentOfPeriapsis}) => {
    return OrbitalService.toEuler({
      z: argumentOfPeriapsis
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
      x: Math.abs(90 - axialTilt),
      y: OrbitalService.getRotationCompleted(sidereal, time)
    });
  }

  /**
   * Returns the rotation of the given sidereal in degrees w.r.t. time.
   *
   * @note All rotation periods are w.r.t. to one Earth day (not sidereal days!)
   * @param {Number} sidereal - apparent sidereal rotation of orbital (in sidereal days)
   * @param {Number} time - UNIX timestamp at position (in milliseconds)
   * @returns {Number} degree of rotation [0,360]
   */
  static getRotationCompleted = (sidereal, time) => {
    // const unixTimeToDays = time / 1000 / 60 / 60 / 24; // millisecs to days
    const percentRotated = (time / sidereal) % 1;
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
   * Calculates path opacity based on current active state.
   *
   * @param {Boolean} active - active state of orbital
   * @returns {Number} opacity
   */
  static getPathOpacity = (active) => {
    if (active) {
      return Constants.UI.HOVER_OPACITY_ON;
    }
    return Constants.UI.HOVER_OPACITY_OFF;
  }

  /**
   * Checks if the given vector is within the given camera frustum.
   *
   * @param {THREE.Camera} camera - active renderer camera
   * @param {THREE.Matrix4} matrix - projection matrix
   * @param {THREE.Vector3} vector - vector to check if in frustum
   * @return {Boolean} whether or not vector is in frustum
   */
  static isInCameraView = (camera, matrix, vector) => {
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
   * Converts a standard 3D vector to an Eulerian one.
   *
   * @param {Object} coords - coordinates
   * @param {Number} [coords.x = 0] - x coordinate
   * @param {Number} [coords.y = 0] - y coordinate
   * @param {Number} [coords.z = 0] - z coordinate
   * @returns {THREE.Euler} Eulerian vector
   */
  static toEuler = ({x, y, z}) => {
    const toRad = val => val ? Math2.toRadians(val) : 0;
    return new THREE.Euler(toRad(x), toRad(y), toRad(z));
  }

  /**
   * Calculates the real-world distance at present position to the Sun.
   *
   * @param {Object} positions - positions map of orbitals
   * @param {String} targetName - name of the active target
   * @returns {Number} current distance to the Sun, in AU
   */
  static getDistanceToSun = (positions, targetName) => {
    if (positions && positions[targetName]) {
      const {x, y, z} = positions[targetName].position3d;
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      
      return Physics.toAU(magnitude);
    }
    return 0;
  }

  /**
   * Finds the planet with the given targetName.
   *
   * @param {Object[]} orbitals - list of orbitals
   * @param {String} targetName - id of active orbital target
   * @returns {Number} orbital radius
   */
  static getTargetByName = (orbitals, targetName) => {
    let target;

    orbitals.forEach((orbital) => {
      if (!target) {
        if (orbital.id === targetName) {
          target = orbital;
        } else if (orbital.satellites) {
          target = OrbitalService
            .getTargetByName(orbital.satellites, targetName);
        }
      }
    });
    return target;
  }
}
