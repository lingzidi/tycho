import React from 'react';
import React3 from 'react-three-renderer';
import renderer from 'react-test-renderer';
import ReactDOM from 'react-dom';
import TWEEN from 'tween.js';
import {Vector3, Camera} from 'three';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {SceneContainer} from '../SceneContainer';
import Controls from '../../utils/Controls';
import data from '../../global/fixtures';
import SceneService from '../../services/SceneService';

jest.mock('../../services/SceneService');

describe('Scene Container', () => {
  let component, sceneContainer;

  beforeEach(() => {
    component = shallow(<SceneContainer
      orbitalData={data}
      updateScreenPosition={() => {}}
      onAnimate={() => {}}
      width={500}
      height={300}
      time={1}
    />);

    sceneContainer = component.instance();
  });

  describe('componentDidMount()', () => {
    it('should initialize a new instance of controls', () => {
      sceneContainer.refs = {camera: new Camera()};
      sceneContainer.componentDidMount();

      expect(sceneContainer).toHaveProperty('controls');
      expect(sceneContainer.controls).toBeInstanceOf(Controls);
    });
  });

  describe('componentWillUnmount()', () => {
    beforeEach(() => {
      const camera = new Camera();
      sceneContainer.controls = new Controls(camera);
    });

    it('should dispose of the controls', () => {
      const spy = jest.spyOn(sceneContainer.controls, 'dispose');

      sceneContainer.componentWillUnmount();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should no longer have controls assigned to the class instance', () => {
      sceneContainer.componentWillUnmount();

      expect(sceneContainer).not.toHaveProperty('controls');
    });
  });

  describe('componentWillReceiveProps()', () => {
    beforeEach(() => {
      sceneContainer.controls = new Controls(new Camera());
    });

    it('should call controls.zoom() if the `zoom` prop has changed', () => {
      const zoom = 10;
      const nextProps = {zoom: 20};
      const spy = jest.spyOn(sceneContainer.controls, 'zoom');

      sceneContainer.props = {zoom};
      sceneContainer.componentWillReceiveProps(nextProps);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(nextProps.zoom);
    });

    it('should start tweening to `targetName` if the prop has changed', () => {
      const targetName = 'Mars';
      const nextProps = {targetName: 'Earth'};
      const spy = jest.spyOn(sceneContainer, 'startTween');

      sceneContainer.state = {positions: {}};
      sceneContainer.props = {targetName};
      sceneContainer.componentWillReceiveProps(nextProps);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(nextProps.targetName);
    });
  });

  describe('onAnimate()', () => {
    it('should call updateCameraVectors() and onAnimate()', () => {
      sceneContainer.props = {onAnimate: jest.fn()};
      sceneContainer.controls = {update: jest.fn()};
      sceneContainer.updateCameraVectors = jest.fn();

      const updateCamVectSpy = jest.spyOn(sceneContainer, 'updateCameraVectors');
      const onAnimateSpy = jest.spyOn(sceneContainer.props, 'onAnimate');
    
      sceneContainer.onAnimate();

      expect(updateCamVectSpy).toHaveBeenCalled();
      expect(updateCamVectSpy).toHaveBeenCalledTimes(1);
      expect(onAnimateSpy).toHaveBeenCalled();
      expect(onAnimateSpy).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('updatePosition()', () => {
    it('should call props.updateScreenPosition with given position2d and id params', () => {
      const updateScreenPosition = jest.fn();
      const position2d = {x: 1, y: 1};
      const id = 'Mars';

      sceneContainer.state = {positions: {}};
      sceneContainer.props = {updateScreenPosition};

      const spy = jest.spyOn(sceneContainer.props, 'updateScreenPosition');

      sceneContainer.updatePosition({position2d}, id, true);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(position2d, id);
    });
  });

  describe('endTween()', () => {
    it('should dispose of the tweenData and tweenBase', () => {
      sceneContainer.tweenData = {};
      sceneContainer.tweenBase = {};
      sceneContainer.endTween();

      expect(sceneContainer).not.toHaveProperty('tweenData');
      expect(sceneContainer).not.toHaveProperty('tweenBase');
    });
  });

  describe('cancelTween()', () => {
    it('should call endTween, if the tweenBase is defined', () => {
      const stop = jest.fn();
      const spy = jest.spyOn(sceneContainer, 'endTween');

      sceneContainer.tweenBase = {stop};
      sceneContainer.cancelTween();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('startTween()', () => {
    const targetName = 'Earth';
    const action = {};
    const cameraBase = {};
    const tweenZoom = jest.fn();
    const positions = {[targetName]: {}};

    beforeEach(() => {
      sceneContainer.controls = {tweenZoom};
      sceneContainer.refs = {cameraBase};
      sceneContainer.props = {action};
      sceneContainer.state = {positions};
    });

    it('should call cancelTween()', () => {
      const spy = jest.spyOn(sceneContainer, 'cancelTween');

      sceneContainer.startTween(targetName);
      
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should initialize a new tween', () => {
      sceneContainer.startTween(targetName);
      expect(typeof sceneContainer.tweenBase).toEqual('object');
    });
  });

  describe('getTargetPosition()', () => {
    it('should return the vector version of current tweenData, if any', () => {
      const tweenData = {x: 1, y: 1, z: 1};

      SceneService.objectToVector = (v) => v;
      sceneContainer.tweenData = tweenData;

      const result = sceneContainer.getTargetPosition();

      expect(result).toEqual(tweenData);
    });

    it('should return the target position if scene container is not actively tweening', () => {
      const targetPosition = {x: 1, y: 1, z: 1};
      SceneService.getTargetPosition = () => targetPosition;
      const result = sceneContainer.getTargetPosition();

      expect(result).toEqual(targetPosition);
    });
  });

  describe('updateCameraVectors()', () => {
    it('should call the service method', () => {
      const spy = jest.spyOn(SceneService, 'updateCameraVectors');
      sceneContainer.updateCameraVectors();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('updateCameraPosition()', () => {
    it('should returned the cloned position vector', () => {
      const position = new Vector3(1, 2, 3);
      const camera = {position};
      
      sceneContainer.refs = {camera};  
      sceneContainer.updateCameraPosition();

      expect(component.state('cameraMatrix')).toEqual(position);
    });
  });

  describe('setDomElement()', () => {
    it('should set `domElement` to the value of the param passed', () => {
      const elem = <canvas />;
      sceneContainer.setDomElement(elem);

      expect(sceneContainer).toHaveProperty('domElement');
      expect(sceneContainer.domElement).toEqual(elem);
    });
  });

  describe('changeZoom()', () => {
    it('should call mapZoom()', () => {
      SceneService.mapZoom = jest.fn();
      const changeZoom = jest.fn();
      const spy = jest.spyOn(SceneService, 'mapZoom');

      sceneContainer.props = {
        action: {changeZoom}
      };
      sceneContainer.changeZoom();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('render()', () => {
    it('should render the scene container successfully', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
