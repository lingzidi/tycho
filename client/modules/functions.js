import Constants from '../constants';

class Functions {

  /**
   * Scales a number by the WEBGL_SCALE constant
   * @param  {Number} radius
   * @return {Number}
   */
  static scale(radius) {
    return Constants.PLANET_SIZE_SCALE * radius / Constants.WEBGL_SCALE;
  }
}