import Constants from '../constants';

export default class {

  /**
   * Scales a number by the WEBGL_SCALE constant
   * @param  {Number} radius
   * @return {Number}
   */
  scale = (radius) => {
    return Constants.PLANET_SIZE_SCALE * radius / Constants.WEBGL_SCALE;
  }

  /**
   * Returns instance of main Object3D.
   * @return {Object3D}
   */
  getObject = () => {
    return this.object;
  }
}