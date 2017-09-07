import * as THREE from 'three';
import Constants from '../constants';
import Physics from '../services/Physics';
import Math2 from '../services/Math2';
import Scale from '../utils/Scale';

export default class Ellipse {

  /**
   * Renders the ellipse prop.
   *
   * @returns {Object3D} ellipse
   */
  render = () => {
    this.ellipse = this.getEllipseCurve();
    this.path = this.getPath();
    this.geometry = this.getGeometry();
    this.path.add(this.ellipse);
  }

  /**
   * Returns instance of geometry from instance of ellipse points.
   *
   * @returns {THREE.Geometry} geometry
   */
  getGeometry = () => {
    return this.path.createPointsGeometry(
      Constants.ELLIPSE_CURVE_POINTS
    );
  }

  /**
   * Returns instance of path from instance of ellipse points.
   *
   * @returns {THREE.Path} path
   */
  getPath = () => {
    return new THREE.Path(
      this.ellipse.getPoints(Constants.ELLIPSE_CURVE_POINTS)
    );
  }

  /**
   * Instance of Ellipse curve.
   *
   * @returns {EllipseCurve}
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
   * Returns the current vector position of the mesh.
   * All parameter times must be in UNIX time.
   *
   * @param {Number} time - current timestamp 
   * @param {Object} periapses - {lastPeriapsis: Number, nextPeriapsis: Number}
   * @returns {Vector3} current position
   */
  getPosition = (time, periapses) => {
    const percent = Physics.ellipticPercent(
      this.eccentricity, time, periapses
    );
    const vector2d = this.path.getPoint(percent);

    return new THREE.Vector3(vector2d.x, vector2d.y);
  }

  /**
   * Updates the ellipse path semimajor and semiminor scales.
   *
   * @note Triggers render.
   * @param {Object} props - orbital data
   * @param {Number} props.semimajor - semimajor axis, in km
   * @param {Number} props.semiminor - semiminor axis, in km
   * @param {Number} props.eccentricity - orbital path eccentricity
   * @param {Number} props.scale - scaling factor
   */
  scale = ({semimajor, semiminor, eccentricity, scale}) => {
    this.semimajor = Scale(semimajor, scale);
    this.semiminor = Scale(semiminor, scale);
    this.eccentricity = eccentricity;
    this.render();
  }
}
