import THREE from 'three';
import OrbitalDynamics from '../physics/orbitalDynamics';
import Vector from '../physics/vector';
import Math2 from '../physics/math2';
import Prop from './prop';
import Scale from '../global/scale';
import Constants from '../global/constants';

export default class Ellipse extends THREE.Line {

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
    this.semimajor = Scale(data.semimajor);
    this.semiminor = Scale(data.semiminor);
    this.eccentricity    = data.eccentricity;
    this.atmosphereColor = data.atmosphereColor;
  }

  /**
   * Renders the ellipse prop.
   * @return {Object3D} ellipse
   */
  renderGeometries = () => {
    this.material = this.getLineMaterial();
    this.ellipse  = this.getEllipseCurve();
    this.path     = this.getPath();
    this.geometry = this.getGeometry();
    this.path.add(this.ellipse);
  }

  /**
   * Returns instance of geometry from instance of ellipse points.
   * @return {THREE.Geometry} geometry
   */
  getGeometry = () => {
    return this.path.createPointsGeometry(500); // TODO: constant
  }

  /**
   * Returns instance of path from instance of ellipse points.
   * @return {THREE.Path} path
   */
  getPath = () => {
    return new THREE.Path(
      this.ellipse.getPoints(500)// TODO: constant
    );
  }

  /**
   * 3D line material for prop.
   * @return {LineBasicMaterial}
   */
  getLineMaterial = () => {
    return new THREE.LineBasicMaterial({
      color: this.atmosphereColor,
      opacity: 0.4,
      transparent: true
    });
  }

  /**
   * Instance of Ellipse curve.
   * @return {EllipseCurve}
   */
  getEllipseCurve = () => {
    let focus = Vector.getFocus(this.semimajor, this.semiminor);

    return new THREE.EllipseCurve(0,
      focus, 
      this.semiminor,
      this.semimajor,
    -Math2.HalfPI, 3 * Math2.HalfPI);
  }


  /**
   * Returns the current vector position of the mesh.
   * All parameter times must be in UNIX time.
   * @param  {Number}   time current timestamp 
   * @param  {Number}   last timestamp of last periapsis
   * @param  {Number}   next timestamp of next peripasis
   * @return {Vector}   current position
   */
  getPosition = (time, last, next) => {
    let E     = OrbitalDynamics.eccentricAnomaly(this.eccentricity, time, last, next);

    let theta = OrbitalDynamics.getTheta(this.eccentricity, E);
    let percent = theta / 360;

    if(percent > 1 || isNaN(percent)) {
      percent = 0;
    }
    return this.path.getPoint(percent);
  }
}