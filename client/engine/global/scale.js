import Constants from './constants';

/**
 * Scales a number by the WEBGL_SCALE constant
 * @param  {Number} radius
 * @return {Number}
 */
export default (radius) => {
  return Constants.PLANET_SIZE_SCALE * radius / Constants.WEBGL_SCALE;
}