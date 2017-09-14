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
    it('should initialize the className in state', () => {
      expect(component.state()).toHaveProperty('className');
      expect(typeof component.state('className')).toBe('string');
    });

    it('should set the start and stop className change classes', () => {
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
    it('should add the given BEM modifier to the className after the given duration', () => {
      const className = 'tour-label__text';
      const modifier = 'hide';

      component.setState({className});
      tourLabelContainer.setClassAsync(modifier, 1000);

      expect(component.state('className')).toEqual(className);

      jest.runAllTimers();

      expect(component.state('className')).toEqual(`${className} ${className}--${modifier}`);
    });
  });

  describe('render()', () => {
    it('should render the app successfully', () => {
      component.setState({time: 1});
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
