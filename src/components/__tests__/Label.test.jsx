import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import Label from '../Label';

describe('Label Component', () => {
  let component, label;

  beforeEach(() => {
    component = shallow(<Label 
      text="foo"
      style={{}}
      onClick={jest.fn()}
      active={false}
    />);

    label = component.instance();
  });

  describe('render()', () => {
    it('should render the Label successfully', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
