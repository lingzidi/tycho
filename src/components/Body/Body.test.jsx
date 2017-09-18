import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import {Euler} from 'three';
import Body from './';

describe('Body Component', () => {
  let component;
  const radius = 100;
  const rotation = new Euler(1, 1, 1);

  beforeEach(() => {
    component = shallow(<Body
      radius={radius}
      rotation={rotation}
    />);
  });

  it('should set the body mesh rotation to prop.rotation', () => {
    const mesh = component.find('mesh');
    const props = mesh.props();

    expect(props).toHaveProperty('rotation');
    expect(props.rotation).toEqual(rotation);
  });

  it('should set the sphereGeometry radius to prop.radius', () => {
    const sphereGeometry = component.find('sphereGeometry');
    const props = sphereGeometry.props();

    expect(props).toHaveProperty('radius');
    expect(props.radius).toEqual(radius);
  });

  it('should render the body successfully', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
