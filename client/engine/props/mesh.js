import THREE from 'three';
import Constants from '../global/constants';
import Scale from '../global/scale';
import Math2 from '../physics/math2';
import Prop from './prop';

export default class Mesh extends THREE.Object3D {

  /**
   * @param  {Object} data
   */
  constructor(data) {
    super();
    this.setData(data);
    this.renderGeometries();
  }

  /**
   * Set global data, with appropriate scales.
   * @param  {Object} data
   */
  setData = (data) => {
    // this.rotation  = data.rotation;
    this.radius    = data.radius;
    this.axialTilt = data.axialTilt;
  }

  /**
   * Render mesh and mesh body
   */
  renderGeometries = () => {
    this.body = this.renderBody(0xFFFFFF);
    // this.object = this.renderMesh();
    this.add(this.body);
    this.add( new THREE.AxisHelper( 200 ) );
  }

  /**
   * Render the decorated body mesh.
   * @param  {Hex} atmosphere
   * @return {Object3D}
   */
  renderBody = (atmosphere) => {
    let radius   = Scale(this.radius);
    let geometry = new THREE.SphereGeometry(radius, 32, 32);
    let material = new THREE.MeshPhongMaterial({
      specular: atmosphere
    });
    return new THREE.Mesh(geometry, material);
  }

  /**
   * Render the rotated mesh.
   * @return {Object3D}
   */
  renderMesh = () => {
    let mesh = new THREE.Object3D();
    mesh.rotation.x = Math2.HalfPI;
    mesh.rotation.z = -Math2.toRadians(this.axialTilt);

    return mesh;
  }

  /**
   * Rotate mesh to the given time by its rotational constant
   * @param  {Number} time rotational constant
   */
  rotate = (time) => {
    this.body.rotation.y = Math2.arcSecToRad(time, this.rotation);
  };
  
  /**
   * Scales mesh by a constant
   * @param  {Number} scale
   */
  updateScale = (scale) => {
    if(this.radius) {
      ['x', 'y', 'z'].forEach((c) => {
        this[c] = s;
      });
    }
  }

  /**
   * Update the position of the mesh acording to time
   * @param  {Number}  time
   * @param  {Vector}  pos new position
   */
  updatePosition = (time, pos) => {
    Object
      .keys(pos)
      .forEach((c) => {
        this.position[c] = pos[c];
      });
  }
}