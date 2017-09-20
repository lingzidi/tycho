import React from 'react';
import React3 from 'react-three-renderer';
import renderer from 'react-test-renderer';
import ReactDOM from 'react-dom';
import {Vector3, Camera} from 'three';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {SceneContainer} from '../SceneContainer';
import Controls from '../../utils/Controls';
import data from '../../global/fixtures';

describe('Scene Container', () => {
  let component, sceneContainer;

  beforeEach(() => {
    component = shallow(
      <SceneContainer
        orbitalData={data}
        updateScreenPosition={() => {}}
        onAnimate={() => {}}
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

  describe('updateCameraPosition()', () => {
    it('should returned the cloned position vector', () => {
      const position = new Vector3(1, 2, 3);
      
      sceneContainer.camera = {position};  
      sceneContainer.updateCameraPosition();

      expect(component.state('cameraMatrix')).toEqual(position);
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

  describe('setDomElement()', () => {
    it('should set `domElement` to the value of the param passed', () => {
      const elem = <canvas />;
      sceneContainer.setDomElement(elem);

      expect(sceneContainer).toHaveProperty('domElement');
      expect(sceneContainer.domElement).toEqual(elem);
    });
  });

  describe('render()', () => {
    it('should render the scene container successfully', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
