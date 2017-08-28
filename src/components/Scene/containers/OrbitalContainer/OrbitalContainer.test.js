import React from 'react';
import {shallow} from 'enzyme';
import OrbitalContainer from './OrbitalContainer';
import data from '../../../../global/fixtures';
import Ellipse from '../../../../utils/Ellipse';
import Service from '../../../../services/OrbitalService';
import Orbital from '../../components/Orbital';

describe('Orbital Container', () => {
  let component, orbitalContainer;

  beforeEach(() => {
    component = shallow(
      <OrbitalContainer {...data[0]}
        time={1}
        onUpdate={() => {}}
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

  describe('updateScreenPositions()', () => {
    it('should call the onUpdate callback prop', () => {
      const onUpdate = jest.fn();

      component = shallow(
        <OrbitalContainer {...data[0]}
          time={1}
          onUpdate={onUpdate}
        />);

      orbitalContainer = component.instance();
      const props = component.props();

      orbitalContainer.updateScreenPosition();

      expect(onUpdate).toHaveBeenCalled();
      expect(onUpdate).toHaveBeenCalledWith(null, props.id);
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
});
