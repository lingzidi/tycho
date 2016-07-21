import Constants from '../../constants';
import {Math2, OrbitalDynamics} from '../../physics';

export class OrbitalService {

  /**
   * @param  {Object} data
   */
  constructor(data) {
    this.data = data;
  }

  /**
   * Rotates an scene object.
   * @param  {String}   coordinate x, y, or z
   * @param  {Objecr3D} object     object to rotate
   * @param  {Number}   rotation   in degrees
   */
  rotateObject(coordinate, object, rotation) {
    if(isNaN(object[coordinate])) {
      object[coordinate] = 0;
    }
    object[coordinate] += Math2.toRadians(rotation);
  }

  /**
   * @return {Object3D} new plane
   */
  getPlane() {
    return new THREE.Object3D();
  }

  /**
   * Gets the orbital scene containing the props.
   * @param  {Object}   data
   * @return {Object3D}
   */
  getOrbitalPlane(data) {
    let mesh          = new Mesh(data);
    let orbitalPlane  = getPlane();
    let ellipse       = getThreeEllipse(data.semimajor, data.semiminor);

    orbitalPlane.add(ellipse);
    orbitalPlane.add(mesh);

    return orbitalPlane;
  }

  /**
   * Set (x,z)-order rotations on subscene planes.
   * @param {[Object3D} orbitalPlane
   * @param {Object3D}  referencePlane
   * @param {Object}    data
   */
  setPlanarRotations(orbitalPlane, referencePlane, data) {
    this.rotateObject('x', referencePlane, data.inclination);
    this.rotateObject('x', orbitalPlane, 180);

    this.rotateObject('z', referencePlane, data.longAscNode);
    this.rotateObject('z', orbitalPlane, data.argPeriapsis);
  }

  /**
   * Returns the mesh reference plane containing relevant props.
   * @param  {Object}   data
   * @return {Object3D}
   */
  getOrbital(data) {
    let referencePlane = getPlane();
    let orbitalPlane   = getOrbitalPlane(data);

    referencePlane.add(orbitalPlane);
    setPlanarRotations(orbitalPlane, referencePlane, data);

    return referencePlane;
  }

  /**
   * Returns the numeric scalar for the given property.
   * @param  {String} scaleType
   * @return {Number}
   */
  getScale(scaleType) {
    return 1;//TODO
  }

  /**
   * Update real-time attributes (velocity and position).
   * @param  {Number}  time    UNIX time
   * @param  {Object}  data    
   * @param  {Mesh}    mesh
   * @param  {Ellipse} ellipse
   */
  updatePosition(time, data, mesh, ellipse) {
    vect.setFromMatrixPosition(mesh.matrix);//not necessary?
    ellipse.updatePosition(time);
    mesh.setYRotation(motion * Math2.TAU);
    mesh.rotate(timestamp);
  }
}