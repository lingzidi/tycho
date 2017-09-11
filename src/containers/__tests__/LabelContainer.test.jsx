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

  describe('getPosition()', () => {
    it('should return a style object with top, left, and position definitions', () => {
      const pos = {top: 4, left: 10};
      const style = labelContainer.getPosition(pos);

      expect(typeof style).toBe('object');
      expect(style).toHaveProperty('position');
      expect(style).toHaveProperty('top');
      expect(style).toHaveProperty('left');
      expect(style.position).toEqual('absolute');
      expect(style.top).toEqual(`${pos.top}px`);
      expect(style.left).toEqual(`${pos.left}px`);
    });

    it('should return null if the position parameter is not defined', () => {
      const style = labelContainer.getPosition();

      expect(style).toBeDefined();
      expect(style).toBeNull();
    });
  });

  describe('getChildren()', () => {
    const children = [];
    
    it('should return `children` when active', () => {
      const result = labelContainer.getChildren(children, true);
      expect(result).toEqual(children);
    });

    it('should return null when not active', () => {
      const result = labelContainer.getChildren(children);
      expect(result).toEqual(null);
    });
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

  describe('render()', () => {
    it('should render the Label successfully', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
