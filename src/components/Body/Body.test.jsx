import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import {Euler, Object3D} from 'three';
import Body from './';
import Rings from '../Orbital/Rings';

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

  it('should set the parent group rotation to props.rotation', () => {
    const mesh = component.find('group');
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

  it('should render the rings if the rings prop is defined', () => {
    component = shallow(<Body
      radius={radius}
      rotation={rotation}
      rings={{
        outerRadius: 1234,
        maps: []
      }}
    />);

    expect(component.find(Rings).exists()).toBe(true);
  });

  it('should render the body successfully', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
