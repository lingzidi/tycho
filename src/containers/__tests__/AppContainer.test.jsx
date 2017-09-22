import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import {AppContainer} from '../AppContainer';
import Clock from '../../utils/Clock';

describe('App Container', () => {
  let component, appContainer;

  beforeEach(() => {
    component = shallow(<AppContainer />);
    appContainer = component.instance();
  });

  describe('componentWillReceiveProps()', () => {
    it('should update the clock offset with the next timeOffset prop value', () => {
      const spy = jest.spyOn(appContainer.clock, 'setOffset');
      const timeOffset = 123;
      const nextProps = {timeOffset};

      appContainer.componentWillReceiveProps(nextProps);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(timeOffset);
    });

    it('should not update the clock offset if the clock is paused', () => {
      const spy = jest.spyOn(appContainer.clock, 'setOffset');
      const timeOffset = 123;
      const nextProps = {timeOffset};

      appContainer.clock.paused = true;
      appContainer.componentWillReceiveProps(nextProps);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('onAnimate()', () => {
    it('should set state time to the clock\'s current time', () => {
      const spy = jest.spyOn(appContainer.clock, 'getTime');

      appContainer.onAnimate();

      expect(typeof appContainer.state.time).toBe('number');
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should update the clock speed', () => {
      const speed = 2;
      const spy = jest.spyOn(appContainer.clock, 'speed');

      appContainer.props = {speed};
      appContainer.onAnimate();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('render()', () => {
    it('should render the app successfully', () => {
      component.setState({time: 1});
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
