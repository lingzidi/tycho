import * as THREE from 'three';
import Constants from '../../constants';
import Physics from '../../services/Physics';
import Math2 from '../../services/Math2';
import Scale from '../../utils/Scale';

export default class Ellipse {

  /**
   * @param {Object} data
   */
  constructor(data) {
    this.setData(data);
    this.render();
  }

  /**
   * Set global data, with appropriate scales.
   * @param  {Object} data
   */
  setData = ({semimajor, semiminor, eccentricity}) => {
    this.semimajor = Scale(semimajor);
    this.semiminor = Scale(semiminor);
    this.eccentricity = eccentricity;
  }

  /**
   * Renders the ellipse prop.
   * @return {Object3D} ellipse
   */
  render = () => {
    this.ellipse = this.getEllipseCurve();
    this.path = this.getPath();
    this.geometry = this.getGeometry();
    this.path.add(this.ellipse);
  }

  /**
   * Returns instance of geometry from instance of ellipse points.
   * @return {THREE.Geometry} geometry
   */
  getGeometry = () => {
    return this.path.createPointsGeometry(
      Constants.ELLIPSE_CURVE_POINTS
    );
  }

  /**
   * Returns instance of path from instance of ellipse points.
   * @return {THREE.Path} path
   */
  getPath = () => {
    return new THREE.Path(
      this.ellipse.getPoints(Constants.ELLIPSE_CURVE_POINTS)
    );
  }

  /**
   * Instance of Ellipse curve.
   * @return {EllipseCurve}
   */
  getEllipseCurve = () => {
    const focus = Math2.getFocus(this.semimajor, this.semiminor);

    return new THREE.EllipseCurve(0,
      focus, 
      this.semiminor,
      this.semimajor,
    -Math2.HalfPI, 3 * Math2.HalfPI);
  }

  /**
   * TODO: rename to get3DPosition
   * Returns the current vector position of the mesh.
   * All parameter times must be in UNIX time.
   * @param  {Number}  time current timestamp 
   * @param  {Object}  {lastPeriapsis: Number, nextPeriapsis: Number}
   * @return {Vector3} current position
   */
  getPosition = (time, periapses) => {
    const percent = Physics.ellipticPercent(
      this.eccentricity, time, periapses
    );
    const vector2d = this.path.getPoint(percent);

    return new THREE.Vector3(vector2d.x, vector2d.y);
  }
}
