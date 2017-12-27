import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import {ModalContainer} from '../ModalContainer';

describe('Modal Container', () => {
  let component, modalContainer;

  beforeEach(() => {
    component = shallow(
      <ModalContainer
        type="TEST_MODAL"
        title="Test Modal"
      />
    );
    modalContainer = component.instance();
  });

  describe('componentWillMount()', () => {
    it('should add the onKeyPressed() method as a keydown event listener', () => {
      const spy = jest.spyOn(window, 'addEventListener');

      modalContainer.componentWillMount();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('keydown', modalContainer.onKeyPressed);
    });
  });

  describe('onKeyPressed()', () => {
    it('should close the modal when the esc key is pressed', () => {
      const spy = jest.spyOn(modalContainer, 'closeModal');

      modalContainer.props = {
        action: {
          toggleModal: jest.fn(),
          setUIControls: jest.fn()
        }
      };
      modalContainer.isModalActive = () => true;
      modalContainer.onKeyPressed({keyCode: 27});

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
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
      expect(spy).toHaveBeenCalledWith(null);
    });

    it('should call setUIControls action with false', () => {
      const spy = jest.spyOn(modalContainer.props.action, 'setUIControls');

      modalContainer.closeModal();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(true);
    });
  });

  describe('render()', () => {
    it('should render the app successfully', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
