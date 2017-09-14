import React from 'react';
import React3 from 'react-three-renderer';
import renderer from 'react-test-renderer';
import ReactDOM from 'react-dom';
import TWEEN from 'tween.js';
import {Vector3, Camera} from 'three';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import CameraContainer from '../CameraContainer';
import Controls from '../../utils/Controls';
import data from '../../global/fixtures';
import SceneService from '../../services/SceneService';

jest.mock('../../services/SceneService');

describe('Camera Container', () => {
  let component, cameraContainer;

  beforeEach(() => {
    component = shallow(
      <CameraContainer 
        cameraRef={jest.fn()}
        positions={{}}
        targetName="testPlanet"
        zoomIn={jest.fn()}
        controls={{}}
      />
    );
    cameraContainer = component.instance();
  });

  describe('componentDidMount()', () => {
    it('should pass the camera reference to the cameraRef prop callback', () => {
      cameraContainer.props = {cameraRef: jest.fn()};
      const spy = jest.spyOn(cameraContainer.props, 'cameraRef');

      cameraContainer.refs = {camera: new Camera()};
      cameraContainer.componentDidMount();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(cameraContainer.refs.camera);
    });

    it('should not call the cameraRef prop callback if undefined', () => {
      const spy = jest.spyOn(cameraContainer.props, 'cameraRef');

      cameraContainer.props = {};
      cameraContainer.componentDidMount();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('componentWillReceiveProps()', () => {
    it('should start tweening to `targetName` if the prop has changed', () => {
      const controls = new Controls(new Camera());
      const targetName = 'Mars';
      const nextProps = {targetName: 'Earth'};
      const positions = {};
      const spy = jest.spyOn(cameraContainer, 'startTween');

      cameraContainer.props = {targetName, controls, positions};
      cameraContainer.componentWillReceiveProps(nextProps);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(nextProps.targetName);
    });

    it('should not tween if the `targetName` if the prop has not changed', () => {
      const controls = new Controls(new Camera());
      const targetName = 'Mars';
      const nextProps = {targetName};
      const positions = {};
      const spy = jest.spyOn(cameraContainer, 'startTween');

      cameraContainer.props = {targetName, controls, positions};
      cameraContainer.componentWillReceiveProps(nextProps);

      expect(spy).not.toHaveBeenCalled();
    });
  });
 
  describe('endTween()', () => {
    it('should dispose of the tweenData and tweenBase', () => {
      cameraContainer.tweenData = {};
      cameraContainer.tweenBase = {};
      cameraContainer.endTween();

      expect(cameraContainer).not.toHaveProperty('tweenData');
      expect(cameraContainer).not.toHaveProperty('tweenBase');
    });
  });

  describe('cancelTween()', () => {
    it('should call endTween, if the tweenBase is defined', () => {
      const stop = jest.fn();
      const spy = jest.spyOn(cameraContainer, 'endTween');

      cameraContainer.tweenBase = {stop};
      cameraContainer.cancelTween();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('startTween()', () => {
    const targetName = 'Earth';
    const action = {};
    const cameraBase = {};
    const zoomIn = jest.fn();
    const positions = {[targetName]: {}};

    beforeEach(() => {
      cameraContainer.refs = {cameraBase};
      cameraContainer.props = {action, positions, zoomIn};
    });

    it('should call cancelTween()', () => {
      const spy = jest.spyOn(cameraContainer, 'cancelTween');

      cameraContainer.startTween(targetName);
      
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should initialize a new tween', () => {
      cameraContainer.startTween(targetName);
      expect(typeof cameraContainer.tweenBase).toEqual('object');
    });
  });

  describe('getTargetPosition()', () => {
    it('should return the vector version of current tweenData, if any', () => {
      const tweenData = {x: 1, y: 1, z: 1};

      SceneService.objectToVector = (v) => v;
      cameraContainer.tweenData = tweenData;

      const result = cameraContainer.getTargetPosition();

      expect(result).toEqual(tweenData);
    });

    it('should return the target position if scene container is not actively tweening', () => {
      const targetPosition = {x: 1, y: 1, z: 1};
      SceneService.getTargetPosition = () => targetPosition;
      const result = cameraContainer.getTargetPosition();

      expect(result).toEqual(targetPosition);
    });
  });

  describe('render()', () => {
    it('should render the scene container successfully', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
