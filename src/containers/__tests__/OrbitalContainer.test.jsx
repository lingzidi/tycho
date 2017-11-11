import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import data from './__fixtures__/orbitals.json';
import {OrbitalContainer} from '../OrbitalContainer';
import OrbitalService from '../../services/OrbitalService';
import {Orbital} from '../../components/Orbital';
import Ellipse from '../../utils/Ellipse';
import Service from '../../services/OrbitalService';
import Constants from '../../constants';

jest.mock('three-dom-label', () => {
  return function() {}
});

describe('Orbital Container', () => {
  let component, orbitalContainer;

  beforeEach(() => {
    component = shallow(
      <OrbitalContainer
        {...data[0]}
        time={1}
        action={{
          setActiveOrbital: jest.fn(),
          addHighlightedOrbital: jest.fn(),
          removeHighlightedOrbital: jest.fn()
        }}
      />);

    orbitalContainer = component.instance();
  });

  afterEach(() => jest.resetAllMocks());

  describe('componentWillMount()', () => {
    beforeEach(() => {
      orbitalContainer.setBodyState = jest.fn();
      orbitalContainer.setGroupRotations = jest.fn();
      orbitalContainer.setPathOpacity = jest.fn();
    });

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
  });

  describe('componentWillMount()', () => {
    it('should unmount the label component', () => {
      orbitalContainer.label = {
        unmount: jest.fn()
      };
      const spy = jest.spyOn(orbitalContainer.label, 'unmount');

      orbitalContainer.componentWillUnmount();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('componentWillReceiveProps()', () => {
    it('should call maybeUpdateBodyState()', () => {
      const spy = jest.spyOn(orbitalContainer, 'maybeUpdateBodyState');
      const nextProps = {};

      orbitalContainer.componentWillReceiveProps(nextProps);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(nextProps);
    });
    
    it('should call maybeUpdatePathOpacity()', () => {
      const spy = jest.spyOn(orbitalContainer, 'maybeUpdatePathOpacity');
      const nextProps = {};

      orbitalContainer.componentWillReceiveProps(nextProps);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(nextProps);
    });
  });

  describe('maybeUpdateBodyState()', () => {
    it('should call setBodyState() if the time param has changed', () => {
      orbitalContainer.setBodyState = jest.fn();

      const time = 1;
      const nextProps = {time: 2};
      const spy = jest.spyOn(orbitalContainer, 'setBodyState');

      orbitalContainer.props = {time};
      orbitalContainer.maybeUpdateBodyState(nextProps);
      
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(orbitalContainer.props, orbitalContainer.ellipse);
    });

    it('should not call setBodyState() if the time param has not changed', () => {
      orbitalContainer.setBodyState = jest.fn();

      const time = 1;
      const nextProps = {time};
      const spy = jest.spyOn(orbitalContainer, 'setBodyState');

      orbitalContainer.props = {time};
      orbitalContainer.maybeUpdateBodyState(nextProps);
      
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('maybeUpdatePathOpacity()', () => {
    it('should call setPathOpacity() if the highlightedOrbitals list has changed', () => {
      orbitalContainer.setPathOpacity = jest.fn();

      const highlightedOrbitals = ['Mars'];
      const nextProps = {highlightedOrbitals: ['Earth']};
      const spy = jest.spyOn(orbitalContainer, 'setPathOpacity');

      orbitalContainer.props = {highlightedOrbitals};
      orbitalContainer.maybeUpdatePathOpacity(nextProps);
      
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(orbitalContainer.props, nextProps.highlightedOrbitals);
    });

    it('should call setPathOpacity() if the highlightedOrbitals list has not changed', () => {
      orbitalContainer.setPathOpacity = jest.fn();

      const time = 1;
      const highlightedOrbitals = ['Mars'];
      const nextProps = {highlightedOrbitals};
      const spy = jest.spyOn(orbitalContainer, 'setPathOpacity');

      orbitalContainer.props = {highlightedOrbitals};
      orbitalContainer.maybeUpdatePathOpacity(nextProps);
      
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('setPathOpacity()', () => {
    it('should set the opacity state to the calculated opacity', () => {
      const opacity = Constants.UI.HOVER_OPACITY_ON;
      OrbitalService.getPathOpacity = () => opacity;
      orbitalContainer.setPathOpacity({}, 'Earth');

      expect(orbitalContainer.state).toHaveProperty('pathOpacity');
      expect(orbitalContainer.state.pathOpacity).toEqual(opacity);
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
    beforeEach(() => {
      OrbitalService.getBodyPosition = () => ({});
    });

    it('should set the present body position, rotation, and radius', () => {
      orbitalContainer.setBodyState(orbitalContainer.props);

      expect(orbitalContainer.state).toHaveProperty('bodyPosition');
      expect(orbitalContainer.state).toHaveProperty('bodyRotation');
      expect(orbitalContainer.state).toHaveProperty('bodyRadius');
    });
  });

  describe('getLabel()', () => {
    it('should return an instance of label', () => {
      expect(typeof orbitalContainer.getLabel()).toBe('object');
    });
  });

  describe('render()', () => {
    it('should render the OrbitalContainer successfully', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});