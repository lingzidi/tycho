import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import data from './__fixtures__/orbitals.json';
import {OrbitalContainer} from '../OrbitalContainer';
import {Orbital} from '../../components/Orbital';
import Ellipse from '../../utils/Ellipse';
import Service from '../../services/OrbitalService';

describe('Orbital Container', () => {
  let component, orbitalContainer;

  beforeEach(() => {
    component = shallow(
      <OrbitalContainer {...data[0]}
        time={1}
        updatePosition={() => {}}
      />);

    orbitalContainer = component.instance();
  });

  afterEach(() => jest.resetAllMocks());

  describe('componentWillMount()', () => {
    it('should initialize a new instance of Ellipse', () => {
      orbitalContainer.componentWillMount();
      
      expect(orbitalContainer).toHaveProperty('ellipse');
      expect(orbitalContainer.ellipse).toBeInstanceOf(Ellipse);
    });
    
    it('should initialize group rotations', () => {
      const spy = jest.spyOn(orbitalContainer, 'setGroupRotations');

      orbitalContainer.componentWillMount();
      
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(orbitalContainer.props);
    });

    it('should update the present body position and rotation', () => {
      const spy = jest.spyOn(orbitalContainer, 'setBodyState');

      orbitalContainer.componentWillMount();
      
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(orbitalContainer.props, orbitalContainer.ellipse);
    });
  });

  describe('setPathOpacity()', () => {
    it('should set the pathOpacity to 1 in local state when active = true', () => {
      orbitalContainer.setPathOpacity(true);

      expect(orbitalContainer.state).toHaveProperty('pathOpacity');
      expect(orbitalContainer.state.pathOpacity).toEqual(1);
    });

    it('should set the pathOpacity to 0.2 in local state when active = false', () => {
      orbitalContainer.setPathOpacity(false);

      expect(orbitalContainer.state).toHaveProperty('pathOpacity');
      expect(orbitalContainer.state.pathOpacity).toEqual(0.2);
    });
  });

  describe('setGroupRotations()', () => {
    it('should set the ecliptic and orbital group rotations', () => {
      orbitalContainer.setGroupRotations(orbitalContainer.props);

      expect(orbitalContainer.state).toHaveProperty('eclipticGroupRotation');
      expect(orbitalContainer.state).toHaveProperty('orbitalGroupRotation');
    });
  });

  describe('setBodyState()', () => {
    it('should set the present body position, rotation, and radius', () => {
      orbitalContainer.setGroupRotations(orbitalContainer.props);

      expect(orbitalContainer.state).toHaveProperty('bodyPosition');
      expect(orbitalContainer.state).toHaveProperty('bodyRotation');
      expect(orbitalContainer.state).toHaveProperty('bodyRadius');
    });
  });

  describe('updatePosition()', () => {
    it('should call the onUpdate callback prop', () => {
      const updatePosition = jest.fn();

      component = shallow(
        <OrbitalContainer {...data[0]}
          time={1}
          updatePosition={updatePosition}
        />);

      orbitalContainer = component.instance();
      const props = component.props();

      orbitalContainer.updatePosition();

      expect(updatePosition).toHaveBeenCalled();
      expect(updatePosition).toHaveBeenCalledWith({
        position2d: null,
        position3d: null
      }, props.id);
    });
  });

  describe('onAnimationFrame()', () => {
    it('should update the present body position and rotation', () => {
      const spy = jest.spyOn(orbitalContainer, 'setBodyState');

      orbitalContainer.componentWillMount();
      
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(orbitalContainer.props, orbitalContainer.ellipse);
    });
  });

  describe('render()', () => {
    it('should render the OrbitalContainer successfully', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
