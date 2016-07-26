import THREE from 'three';
import OrbitalDynamics from '../physics/orbitalDynamics';
import Vector from '../physics/vector';
import Prop from './prop';

export default class Ellipse extends Prop {

  /**
   * @param  {Number} semimajor
   * @param  {Number} semiminor
   * @param  {Number} eccentricity
   */
  constructor(semimajor, semiminor, eccentricity) {
    super();
    this.semimajor = this.scale(semimajor);
    this.semiminor = this.scale(semiminor);
    this.eccentricity = eccentricity;
    this.HPI = Math.PI / 2;

    this.renderGeometries();
  }

  /**
   * Renders the ellipse prop.
   * TODO: needs cleaning
   * @return {Object3D} ellipse
   */
  renderGeometries() {
    let focus     = Vector.getFocus(this.semimajor, this.semiminor);
    let material  = this.getLineMaterial(0x808080);// TODO

    this.ellipse  = this.getEllipseCurve(focus, this.semiminor, this.semimajor);
    this.path     = new THREE.Path( this.ellipse.getPoints( 500 ) ); // TODO: constant
    this.geometry = this.path.createPointsGeometry(500); // TODO: constant
    this.object   = new THREE.Line(this.geometry, material);
    this.path.add(this.ellipse);
  }

  /**
   * 3D line material for prop.
   * @param  {Hex} atmosphereColor
   * @return {LineBasicMaterial}
   */
  getLineMaterial(atmosphereColor) {
    return new THREE.LineBasicMaterial({
      color: atmosphereColor,
      opacity: 0.4,
      transparent: true
    });
  }

  /**
   * Returns the current vector position of the mesh.
   * All times are in UNIX time.
   * @param  {Number}   time current timestamp 
   * @param  {Number}   last timestamp of last periapsis
   * @param  {Number}   next timestamp of next peripasis
   * @return {Vector}   current position
   */
  getPosition(time, last, next) {
    let E     = OrbitalDynamics.eccentricAnomaly(this.eccentricity, time, last, next);
    let theta = OrbitalDynamics.getTheta(this.eccentricity, E);
    let percent = theta / 360;

    if(percent > 1 || isNaN(percent)) {
      percent = 0;
    }
    return this.path.getPoint(percent);
  }

  /**
   * Instance of Ellipse curve.
   * @param  {Number} f focus
   * @param  {Number} a angle of...uhh....???
   * @param  {Number} i angle of inclination
   * @return {EllipseCurve}
   */
  getEllipseCurve(f, a, i) {
    return new THREE.EllipseCurve(0, f, a, i, -this.HPI, 3 * this.HPI);
  }
}