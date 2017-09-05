import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import App from '../App';
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

  describe('onAnimate()', () => {
    it('should set state time to the clock\'s current time', () => {
      const spy = jest.spyOn(app.clock, 'getTime');

      app.onAnimate();

      expect(typeof app.state.time).toBe('number');
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
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
