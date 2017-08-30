import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import Label from '../Label';

describe('Label Component', () => {
  let component, label;

  beforeEach(() => {
    component = shallow(<Label 
      text="foo"
      positions={{}}
    />);

    label = component.instance();
  });

  describe('getPosition()', () => {
    it('should return a style object with top, left, and position definitions', () => {
      const pos = {top: 4, left: 10};
      const style = label.getPosition(pos);

      expect(typeof style).toBe('object');
      expect(style).toHaveProperty('position');
      expect(style).toHaveProperty('top');
      expect(style).toHaveProperty('left');
      expect(style.position).toEqual('absolute');
      expect(style.top).toEqual(`${pos.top}px`);
      expect(style.left).toEqual(`${pos.left}px`);
    });

    it('should return null if the position parameter is not defined', () => {
      const style = label.getPosition();

      expect(style).toBeDefined();
      expect(style).toBeNull();
    });
  });

  describe('render()', () => {
    it('should render the Label successfully', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
