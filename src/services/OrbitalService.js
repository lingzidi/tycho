import * as THREE from 'three';
import Math2 from './Math2';
import Scale from '../utils/Scale';

export default class OrbitalService {
  
  /**
   * Calculates inclination at a right angle if parity matches.
   *
   * @param {Number} inclination - angle of inclination, in degrees
   * @param {Boolean} [odd = false] - parity
   * @returns {Number} calculated inclination
   */
  static getInclination = (inclination, odd = false) => {
    if (odd) {
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
   * @param {Boolean} props.odd - orbital parity
   * @returns {THREE.Euler} Eulerian vector
   */
  static getEclipticGroupRotation = ({inclination, longitudeOfAscendingNode, odd}) => {
    return OrbitalService.toEuler({
      x: OrbitalService.getInclination(inclination, odd),
      z: longitudeOfAscendingNode
    });
  }

  /**`
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
   * @param {Number} props.arcRotate - orbital rotation, in arcseconds
   * @param {Number} props.time - current time, in seconds
   * @returns {THREE.Euler} Eulerian vector
   */
  static getBodyRotation = ({axialTilt, arcRotate, time}) => {
    return OrbitalService.toEuler({
      x: Math.abs(90 - axialTilt),
      y: Math2.arcSecToDeg(time, arcRotate),
    });
  }

  /**
   * Returns the present position vector w.r.t. the elliptical plane.
   *
   * @param {Object} props - OrbitalContainer props
   * @param {Object} props.periapses - Orbital periapses (TODO: change to number, as orbitalPeriod)
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
      const pos = position.clone();
      
      matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      pos.applyMatrix4(matrix);
      
      const left = (1 + pos.x) * width / 2;
      const top = (1 - pos.y) * height / 2;
      
      return {top, left};
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

      return vect;
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
}

