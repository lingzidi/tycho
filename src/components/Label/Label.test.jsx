import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import Label from './Label';

describe('Label Component', () => {
  let component;

  describe('render()', () => {
    describe('when not active', () => {
      beforeEach(() => {
        component = shallow(
          <Label 
            text="foo"
            active={false}
            onClick={jest.fn()}
          />
        );
      });

      it('should render the Label with text and without children if not active', () => {
        expect(toJson(component)).toMatchSnapshot();
      });
    });

    describe('when active', () => {
      beforeEach(() => {
        component = shallow(
          <Label 
            text="foo"
            active={true}
            onClick={jest.fn()}
          />
        );
      });

      it('should render the Label without text and with children if active', () => {
        expect(toJson(component)).toMatchSnapshot();
      });
    });
  });
});
