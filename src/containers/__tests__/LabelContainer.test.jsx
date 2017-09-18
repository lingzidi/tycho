import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import {LabelContainer} from '../LabelContainer';

describe('Label Container', () => {
  let component, labelContainer;

  beforeEach(() => {
    component = shallow(<LabelContainer
      text="foo"
      positions={{}}
      id="testPlanet"
    />);

    labelContainer = component.instance();
  });

  describe('setActiveOrbital()', () => {
    it('should call the setActiveOrbital action with the id', () => {
      const setActiveOrbital = jest.fn();
      const id = 'testPlanet';

      labelContainer.props = {
        action: {setActiveOrbital},
        id
      };
      const spy = jest.spyOn(labelContainer.props.action, 'setActiveOrbital');

      labelContainer.setActiveOrbital();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(id);
    });
  });

  describe('setHighlightedOrbital()', () => {
    it('should call the setActiveOrbital action with the id', () => {
      const setHighlightedOrbital = jest.fn();
      const id = 'testPlanet';

      labelContainer.props = {
        action: {setHighlightedOrbital},
        id
      };
      const spy = jest.spyOn(labelContainer.props.action, 'setHighlightedOrbital');

      labelContainer.setHighlightedOrbital();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(id);
    });
  });

  describe('isActive()', () => {
    describe('when UI controls are enabled', () => {
      it('should return true if the targetName is the current id and zoom is <= 25%', () => {
        labelContainer.props = {
          targetName: 'Earth',
          id: 'Earth',
          zoom: 24,
          controlsEnabled: true
        };
        expect(labelContainer.isActive()).toEqual(true);
      });

      it('should return false if the targetName is the current id but zoom is > 25%', () => {
        labelContainer.props = {
          targetName: 'Earth',
          id: 'Earth',
          zoom: 26,
          controlsEnabled: true
        };
        expect(labelContainer.isActive()).toEqual(false);
      });

      it('should return false if the targetName is the current id but zoom is > 25%', () => {
        labelContainer.props = {
          targetName: 'Earth',
          id: 'Mars',
          zoom: 23,
          controlsEnabled: true
        };
        expect(labelContainer.isActive()).toEqual(false);
      });
    });

    describe('when UI controls are disabled', () => {
      it('should return false', () => {
        labelContainer.props = {controlsEnabled: false};
        expect(labelContainer.isActive()).toEqual(false);
      });
    });
  });

  describe('render()', () => {
    it('should render the Label successfully', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
