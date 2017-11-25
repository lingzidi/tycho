import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import {StatsContainer} from '../StatsContainer';
import OrbitalService from '../../services/OrbitalService';
import Physics from '../../services/Physics';
import orbitalData from './__fixtures__/orbitals.json';

describe('Modal Container', () => {
  let component, statsContainer;

  beforeEach(() => {
    component = shallow(
      <StatsContainer
        orbitalData={orbitalData}
        targetId="dummyPlanet"
      />
    );
    statsContainer = component.instance();
  });

  describe('componentWillReceiveProps()', () => {
    beforeEach(() => {
      OrbitalService.getTargetByName = () => orbitalData[0];
    });

    it('should call updateTargetParams if the targetId has changed', () => {
      const spy = jest.spyOn(statsContainer, 'updateTargetParams');
      const targetId = 'Mars';
      const nextProps = {targetId};

      statsContainer.props = {targetId: 'Earth'};
      statsContainer.componentWillReceiveProps(nextProps);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(targetId);
    });

    it('should not call updateTargetParams if the targetId remains the same', () => {
      const spy = jest.spyOn(statsContainer, 'updateTargetParams');
      const targetId = 'Earth';
      const nextProps = {targetId};

      statsContainer.props = {targetId};
      statsContainer.componentWillReceiveProps(nextProps);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('updateTargetParams()', () => {
    it('should update the state with the current target\'s params', () => {
      const data = orbitalData[0];

      OrbitalService.getTargetByName = () => data;
      statsContainer.updateTargetParams();

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
      statsContainer.updateOrbitalStats();

      expect(component.state('magnitude')).toEqual('5.000');
      expect(component.state('velocity')).toEqual('4.000');
    });
  });

  describe('render()', () => {
    it('should render the modal successfully', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
