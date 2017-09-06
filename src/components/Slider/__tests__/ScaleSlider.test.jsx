import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import ScaleSlider from '../ScaleSlider';

describe('Scale Slider Component', () => {
  let component;

  beforeEach(() => {
    component = shallow(<ScaleSlider
      value={40}
      label="Test Slider"
      onChange={jest.fn()}
    />);
  });

  describe('render()', () => {
    it('should successfully render the slider', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
