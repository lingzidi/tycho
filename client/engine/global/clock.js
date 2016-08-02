import THREE from 'three';
import moment from 'moment';

export default class {

  constructor(time) {
    this.clock = new THREE.Clock(true);
    this.offset = this.getOffset(time);
    this.elapsedTime = 0;
    this.scale = 7;
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
        time *= Math.pow(10, this.scale);
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
      this.nextTick(elapsedTime);
    }
  }

  /**
   * Executes set events after each second ("tick")
   * @param  {Number} elapsedTime UNIX time
   */
  nextTick = (elapsedTime) => {
    this.events.forEach((event) => {
      event(this.getTime());
    });
  }

  /**
   * Set events that will fire after each second ("tick")
   */
  tick = (event) => {
    this.events.push(event);
  }
}