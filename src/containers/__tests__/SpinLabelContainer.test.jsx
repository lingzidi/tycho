import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import {SpinLabelContainer} from '../SpinLabelContainer';

describe('Spin Label Container', () => {
  let component, spinLabelContainer;

  beforeEach(() => {
    component = shallow(<SpinLabelContainer />);
    spinLabelContainer = component.instance();
  });

  describe('isVisible()', () => {
    it('should return true if both isAutoOrbitEnabled and isComplete props are true', () => {
      spinLabelContainer.props = {
        isAutoOrbitEnabled: true,
        isComplete: true
      };
      expect(spinLabelContainer.isVisible()).toEqual(true);
    });

    it('should return true if both isAutoOrbitEnabled is false', () => {
      spinLabelContainer.props = {
        isAutoOrbitEnabled: false,
        isComplete: true
      };
      expect(spinLabelContainer.isVisible()).toEqual(false);
    });

    it('should return true if both isComplete is false', () => {
      spinLabelContainer.props = {
        isAutoOrbitEnabled: true,
        isComplete: false
      };
      expect(spinLabelContainer.isVisible()).toEqual(false);
    });
  });

  describe('render()', () => {
    it('should render the spin label container successfully', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
