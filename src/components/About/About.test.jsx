import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import About from './About';

describe('About Box Component', () => {
  let component;

  beforeEach(() => {
    component = shallow(<About text="Hello, world!" />);
  });

  it('should render the about box successfully', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});