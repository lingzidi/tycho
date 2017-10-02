import React from 'react';
import React3 from 'react-three-renderer';
import renderer from 'react-test-renderer';
import ReactDOM from 'react-dom';
import {Vector3, Camera} from 'three';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {SceneContainer} from '../SceneContainer';
import Controls from '../../utils/Controls';
import CameraService from '../../services/CameraService';
import data from './__fixtures__/orbitals.json';

jest.mock('../../services/CameraService');

describe.only('Scene Container', () => {
  let component, sceneContainer;

  beforeEach(() => {
    component = shallow(
      <SceneContainer
        orbitalData={data}
        updateScreenPosition={() => {}}
        onAnimate={() => {}}
        action={{setPosition: jest.fn()}}
        width={500}
        height={300}
        time={1}
      />
    );

    sceneContainer = component.instance();
  });

  describe('componentDidMount()', () => {
    it('should initialize a new instance of controls', () => {
      sceneContainer.camera = new Camera();
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

  describe('prop update methods', () => {
    beforeEach(() => {
      sceneContainer.controls = new Controls(new Camera());
    });

    describe('componentWillReceiveProps()', () => {
      const action = {
        changeSpeed: jest.fn()
      };

      beforeEach(() => {
        sceneContainer.refs = {
          cameraBase: {
            startTween: jest.fn(),
            endTween: jest.fn()
          }
        };
      });

      it('should start tweening to `targetName` if the prop has changed', () => {
        const targetName = 'Mars';
        const nextProps = {targetName: 'Earth'};
        const positions = {};
        const spy = jest.spyOn(sceneContainer.refs.cameraBase, 'startTween');

        sceneContainer.props = {targetName, positions, action};
        sceneContainer.componentWillReceiveProps(nextProps);

        expect(spy).toHaveBeenCalledTimes(1);
        //expect(spy).toHaveBeenCalledWith(nextProps.targetName);
      });

      it('should not tween if the `targetName` if the prop has not changed', () => {
        const targetName = 'Mars';
        const nextProps = {targetName};
        const positions = {};
        const spy = jest.spyOn(sceneContainer.refs.cameraBase, 'startTween');

        sceneContainer.props = {targetName, positions, action};
        sceneContainer.componentWillReceiveProps(nextProps);

        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('maybePreventCameraCollision()', () => {
      it('should update the minDistance if the targetName has changed', () => {
        const nextProps = {targetName: 'Mars'};
        const minDistance = 3;

        CameraService.getMinDistance = () => minDistance;
        sceneContainer.props = {targetName: 'Earth'};
        sceneContainer.controls.minDistance = 5;
        sceneContainer.maybePreventCameraCollision(nextProps);

        expect(sceneContainer.controls.minDistance).toEqual(minDistance);
      });

      it('should update the minDistance if the scale has changed', () => {
        const targetName = 'Earth';
        const nextProps = {targetName, scale: 5};
        const minDistance = 3;

        CameraService.getMinDistance = () => minDistance;
        sceneContainer.props = {targetName};
        sceneContainer.controls.minDistance = 5;
        sceneContainer.maybePreventCameraCollision(nextProps);

        expect(sceneContainer.controls.minDistance).toEqual(minDistance);
      });
    });

    describe('maybeUpdateAutoOrbit()', () => {
      it('should set controls.autoRotate to the value of `isAutoOrbitEnabled` if it has changed', () => {
        const isAutoOrbitEnabled = false;
        const nextProps = {isAutoOrbitEnabled};
        
        sceneContainer.props = {isAutoOrbitEnabled: !isAutoOrbitEnabled};
        sceneContainer.componentWillReceiveProps(nextProps);

        expect(sceneContainer.controls.autoRotate).toEqual(isAutoOrbitEnabled);
      });

      it('should change the value of controls.autoRotate if `isAutoOrbitEnabled` has not changed', () => {
        const isAutoOrbitEnabled = false;
        const nextProps = {isAutoOrbitEnabled};

        sceneContainer.props = {isAutoOrbitEnabled};
        sceneContainer.componentWillReceiveProps(nextProps);

        expect(sceneContainer.controls.autoRotate).toEqual(isAutoOrbitEnabled);
      });
    });

    describe('maybeUpdateControlsZoom()', () => {
      it('should call controls.zoom() if the `zoom` prop has changed', () => {
        const zoom = 10;
        const nextProps = {zoom: 20};
        const spy = jest.spyOn(sceneContainer.controls, 'zoom');

        sceneContainer.props = {zoom};
        sceneContainer.componentWillReceiveProps(nextProps);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(nextProps.zoom);
      });

      it('should not call controls.zoom() if the `zoom` prop has not changed', () => {
        const zoom = 10;
        const nextProps = {zoom};
        const spy = jest.spyOn(sceneContainer.controls, 'zoom');

        sceneContainer.props = {zoom};
        sceneContainer.componentWillReceiveProps(nextProps);

        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  describe('onAnimate()', () => {
    it('should call props.onAnimate()', () => {
      sceneContainer.props = {onAnimate: jest.fn()};
      sceneContainer.controls = {update: jest.fn()};

      const onAnimateSpy = jest.spyOn(sceneContainer.props, 'onAnimate');
    
      sceneContainer.onAnimate();

      expect(onAnimateSpy).toHaveBeenCalled();
      expect(onAnimateSpy).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('changeZoom()', () => {
    it('should call controls.wheelZoom()', () => {
      const wheelZoom = jest.fn();
      sceneContainer.controls = {wheelZoom};
      sceneContainer.props = {action: {}};
      const spy = jest.spyOn(sceneContainer.controls, 'wheelZoom');
      
      sceneContainer.changeZoom();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('zoomIn()', () => {
    it('should call controls.tweenZoom()', () => {
      const changeZoom = jest.fn();
      const tweenZoom = jest.fn();

      sceneContainer.controls = {tweenZoom};
      sceneContainer.props = {action: {changeZoom}};
      
      const spy = jest.spyOn(sceneContainer.controls, 'tweenZoom');

      sceneContainer.zoomIn();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(1, changeZoom);
    });
  });

  describe('auto rotate methods', () => {
    beforeEach(() => {
      sceneContainer.props = {
        action: {
          setCameraOrbit: jest.fn(),
          setUIControls: jest.fn()
        }
      };
    });

    describe('startAutoRotate()', () => {
      it('should call the setCameraOrbit() action with `true`', () => {
        const spy = jest.spyOn(sceneContainer.props.action, 'setCameraOrbit');

        sceneContainer.startAutoRotate();

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(true);
      });

      it('should call the setUIControls() action with `false`', () => {
        const spy = jest.spyOn(sceneContainer.props.action, 'setUIControls');

        sceneContainer.startAutoRotate();

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(false);
      });
    });

    describe('stopAutoRotate()', () => {
      it('should call the setCameraOrbit() action with `false`', () => {
        const spy = jest.spyOn(sceneContainer.props.action, 'setCameraOrbit');

        sceneContainer.stopAutoRotate();
        
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(false);
      });

      it('should call the setUIControls() action with `true`', () => {
        const spy = jest.spyOn(sceneContainer.props.action, 'setUIControls');

        sceneContainer.stopAutoRotate();

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('setCamera()', () => {
    it('should set `camera` to the value of the param passed', () => {
      const camera = {};
      sceneContainer.setCamera(camera);

      expect(sceneContainer).toHaveProperty('camera');
      expect(sceneContainer.camera).toEqual(camera);
    });
  });

  describe('endCameraTween()', () => {
    const speed = 5;
    
    beforeEach(() => {
      sceneContainer.props = {
        action: {
          changeSpeed: jest.fn()
        }
      };
      sceneContainer.refs = {
        cameraBase: {
          endTween: jest.fn()
        }
      };
    });

    it('should restore the user-defined speed', () => {
      const spy = jest.spyOn(sceneContainer.refs.cameraBase, 'endTween');

      sceneContainer.endCameraTween(speed);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should restore the user-defined speed', () => {
      const spy = jest.spyOn(sceneContainer.props.action, 'changeSpeed');

      sceneContainer.endCameraTween(speed);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(speed);
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

  describe('render()', () => {
    it('should render the scene container without the camera', () => {
      expect(toJson(component)).toMatchSnapshot();
    });

    it('should render the scene container with the camera', () => {
      sceneContainer.camera = new Camera();
      sceneContainer.render();
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
