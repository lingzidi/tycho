import Clock from '../Clock';
import moment from 'moment';
import TWEEN from 'tween.js';

describe('Clock', () => {
  describe('getOffset()', () => {
    it('should return the offset passed in', () => {
      const time = 1470323035;
      const clock = new Clock(time);
      const offset = clock.getOffset(time);

      expect(typeof offset).toBe('number');
      expect(offset).toBe(time);
    });
    
    it('should return the current unix time as offset', () => {
      // because unix time changes within seconds, record the moment
      // before the clock was initialized and ensure that the offset
      // time not greater than the pre-start time
      const start = moment().unix();
      const clock = new Clock();
      const offset = clock.getOffset();

      expect(typeof offset).toBe('number');
      expect(offset).toBeGreaterThanOrEqual(start);
    });

  });
  
  describe('getTime()', () => {
    it('should return inflated time when scale is greater than 1', () => {
      let curTime;
      jest.useFakeTimers();
      jest.runAllTimers();

      const offset = 1470323035;
      const clock = new Clock(offset);

      clock.speed(2);

      curTime = clock.getTime();
      curTime -= offset;

      expect(typeof curTime).toBe('number');
      expect(curTime).toBeGreaterThanOrEqual(0);
      expect(curTime).toBeLessThan(1000);
    });
  });

  describe('update()', () => {
    it('should update the elapsed time when 1 sec has passed', () => {
      jest.useFakeTimers();
      jest.runAllTimers();

      const clock = new Clock();
      const timeBeforeUpdate = clock.elapsedTime;

      expect(typeof timeBeforeUpdate).toBe('number');
      expect(timeBeforeUpdate).not.toBe(null);
      expect(timeBeforeUpdate).toBe(0);

      clock.update();
      
      const timeAfterUpdate = clock.elapsedTime;

      expect(typeof timeAfterUpdate).toBe('number');
      expect(timeAfterUpdate).toBeGreaterThanOrEqual(timeBeforeUpdate);
    });

    it('should not update elapsedTime if no time has passed', () => {
      const elapsedTime = 1470323035;
      let clock = new Clock();
      clock.clock.stop();
      clock.elapsedTime = elapsedTime;
      clock.getTime = () => elapsedTime;

      clock.update();

      expect(typeof clock.elapsedTime).toBe('number');
      expect(clock.elapsedTime).toEqual(elapsedTime);
    });
  });
  
  describe('speed()', () => {
    it('should set `scale` to 10^<input>', () => {
      const input = 5;
      const clock = new Clock();

      clock.speed(input);

      expect(clock.scale).toBe(Math.pow(10, input));
    });
  });

  describe('setOffset()', () => {
    it('should update the offset of Clock', () => {
      let clock = new Clock();
      
      const offset = 1470323035;
      const tweenMock = {
        to: () => tweenMock,
        onComplete: () => tweenMock,
        start: () => tweenMock,
        onUpdate: (cb) => {
          cb();
          return tweenMock
        }
      };
      clock.getTween = () => tweenMock;
      clock.offset = offset;

      const result = clock.setOffset(offset);

      expect(clock.offset).toEqual(offset);
    });
  });

  describe('getTween()', () => {
    it('should return a new instance of Tween', () => {
      const clock = new Clock();
      expect(clock.getTween()).toBeInstanceOf(TWEEN.Tween);
    });
  });
});
