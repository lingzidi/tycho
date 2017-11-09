import Clock from '../Clock';
import moment from 'moment';

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
    it('should be a number', () => {
      const clock = new Clock();

      jest.useFakeTimers();
      jest.runAllTimers();

      expect(typeof clock.getTime()).toBe('number');
    });
  });

  describe('update()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.runAllTimers();
    });

    it('should update the elapsed time when 1 sec has passed', () => {
      let clock = new Clock();

      clock.elapsedTime = 0;
      clock.clock.getElapsedTime = () => 1;

      clock.update();
      
      expect(clock).toHaveProperty('elapsedTime');
      expect(clock.elapsedTime).toEqual(1);
    });

    it('should not update elapsedTime if no time has passed', () => {
      const elapsedTime = 1470323035;
      let clock = new Clock();
      
      clock.elapsedTime = elapsedTime;
      clock.clock.getElapsedTime = () => elapsedTime;

      clock.update();

      expect(clock).toHaveProperty('elapsedTime');
      expect(clock.elapsedTime).toEqual(elapsedTime);
    });
  });
  
  describe('speed()', () => {
    it('should set `scale` to 10^<input> if changed', () => {
      const input = 5;
      const scale = 6;
      const clock = new Clock();
      const spy = jest.spyOn(clock, 'start');

      clock.scale = scale;
      clock.speed(input);

      expect(clock.scale).toBe(Math.pow(10, input));
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not change the scale if unchanged', () => {
      const input = 5;
      const clock = new Clock();
      const spy = jest.spyOn(clock, 'start');

      clock.scale = Math.pow(10, input);
      clock.speed(input);

      expect(clock.scale).toBe(Math.pow(10, input));
      expect(spy).not.toHaveBeenCalled();
    });

    it('should fallback to an exponent of 0 if param undefined', () => {
      const clock = new Clock();

      clock.speed();

      expect(clock.scale).toBeDefined();
      expect(clock.scale).toBe(1);
    });
  });

  describe('start()', () => {
    let clock;

    beforeEach(() => {
      clock = new Clock();
    });

    it('should call clock.start()', () => {
      const spy = jest.spyOn(clock.clock, 'start');

      clock.start();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should set paused = false', () => {
      clock.start();

      expect(clock).toHaveProperty('paused');
      expect(clock.paused).toEqual(false);
    });
  });

  describe('stop()', () => {
    let clock;

    beforeEach(() => {
      clock = new Clock();
    });

    it('should call clock.stop()', () => {
      const spy = jest.spyOn(clock.clock, 'stop');

      clock.stop();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should set paused = true', () => {
      clock.stop();

      expect(clock).toHaveProperty('paused');
      expect(clock.paused).toEqual(true);
    });
  });

  describe('stopTween()', () => {
    describe('when an instance of Tween is defined', () => {
      let clock;

      beforeEach(() => {
        clock = new Clock();
        clock.tween = {
          stop: jest.fn()
        };
      });

      it('should stop the Tween in progress', () => {
        const spy = jest.spyOn(clock.tween, 'stop');

        clock.stopTween();

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('should set the offset to the destination offset', () => {
        clock.destinationOffset = 1000;
        clock.stopTween();

        expect(clock.offset).toEqual(1000);
      });

      it('should start the clock', () => {
        const spy = jest.spyOn(clock.clock, 'start');

        clock.stopTween();

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('should dispose of the Tween instance', () => {
        clock.stopTween();
        
        expect(clock.tween).not.toBeDefined();
        expect(clock).not.toHaveProperty('tween');
      });
    });
  });

  describe('updateTweenOffset()', () => {
    it('should update the current offset time with current tween offset', () => {
      let clock = new Clock();

      clock.offset = 100;
      clock.tweenData = {offset: 200};
      clock.updateTweenOffset();

      expect(clock.offset).toEqual(clock.tweenData.offset);
    });
  });

  describe('setOffset()', () => {
    it('should update the offset of Clock', () => {
      let clock = new Clock();
      
      const offset = 1470323035;
      clock.offset = offset;

      jest.useFakeTimers();
      jest.runAllTimers();

      const result = clock.setOffset(offset);

      expect(clock.offset).toEqual(offset);
    });
  });
});
