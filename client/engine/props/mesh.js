import THREE from 'three';
import Constants from '../global/constants';
import Math2 from '../physics/math2';
import Prop from './prop';

export default class Mesh extends Prop {

  /**
   * @param  {Object}   data
   */
  constructor(data) {
    super();
    this.rotation  = data.rotation;
    this.radius    = data.radius;
    this.axialTilt = data.axialTilt;
    this.HPI = Math.PI / 2;
    
    this.renderGeometries();
  }

  /**
   * Render mesh and mesh body
   */
  renderGeometries = () => {
    this.body = this.renderBody(0x808080);
    this.object = this.renderMesh();
    this.object.add(this.body);
    // this.object.add( new THREE.AxisHelper( 500 ) );
  }

  /**
   * Render the decorated body mesh.
   * @param  {Hex} atmosphere
   * @return {Object3D}
   */
  renderBody = (atmosphere) => {
    let radius   = this.scale(this.radius);
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
    mesh.rotation.x = this.HPI;
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
        this.object[c] = s;
      });
    }
  }
}