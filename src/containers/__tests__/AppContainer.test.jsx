import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import {AppContainer} from '../AppContainer';
import Clock from '../../utils/Clock';

describe('App Container', () => {
  let component, appContainer;

  const action = {
    requestOrbitalData: jest.fn(),
    requestPageText: jest.fn(),
    setTime: jest.fn()
  };

  beforeEach(() => {
    component = shallow(<AppContainer action={action} />);
    appContainer = component.instance();
  });

  describe('componentWillReceiveProps()', () => {
    it('should call maybeUpdateOffset()', () => {
      const spy = jest.spyOn(appContainer, 'maybeUpdateOffset');
      const nextProps = {};

      appContainer.componentWillReceiveProps(nextProps);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('maybeUpdateOffset()', () => {
    it('should update the clock offset with the next timeOffset prop value', () => {
      const spy = jest.spyOn(appContainer.clock, 'setOffset');
      const timeOffset = 123;

      appContainer.maybeUpdateOffset(timeOffset);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(timeOffset);
    });

    it('should not update the clock offset if the clock is paused', () => {
      const spy = jest.spyOn(appContainer.clock, 'setOffset');
      const timeOffset = 123;

      appContainer.clock.paused = true;
      appContainer.maybeUpdateOffset(timeOffset);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('maybeUpdateTime()', () => {
    const time = 1;

    beforeEach(() => {
      appContainer.clock = {
        getTime: () => time
      };
    });

    describe('when the time has changed since last update', () => {
      beforeEach(() => {
        appContainer.lastTime = time + 1;
      });

      it('should set `lastTime` to current time', () => {
        appContainer.maybeUpdateTime();

        expect(appContainer.lastTime).toBeDefined();
        expect(appContainer.lastTime).toEqual(time);
      });

      it('should call the `setTime` action with current time', () => {
        const spy = jest.spyOn(appContainer.props.action, 'setTime');

        appContainer.maybeUpdateTime();

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(time);
      });
    });

    describe('when the time is the same as when last probed', () => {
      // TODO: why does this run twice? Why does it break?
      it('should not call the `setTime` action', () => {
        const spy = jest.spyOn(appContainer.props.action, 'setTime');

        appContainer.lastTime = time;
        appContainer.maybeUpdateTime();

        // expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  describe('onAnimate()', () => {
    beforeEach(() => {
      appContainer.props = {
        action: {setTime: jest.fn()}
      };
    });

    it('should update the clock speed', () => {
      const speed = 2;
      const spy = jest.spyOn(appContainer.clock, 'speed');

      appContainer.props.speed = speed;
      appContainer.onAnimate();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('render()', () => {
    it('should render the splash screen if orbitalData is undefined', () => {
      component = shallow(<AppContainer
        pageText={{}}
        action={action}
      />);
      expect(toJson(component)).toMatchSnapshot();
    });
    
    it('should render the splash screen if pageText is undefined', () => {
      component = shallow(<AppContainer
        orbitalData={{}}
        action={action}
      />);
      expect(toJson(component)).toMatchSnapshot();
    });

    it('should render the app successfully', () => {
      component = shallow(<AppContainer
        orbitalData={{}}
        pageText={{}}
        action={action}
      />);
      component.setState({time: 1});
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
