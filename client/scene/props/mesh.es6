import THREE from 'three';
import Constants from 'constants';
import Math2 from 'engine/math2';
import Scale from 'engine/scale';

export default class Mesh extends THREE.Object3D {

  /**
   * @param  {Object} data
   */
  constructor(data) {
    super();
    this.setData(data);
    this.setUp();
  }

  /**
   * Set global data, with appropriate scales.
   * @param  {Object} data
   */
  setData = (data) => {
    this.arcRotate = data.rotation;
    this.radius = Scale(data.radius);
  }

  /**
   * Render mesh and mesh body
   */
  setUp = () => {
    this.body = this.renderBody();
    this.add(this.body);
    this.body.add( new THREE.AxisHelper( 200 ) );
  }

  /**
   * Render the decorated body mesh.
   * @param  {Hex} atmosphere
   * @return {Object3D}
   */
  renderBody = () => {
    let geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    let material = new THREE.MeshPhongMaterial({
      specular: this.atmosphere
    });
    return new THREE.Mesh(geometry, material);
  }

  /**
   * Rotate mesh to the given time by its rotational constant
   * @param  {Number} time rotational constant
   */
  rotate = (time) => {
    this.body.rotation.z = Math2.arcSecToRad(time, this.arcRotate);
  };
  
  /**
   * Scales mesh by a constant
   * @param  {Number} scale
   */
  updateScale = (scale) => {
    if(this.radius) {
      ['x', 'y', 'z'].forEach(c => {
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
      .forEach(c => {
        this.position[c] = pos[c];
      });
    this.rotate(time);
  }
}