import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import {DefaultLoadingManager} from 'three';
import {LoaderContainer} from '../LoaderContainer';

describe('Loader Container', () => {
  let component, loaderContainer;

  beforeEach(() => {
    component = shallow(<LoaderContainer
      action={{
        setPercentLoaded: jest.fn(),
        setTextureLoaded: jest.fn()
      }}
    />);
    loaderContainer = component.instance();
  });

  describe('componentDidMount()', () => {
    it('should assign `onProgress` to the DefaultLoadingManager', () => {
      expect(DefaultLoadingManager.onProgress).toEqual(loaderContainer.onProgress);
    });
  });

  describe('onProgress()', () => {
    const url = 'myImage.jpg';
    const count = 5;
    const total = 8;
    
    it('should call the setPercentLoaded() action', () => {
      const spy = jest.spyOn(loaderContainer.props.action, 'setPercentLoaded');

      loaderContainer.onProgress(url, count, total);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(count, total);
    });

    it('should call the setTextureLoaded() action', () => {
      const spy = jest.spyOn(loaderContainer.props.action, 'setTextureLoaded');

      loaderContainer.onProgress(url, count, total);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(url);
    });
  });

  describe('getClassName()', () => {
    const baseClass = 'loader';

    it('should return the base class name', () => {
      loaderContainer.props = {percent: 50};
      const result = loaderContainer.getClassName();

      expect(result).toEqual(baseClass);
    });

    it('should return the hidden class name if fully loaded', () => {
      loaderContainer.props = {percent: 100};
      const result = loaderContainer.getClassName();

      expect(result).toEqual(`${baseClass} ${baseClass}--hide`);
    });
  });

  describe('getPercent()', () => {
    it('should return the prop percent', () => {
      loaderContainer.props = {percent: 50};
      const result = loaderContainer.getPercent();

      expect(result).toEqual(50);
    });

    it('should fallback to 0 if prop percent is undefined', () => {
      const result = loaderContainer.getPercent();

      expect(result).toEqual(0);
    });
  });

  describe('render()', () => {
    it('should render the loader container successfully', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
