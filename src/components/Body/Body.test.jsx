import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import {Euler, Object3D} from 'three';
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

  describe('componentDidMount()', () => {
    it('should add the label prop to the group', () => {
      const instance = component.instance();
      instance.refs = {
        group: { add: jest.fn() }
      };
      instance.props = {
        label: new Object3D()
      };
      instance.componentDidMount();
      const spy = jest.spyOn(instance.refs.group, 'add');

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(instance.props.label);
    });
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
