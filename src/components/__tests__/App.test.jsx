import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import {App} from '../App';
import Clock from '../../utils/Clock';

describe('App Component', () => {
  let component, app;

  beforeEach(() => {
    component = shallow(<App />);
    app = component.instance();
  });

  describe('componentWillMount()', () => {

    beforeEach(() => app.componentWillMount());

    it('should set clock to a new instance of Clock', () => {
      expect(app).toHaveProperty('clock');
      expect(app.clock).toBeInstanceOf(Clock);
    });

    it('should initialize state to have positions and time properties', () => {
      expect(app).toHaveProperty('state');
      expect(typeof app.state).toBe('object');
      expect(typeof app.state.positions).toBe('object');
      expect(typeof app.state.time).toBe('number');
    });
  });

  describe('componentWillReceiveProps()', () => {
    it('should update the clock offset with the next timeOffset prop value', () => {
      const spy = jest.spyOn(app.clock, 'setOffset');
      const timeOffset = 123;
      const nextProps = {timeOffset};

      app.componentWillReceiveProps(nextProps);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(timeOffset);
    });

    it('should not update the clock offset if the clock is paused', () => {
      const spy = jest.spyOn(app.clock, 'setOffset');
      const timeOffset = 123;
      const nextProps = {timeOffset};

      app.clock.paused = true;
      app.componentWillReceiveProps(nextProps);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('onAnimate()', () => {
    it('should set state time to the clock\'s current time', () => {
      const spy = jest.spyOn(app.clock, 'getTime');

      app.onAnimate();

      expect(typeof app.state.time).toBe('number');
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    xit('should update the clock speed', () => {
      const speed = 2;
      const spy = jest.spyOn(app.clock, 'speed');

      app.props = {speed};
      app.onAnimate();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(speed);
    });
  });

  describe('updateScreenPosition()', () => {
    it('should assign the given object position to the state positions property', () => {
      const position = {x: 1, y: 1};
      const id = 'sampleId';

      app.updateScreenPosition(position, id);

      expect(app.state.positions).toHaveProperty(id);
      expect(app.state.positions[id]).toEqual(position);
    });
  });

  describe('render()', () => {
    it('should render the app successfully', () => {
      component.setState({time: 1});
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
