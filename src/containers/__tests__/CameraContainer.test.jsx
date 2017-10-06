import React from 'react';
import React3 from 'react-three-renderer';
import renderer from 'react-test-renderer';
import ReactDOM from 'react-dom';
import TWEEN from 'tween.js';
import {Vector3, Camera, Object3D} from 'three';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import CameraContainer from '../CameraContainer';
import Controls from '../../utils/Controls';
import data from './__fixtures__/orbitals.json';
import CameraService from '../../services/CameraService';

jest.mock('../../services/CameraService');

const action = {
  setUIControls: jest.fn(),
  changeSpeed: jest.fn()
};

describe('Camera Container', () => {
  let component, cameraContainer;

  beforeEach(() => {
    component = shallow(
      <CameraContainer 
        action={action}
        targetName="testPlanet"
        orbitalData={data}
        ratio={1.5}
      />
    );
    cameraContainer = component.instance();
  });

  describe('Prop update methods', () => {
    beforeEach(() => {
      cameraContainer.controls = new Controls(new Camera());
    });

    describe('componentDidMount()', () => {
      it('should initialize a new instance of controls', () => {
        cameraContainer.refs = {camera: new Camera()};
        cameraContainer.componentDidMount();

        expect(cameraContainer).toHaveProperty('controls');
        expect(cameraContainer.controls).toBeInstanceOf(Controls);
      });
    });

    describe('componentWillUnmount()', () => {
      beforeEach(() => {
        const camera = new Camera();
        cameraContainer.controls = new Controls(camera);
      });

      it('should dispose of the controls', () => {
        const spy = jest.spyOn(cameraContainer.controls, 'dispose');

        cameraContainer.componentWillUnmount();

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('should no longer have controls assigned to the class instance', () => {
        cameraContainer.componentWillUnmount();
        expect(cameraContainer).not.toHaveProperty('controls');
      });
    });

    describe('componentWillReceiveProps()', () => {
      const scene = {
        getObjectByName: () => new Object3D(),
        add: jest.fn()
      };

      it('should start tweening to `targetName` if the prop has changed', () => {
        const targetName = 'Mars';
        const nextProps = {targetName: 'Earth'};

        cameraContainer.startTween = jest.fn();
        cameraContainer.props = {targetName, action, scene};
        cameraContainer.componentWillReceiveProps(nextProps);

        const spy = jest.spyOn(cameraContainer, 'startTween');
        
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(nextProps.targetName);
      });

      it('should not tween if the `targetName` if the prop has not changed', () => {
        const targetName = 'Mars';
        const nextProps = {targetName};
        const spy = jest.spyOn(cameraContainer, 'startTween');

        cameraContainer.props = {targetName, action, scene};
        cameraContainer.componentWillReceiveProps(nextProps);

        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('maybePreventCameraCollision()', () => {
      it('should update the minDistance if the targetName has changed', () => {
        const nextProps = {targetName: 'Mars'};
        const minDistance = 3;

        CameraService.getMinDistance = () => minDistance;
        cameraContainer.props = {targetName: 'Earth'};
        cameraContainer.controls.minDistance = 5;
        cameraContainer.maybePreventCameraCollision(nextProps);

        expect(cameraContainer.controls.minDistance).toEqual(minDistance);
      });

      it('should update the minDistance if the scale has changed', () => {
        const targetName = 'Earth';
        const nextProps = {targetName, scale: 5};
        const minDistance = 3;

        CameraService.getMinDistance = () => minDistance;
        cameraContainer.props = {targetName};
        cameraContainer.controls.minDistance = 5;
        cameraContainer.maybePreventCameraCollision(nextProps);

        expect(cameraContainer.controls.minDistance).toEqual(minDistance);
      });
    });

    describe('maybeUpdateAutoOrbit()', () => {
      it('should set controls.autoRotate to the value of `isAutoOrbitEnabled` if it has changed', () => {
        const isAutoOrbitEnabled = false;
        const nextProps = {isAutoOrbitEnabled};
        
        cameraContainer.props = {isAutoOrbitEnabled: !isAutoOrbitEnabled};
        cameraContainer.componentWillReceiveProps(nextProps);

        expect(cameraContainer.controls.autoRotate).toEqual(isAutoOrbitEnabled);
      });

      it('should change the value of controls.autoRotate if `isAutoOrbitEnabled` has not changed', () => {
        const isAutoOrbitEnabled = false;
        const nextProps = {isAutoOrbitEnabled};

        cameraContainer.props = {isAutoOrbitEnabled};
        cameraContainer.componentWillReceiveProps(nextProps);

        expect(cameraContainer.controls.autoRotate).toEqual(isAutoOrbitEnabled);
      });
    });

    describe('maybeUpdateControlsZoom()', () => {
      it('should call controls.zoom() if the `zoom` prop has changed', () => {
        const zoom = 10;
        const nextProps = {zoom: 20};
        const spy = jest.spyOn(cameraContainer.controls, 'zoom');

        cameraContainer.props = {zoom};
        cameraContainer.componentWillReceiveProps(nextProps);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(nextProps.zoom);
      });

      it('should not call controls.zoom() if the `zoom` prop has not changed', () => {
        const zoom = 10;
        const nextProps = {zoom};
        const spy = jest.spyOn(cameraContainer.controls, 'zoom');

        cameraContainer.props = {zoom};
        cameraContainer.componentWillReceiveProps(nextProps);

        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
 
  describe('cancelTween()', () => {
    beforeEach(() => {
      cameraContainer.tweenBase = {stop: jest.fn()};
    });

    it('should call endTween, if the tweenBase is defined', () => {
      const spy = jest.spyOn(cameraContainer.tweenBase, 'stop');

      cameraContainer.cancelTween();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should dispose of tweenBase', () => {
      cameraContainer.cancelTween();

      expect(cameraContainer).not.toHaveProperty('tweenBase');
    });
  });

  describe('startTween()', () => {
    const pivot = new Object3D();
    const targetName = 'Mars';

    beforeEach(() => {
      cameraContainer.props = {
        scene: {
          add: jest.fn(),
          getObjectByName: jest.fn()
        }
      };
      cameraContainer.refs = {pivot};
      cameraContainer.cancelTween = jest.fn();
      cameraContainer.zoomIn = jest.fn();
      cameraContainer.controls = new Controls(new Camera());

      CameraService.getPivotTween = () => new TWEEN.Tween();
    });

    describe('when the target exists in the scene', () => {
      const target = new Object3D();

      beforeEach(() => {
        cameraContainer.props.scene.getObjectByName = () => target;
      });

      it('should add the pivot to the scene', () => {
        const spy = jest.spyOn(cameraContainer.props.scene, 'add');

        cameraContainer.startTween(targetName);

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(pivot);
      });

      it('should tween the pivot to the discovered target', () => {
        const spy = jest.spyOn(cameraContainer, 'tweenPivot');

        cameraContainer.startTween(targetName);

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(target, pivot);
      });
    });

    describe('when the target does not exist', () => {
      it('should not tween', () => {
        const spy = jest.spyOn(cameraContainer, 'tweenPivot');

        cameraContainer.props.scene.getObjectByName = () => null;
        cameraContainer.startTween(targetName);

        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  describe('tweenPivot()', () => {
    const target = new Vector3();
    const pivot = new Vector3();

    beforeEach(() => {
      cameraContainer.zoomIn = jest.fn();
      CameraService.getPivotTween = () => new TWEEN.Tween();
    });

    it('should assign a new Tween', () => {
      cameraContainer.tweenPivot(target, pivot);

      expect(cameraContainer.tweenBase).toBeInstanceOf(TWEEN.Tween);
    });

    it('should call zoomIn()', () => {
      const spy = jest.spyOn(cameraContainer, 'zoomIn');

      cameraContainer.tweenPivot(target, pivot);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('zoomIn()', () => {
    it('should call controls.tweenZoom()', () => {
      const changeZoom = jest.fn();
      const tweenZoom = jest.fn();

      cameraContainer.controls = {tweenZoom};
      cameraContainer.props = {action: {changeZoom}};
      
      const spy = jest.spyOn(cameraContainer.controls, 'tweenZoom');

      cameraContainer.zoomIn();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(1, changeZoom);
    });
  });

  describe('update()', () => {
    it('should update the controls', () => {
      cameraContainer.controls = {update: jest.fn()};
      const spy = jest.spyOn(cameraContainer.controls, 'update');

      cameraContainer.update();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('render()', () => {
    it('should render the scene container successfully', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
