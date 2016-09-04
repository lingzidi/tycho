import THREE from 'three';
import OrbitalDynamics from '../physics/orbitalDynamics';
import Vector from '../physics/vector';
import Math2 from '../physics/math2';
import Scale from '../global/scale';
import Constants from '../global/constants';

export default class Ellipse extends THREE.Line {

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
    this.semimajor = Scale(data.semimajor);
    this.semiminor = Scale(data.semiminor);
    this.eccentricity    = data.eccentricity;
    this.atmosphereColor = data.atmosphereColor;
  }

  /**
   * Renders the ellipse prop.
   * @return {Object3D} ellipse
   */
  setUp = () => {
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
   * @param  {Object}   periapses
   * @return {Vector}   current position
   */
  getPosition = (time, periapses) => {
    return this.path.getPoint(
      OrbitalDynamics.ellipticPercent(
        this.eccentricity, time, periapses
      )
    );
  }
}