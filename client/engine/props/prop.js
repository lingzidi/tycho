import Constants from '../global/constants';

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
   * Returns instance of main Object3D.
   * @return {Object3D}
   */
  getObject = () => {
    return this.object;
  }
}