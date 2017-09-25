import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import SplashScreen from './SplashScreen';

describe('SplashScreen Component', () => {
  describe('render()', () => {
    it('should render the Splash Screen successfully', () => {
      const component = shallow(<SplashScreen />);
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
