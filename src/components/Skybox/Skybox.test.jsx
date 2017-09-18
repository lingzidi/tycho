import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import Skybox from './Skybox';

describe('Skybox Component', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Skybox />);
  });

  describe('render()', () => {
    it('should render the Skybox successfully', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
