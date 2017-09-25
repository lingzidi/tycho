import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import {UIControlsContainer} from '../UIControlsContainer';

describe('UIControls Container', () => {
  let component, container;

  beforeEach(() => {
    component = shallow(<UIControlsContainer
      action={{
        changeSpeed: jest.fn()
      }}
    />);
    container = component.instance();
  });

  describe('getClassModifier()', () => {
    it('should return \'enabled\' if global `controlsEnabled` state is true', () => {
      container.props = {controlsEnabled: true};
      expect(container.getClassModifier()).toEqual('enabled');
    });

    it('should return \'disabled\' if global `controlsEnabled` state is false', () => {
      container.props = {controlsEnabled: false};
      expect(container.getClassModifier()).toEqual('disabled');
    });
  });

  describe('openModal()', () => {
    beforeEach(() => {
      container.props = {
        action: {
          toggleModal: jest.fn(),
          setUIControls: jest.fn()
        }
      };
    });

    it('should open the modal', () => {
      const spy = jest.spyOn(container.props.action, 'toggleModal');

      container.openModal();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(true);
    });

    it('should hide the UI Controls', () => {
      const spy = jest.spyOn(container.props.action, 'setUIControls');

      container.openModal();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(false);
    });
  });

  describe('render()', () => {
    it('should successfully render the ui controls container', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
