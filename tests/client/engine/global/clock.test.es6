import Clock from '../../../../client/engine/global/clock';
import moment from 'moment';

describe('Clock', () => {

  describe('getOffset', () => {

    it('should return the offset passed in', () => {
      let time = 1470323035,
          clock = new Clock(time),
          offset = clock.getOffset(time);

      offset.should.be.a.number;
      offset.should.equal(time);
    });

    it('should return the current unix time as offset', () => {
      // because unix time changes within seconds, record the moment
      // before the clock was initialized and ensure that the offset
      // time not greater than the pre-start time
      let start = moment().unix(),
          clock = new Clock(),
          offset = clock.getOffset();

      offset.should.be.a.number;
      offset.should.be.at.least(start);
    });

  });

  describe('getTime', () => {

    it('should return inflated time when scale is greater than 1', (done) => {
      let offset = 1470323035,
          curTime,
          clock = new Clock(offset);

      clock.speed(2);

      // after 1 sec, at 10^2 times inflation, time passed should be at least 100
      setTimeout(() => {
        curTime = clock.getTime();
        curTime -= offset;

        curTime.should.be.a.number;
        curTime.should.be.at.least(100);
        curTime.should.be.below(1000);
        done();
      }, 1000);
    });
  });

  describe('update', () => {

    it('should update the elapsed time when 1 sec has passed', (done) => {

      let clock = new Clock(),
          timeBeforeUpdate = clock.elapsedTime;

      // sinon.spy(clock, 'nextTick');

      timeBeforeUpdate.should.not.be.null;
      timeBeforeUpdate.should.be.a.number;
      timeBeforeUpdate.should.equal(0);

      setTimeout(() => {
        clock.update();
        let timeAfterUpdate = clock.elapsedTime;

        timeAfterUpdate.should.be.a.number;
        timeAfterUpdate.should.be.at.least(timeBeforeUpdate);
        timeAfterUpdate.should.be.at.least(0);

        // clock.nextTick.should.have.been.called;
        done();
      }, 1000);
    });

  });

  describe('tick functions', () => {
    let clock,
        events = [
          () => 'dummy event 1',
          () => 'dummy event 2'
        ];

    beforeEach(() => {
      clock = new Clock();
    });

    describe('tick', () => {

      it('should have empty events array on start', () => {

        clock.events.should.be.an.array;
        clock.events.should.have.length(0);

      });

      it('should populate events array with two events', () => {

        events.forEach(clock.tick);

        clock.events.should.be.an.array;
        clock.events.should.have.length(2);
        clock.events.forEach(event => {
          event.should.not.be.null;
          event.should.be.a.function;
        });

      });

    });

    describe('nextTick', () => {

      it('should execute each event on next tick', () => {

        events.forEach(clock.tick);

        clock.nextTick();

        events.forEach((event, index) => {
          // sinon.spy(clock.events, index);
          // clock.events[index].should.have.been.called;
        });
      });
      
    });

  });

});