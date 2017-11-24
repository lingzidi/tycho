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
        targetId="dummyPlanet"
      />
    );
    modalContainer = component.instance();
  });

  describe('componentWillReceiveProps()', () => {
    beforeEach(() => {
      OrbitalService.getTargetByName = () => orbitalData[0];
    });

    it('should call updateTargetParams if the targetId has changed', () => {
      const spy = jest.spyOn(modalContainer, 'updateTargetParams');
      const targetId = 'Mars';
      const nextProps = {targetId};

      modalContainer.props = {targetId: 'Earth'};
      modalContainer.componentWillReceiveProps(nextProps);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(targetId);
    });

    it('should not call updateTargetParams if the targetId remains the same', () => {
      const spy = jest.spyOn(modalContainer, 'updateTargetParams');
      const targetId = 'Earth';
      const nextProps = {targetId};

      modalContainer.props = {targetId};
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
      OrbitalService.getDistanceToSun = () => 5;
      Physics.orbitalEnergyConservation = () => 4;
      modalContainer.updateOrbitalStats();

      expect(component.state('magnitude')).toEqual('5.000');
      expect(component.state('velocity')).toEqual('4.000');
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
    it('should call updateOrbitalStats with the current targetId', () => {
      const spy = jest.spyOn(modalContainer, 'updateOrbitalStats');

      modalContainer.onAnimationFrame();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('render()', () => {
    it('should render the app successfully', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
