import THREE from 'three';
import Constants from 'constants';
import Math2 from 'engine/math2';
import Mesh from '../Utils/Mesh';
import Ellipse from '../Utils/Ellipse';
import Rings from './Rings';

export default class Orbital {

  /**
   * @param  {Object} data
   */
  constructor(data, parent) {
    this.updateQueue = [];
    this.data = data;
    this.setUp();
    this.renderChildren(parent);

    if(parent) {
      parent.add(this.getOrbital());
    }
  }

  /**
   * Renders the stage props that are part of this orbital
   */
  setUp = () => {
    this.ellipse = new Ellipse(this.data);
    this.mesh = new Mesh(this.data);
    
    if (this.data.ring) {
      this.mesh.body.add(new Rings(this.data.ring));
    }
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
   * Renders the orbital plane containing props
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
    this.setPlanarRotations(orbitalPlane, referencePlane);
    this.setAxialTilt();

    return referencePlane;
  }

  /**
   * Sets the y-order rotation of the mesh's body instance.
   * @param {Number} axialTilt
   */
  setAxialTilt = () => {
    this.rotateObject('x', this.mesh.body, this.data.axialTilt);
  }

  /**
   * Sets (x,z)-order rotations on subscene planes.
   * @param {[Object3D} orbitalPlane
   * @param {Object3D}  referencePlane
   */
  setPlanarRotations = (orbitalPlane, referencePlane) => {
    const {inclination, longAscNode, argPeriapsis} = this.data;

    this.rotateObject('x', referencePlane, inclination);
    this.rotateObject('z', referencePlane, longAscNode);
    this.rotateObject('z', orbitalPlane, argPeriapsis);
  }

  /**
   * Rotates an scene object.
   * @param  {String}   coordinate x, y, or z
   * @param  {Object3D} object     object to rotate
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
    const pos = this.ellipse.getPosition(time, this.data.periapses);

    this.updateQueue.forEach((update) => update(time));
    this.mesh.updatePosition(time, pos);
  }
}
