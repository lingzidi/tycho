import THREE from 'three';
import moment from 'moment';

export default class {

  constructor(time) {
    this.clock = new THREE.Clock();
    this.offset = this.getOffset(time);
    this.clock.start();
    this.speed(0);
    this.elapsedTime = 0;
    this.events = [];
  }

  /**
   * Get time offset.
   * @param  {Number} time UNIX timestamp
   */
  getOffset = (time) => {
    if(time) {
      return time;
    }
    return moment().unix();
  }

  /**
   * Current scaled timestamp.
   * @return {Number} UNIX timestamp
   */
  getTime = () => {
    let time = this.clock.getElapsedTime();
        time *= this.scale;
        time += this.offset;

    return Math.ceil(time);
  }

  /**
   * Updates clock time. Intended to be called from within
   * an animation loop to prepare the next frame time.
   */
  update = () => {
    let elapsedTime = Math.ceil(this.getTime());

    if(elapsedTime > this.elapsedTime) {
      this.elapsedTime = elapsedTime;
      this.nextTick();
    }
  }

  /**
   * Executes set events after each second ("tick")
   * @param  {Number} elapsedTime UNIX time
   */
  nextTick = () => {
    this.events.forEach((event) => {
      event(this.getTime());
    });
  }

  /**
   * Sets the scale of the clock, as base 10.
   * Example: a scalar of 0 means 1:1 scale (10^0=1)
   * @param {Number} e scalar exponent
   */
  speed = (e) => {
    this.scale = Math.pow(10, e);
  }

  /**
   * Set events that will fire after each second ("tick")
   */
  tick = (event) => {
    this.events.push(event);
  }
}