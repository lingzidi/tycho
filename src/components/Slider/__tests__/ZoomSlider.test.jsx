import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import ZoomSlider from '../ZoomSlider';

describe('Zoom Slider Component', () => {
  let component;

  beforeEach(() => {
    component = shallow(<ZoomSlider
      value={40}
      onChange={jest.fn()}
    />);
  });

  describe('render()', () => {
    it('should successfully render the slider', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
