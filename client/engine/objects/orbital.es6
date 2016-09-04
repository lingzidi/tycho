import Constants from '../global/constants';
import Mesh from '../props/mesh';
import Ellipse from '../props/ellipse';
import THREE from 'three';
import Math2 from '../physics/math2';

export default class Orbital {

  /**
   * @param  {Object} data
   */
  constructor(data, parent) {
    this.updateQueue = [];
    this.data = data;
    this.renderGeometries();
    this.renderChildren(parent);

    if(parent) {
      parent.add(this.getOrbital());
    }
  }

  /**
   * Renders the stage props that are part of this orbital
   */
  renderGeometries = () => {
    let data = this.data;
    this.mesh    = new Mesh(data);
    this.ellipse = new Ellipse(data);
  }

  /**
   * Renders all instances of children from within the queue.
   */
  renderChildren = () => {
    let children = this.data.children;

    if(children) {
      children.forEach(child => {
        let orbital = new Orbital(child, this.mesh);
        this.updateQueue.push(orbital.updatePosition);
      });
    }
  }

  /**
   * Light up orbital path
   */
  illuminatePath = () => {
    this.label.illuminated = true;
    this.ellipse.setPathBrightness(0.4);
  }

  /**
   * Darken orbital path
   */
  darkenPath = () => {
    this.label.illuminated = false;
    this.ellipse.setPathBrightness(1);
  }

  /**
   * Gets the orbital scene containing the props.
   * @return {Object3D}
   */
  getOrbitalPlane = () => {
    let orbitalPlane = new THREE.Object3D();

    orbitalPlane.add(this.ellipse);
    orbitalPlane.add(this.mesh);

    return orbitalPlane;
  }

  /**
   * Returns the mesh reference plane containing relevant props.
   * @param  {Object}   data
   * @return {Object3D}
   */
  getOrbital = () => {
    let referencePlane = new THREE.Object3D();
    let orbitalPlane   = this.getOrbitalPlane(this.data);

    referencePlane.add(orbitalPlane);
    this.setPlanarRotations(orbitalPlane, referencePlane, this.data);

    return referencePlane;
  }

  /**
   * Set (x,z)-order rotations on subscene planes.
   * @param {[Object3D} orbitalPlane
   * @param {Object3D}  referencePlane
   * @param {Object}    data
   */
  setPlanarRotations = (orbitalPlane, referencePlane, data) => {
    this.rotateObject('x', referencePlane, data.inclination);
    this.rotateObject('z', referencePlane, data.longAscNode);
    this.rotateObject('z', orbitalPlane, data.argPeriapsis);
  }

  /**
   * Rotates an scene object.
   * @param  {String}   coordinate x, y, or z
   * @param  {Objecr3D} object     object to rotate
   * @param  {Number}   rotation   in degrees
   */
  rotateObject = (coordinate, object, rotation) => {
    if(isNaN(object[coordinate])) {
      object.rotation[coordinate] = 0;
    }
    object.rotation[coordinate] += Math2.toRadians(rotation);
  }

  /**
   * Update real-time attributes (velocity and position).
   * @param  {Number}  time UNIX time
   */
  updatePosition = (time) => {
    this.updateQueue.forEach((update) => {
      update(time);
    });

    this.mesh.updatePosition(time,
      this.ellipse.getPosition(
        time, this.data.periapses
      )
    );
  }
}