import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import {ModalContainer} from '../ModalContainer';
import OrbitalService from '../../services/OrbitalService';
import Physics from '../../services/Physics';
import orbitalData from './__fixtures__/orbitals.json';

describe('Modal Container', () => {
  let component, modalContainer;

  beforeEach(() => {
    component = shallow(
      <ModalContainer
        orbitalData={orbitalData}
        targetName="dummyPlanet"
      />
    );
    modalContainer = component.instance();
  });

  describe('componentWillReceiveProps()', () => {
    beforeEach(() => {
      OrbitalService.getTargetByName = () => orbitalData[0];
    });

    it('should call updateTargetParams if the targetName has changed', () => {
      const spy = jest.spyOn(modalContainer, 'updateTargetParams');
      const targetName = 'Mars';
      const nextProps = {targetName};

      modalContainer.props = {targetName: 'Earth'};
      modalContainer.componentWillReceiveProps(nextProps);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(targetName);
    });

    it('should not call updateTargetParams if the targetName remains the same', () => {
      const spy = jest.spyOn(modalContainer, 'updateTargetParams');
      const targetName = 'Earth';
      const nextProps = {targetName};

      modalContainer.props = {targetName};
      modalContainer.componentWillReceiveProps(nextProps);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('updateTargetParams()', () => {
    it('should update the state with the current target\'s params', () => {
      const data = orbitalData[0];

      OrbitalService.getTargetByName = () => data;
      modalContainer.updateTargetParams();

      expect(component.state('name')).toEqual(data.name);
      expect(component.state('description')).toEqual(data.description);
      expect(component.state('GM')).toEqual(data.GM);
      expect(component.state('semimajor')).toEqual(data.semimajor);
    });
  });

  describe('updateOrbitalStats()', () => {
    it('should update the component state with the velocity and magnitude', () => {
      const magnitude = 5;
      const velocity = 4;

      OrbitalService.getDistanceToSun = () => magnitude;
      Physics.orbitalEnergyConservation = () => velocity;
      modalContainer.updateOrbitalStats();

      expect(component.state('magnitude')).toEqual(magnitude);
      expect(component.state('velocity')).toEqual(velocity);
    });
  });

  describe('closeModal()', () => {
    beforeEach(() => {
      modalContainer.props = {
        action: {
          toggleModal: jest.fn(),
          setUIControls: jest.fn()
        }
      };
    });

    it('should call toggleModal action with false', () => {
      const spy = jest.spyOn(modalContainer.props.action, 'toggleModal');

      modalContainer.closeModal();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(false);
    });

    it('should call setUIControls action with false', () => {
      const spy = jest.spyOn(modalContainer.props.action, 'setUIControls');

      modalContainer.closeModal();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(true);
    });
  });

  describe('onAnimationFrame()', () => {
    it('should call updateOrbitalStats with the current targetName', () => {
      const targetName = 'Earth';
      modalContainer.state = {targetName};
      const spy = jest.spyOn(modalContainer, 'updateOrbitalStats');

      modalContainer.onAnimationFrame();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(targetName);
    });
  });

  describe('render()', () => {
    it('should render the app successfully', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
