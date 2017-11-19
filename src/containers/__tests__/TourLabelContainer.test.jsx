import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import TourLabelContainer from '../TourLabelContainer';

jest.useFakeTimers();

describe('App Container', () => {
  let component, tourLabelContainer;

  beforeEach(() => {
    component = shallow(<TourLabelContainer
      start={1000}
      end={3000}
      text="Hello, world"
    />);
    tourLabelContainer = component.instance();
  });

  describe('componentWillMount()', () => {
    it('should initialize the modifier in state', () => {
      expect(component.state()).toHaveProperty('modifier');
      expect(typeof component.state('modifier')).toBe('string');
    });

    it('should set the start and stop modifier change classes', () => {
      const spy = jest.spyOn(tourLabelContainer, 'setClassAsync');
      const start = 1000;
      const end = 3000;

      tourLabelContainer.props = {start, end};
      tourLabelContainer.componentWillMount();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith('show', start);
      expect(spy).toHaveBeenCalledWith('hide', end);
    });
  });

  describe('setClassAsync()', () => {
    it('should add the given BEM modifier to the modifier after the given duration', () => {
      const modifier = 'hide';

      component.setState({modifier});
      tourLabelContainer.setClassAsync(modifier, 1000);

      jest.runAllTimers();

      expect(component.state('modifier')).toEqual(modifier);
    });
  });

  describe('render()', () => {
    it('should render the app successfully', () => {
      component.setState({time: 1});
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
