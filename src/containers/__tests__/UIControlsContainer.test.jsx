import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import {UIControlsContainer} from '../UIControlsContainer';

describe('UIControls Container', () => {
  let component;

  beforeEach(() => {
    component = shallow(<UIControlsContainer
      action={{
        changeSpeed: jest.fn()
      }}
    />);
  });

  describe('render()', () => {
    it('should successfully render the ui controls container', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
