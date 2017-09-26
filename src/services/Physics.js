export default class Physics {

  static MAX_ECCENTRICITY = 0.8

  static KM_TO_AU = 6.68459e-9;

  /**
   * Calclates the mean anomaly in degrees.
   * Mean anomaly is the angular distance from 
   * the focus of an orbit to the present position.
   *
   * @param {Number} time - time passed, in seconds
   * @param {Number} period - period of rotation
   * @returns {Number} calculated mean anomaly
   */
  static meanAnomaly(t, P) {
    return t / P % 1 * 360;
  }

  /**
   * Calculates the eccentric anomaly.
   * Eccentric anomaly is the angular distance from 
   * the focus of an orbit to the present position.
   *
   * @param {Number} ecc - eccentricity of ellipse
   * @param {Number} time - present time, in seconds
   * @param {Number} periapses - periapses of revolution
   * @returns {Number} calculated eccentric anomaly
   */
  static eccentricAnomaly(ecc, time, periapses) {
    const timePassed = (time - periapses.last);
    const period = (periapses.next - periapses.last);

    let meanAnomaly = this.meanAnomaly(timePassed, period) / 360;
    let E, F;
    
    meanAnomaly = 2 * Math.PI * (meanAnomaly - Math.floor(meanAnomaly));
    E = ecc < this.MAX_ECCENTRICITY ? meanAnomaly : Math.PI;
    F = E - ecc * Math.sin(meanAnomaly) - meanAnomaly;
    
    // numerical approximation for Kepler's second law
    for(let i = 0; i < 10; i++) {
      E = E - F / (1 - ecc * Math.cos(E));
      F = E - ecc * Math.sin(E) - meanAnomaly;
    }
    return E;
  }
  
  /**
   * Returns the projected orbital angle from eccentricity and eccentric anomaly.
   *
   * @param {Number} ecc - eccentricity
   * @param {Number} E - eccentric anomaly, in degrees
   * @returns {Number} projected orbital angle
   */
  static getTheta(ecc, E) {
    const halfPi = Math.PI / 180;
    const min = Math.sqrt(1 - Math.pow(ecc, 2));
    const theta = Math.atan2(
      (min * Math.sin(E)),
      (Math.cos(E) - ecc)
    ) / halfPi;
    
    if (theta < 0) {
      return 360 + theta;
    }
    return theta;
  }

  /**
   * Converts an angle theta, in degrees, to percentage.
   *
   * @param {Number} theta - angle in degrees
   * @returns {Number} percentage of ellipse completed
   */
  static thetaToPercent(theta) {
    const percent = theta / 360;

    if(percent > 1 || isNaN(percent)) {
      return 0;
    }
    return percent;
  }

  /**
   * Returns present percentage of ellipse travelled.
   *
   * @param {Number} ecc - eccentricity of ellipse
   * @param {Number} time - present time, in seconds
   * @param {Object} periapses - {next, last} period, in seconds
   * @returns {Number} percetnage of ellipse travelled
   */
  static ellipticPercent(ecc, time, periapses) {
    let E = this.eccentricAnomaly(ecc, time, periapses);
    let theta = this.getTheta(ecc, E);
    
    return this.thetaToPercent(theta);
  }
  
  /**
   * Calculates a mass' specific orbital energy constant.
   * Approximation for Tsiolkovsky's rocket equation.
   *
   * @param {Number} GM - gravitational constant
   * @param {Number} r - magnitude of vector to origin
   * @param {Number} semimajor - size of semimajor axis
   * @returns {Number} orbital energy constant
   */
  static orbitalEnergyConservation(GM, r, semimajor) {
    return Math.sqrt(
      Math.abs(
        GM * ((2 /r) - (1 / semimajor))
      )
    );
  }
  
  /**
   * Converts given kilometers to astronomical units.
   *
   * @param {Number} x - kilometers
   * @param {Number} scale = 1 - scaling factor
   * @returns {Number} result in astronomical units
   */
  static toAU(x, scale = 1) {
    return x * scale * this.KM_TO_AU;
  }
}
