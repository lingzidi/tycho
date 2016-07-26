import THREE from 'three';
import Constants from '../constants';
import Math2 from '../physics/math2';
import Prop from './prop';

export default class Mesh extends Prop {

  /**
   * @param  {Object}   data
   * @param  {Scene}    scene
   * @param  {Object3D} plane
   */
  constructor(data, scene, plane) {
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
   * Update the position of the mesh acording to time
   * @param  {Number}  time
   * @param  {Vector}  pos new position
   */
  updatePosition = (time, pos) => {
    Object
      .keys(pos)
      .forEach((c) => {
        this.object.position[c] = pos[c];
      });
  }

  /**
   * Rotate mesh to the given time by its rotational constant
   * @param  {Number} time rotational constant
   */
  rotate = (time) => {
    this.body.rotation.y = Math2.arcSecToRad(time, this.rotation);
  };

  /**
   * Scales a number by the WEBGL_SCALE constant
   * @param  {Number} radius
   * @return {Number}
   */
  scale = (radius) => {
    return Constants.PLANET_SIZE_SCALE * radius / Constants.WEBGL_SCALE;
  }
  
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