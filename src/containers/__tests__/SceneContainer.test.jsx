import React from 'react';
import React3 from 'react-three-renderer';
import renderer from 'react-test-renderer';
import ReactDOM from 'react-dom';
import {Vector3, Camera} from 'three';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {SceneContainer} from '../SceneContainer';
import {CameraContainer} from '../CameraContainer';
import Controls from '../../utils/Controls';
import data from './__fixtures__/orbitals.json';

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

  describe('onAnimate()', () => {
    beforeEach(() => {
      sceneContainer.props = {onAnimate: jest.fn()};
      sceneContainer.refs = {camera};
    });

    it('should call props.onAnimate()', () => {
      const onAnimateSpy = jest.spyOn(sceneContainer.props, 'onAnimate');
    
      sceneContainer.onAnimate();

      expect(onAnimateSpy).toHaveBeenCalled();
      expect(onAnimateSpy).toHaveBeenCalledTimes(1);
    });

    it('should update the camera component', () => {
      const spy = jest.spyOn(sceneContainer.refs.camera, 'update');
    
      sceneContainer.onAnimate();

      expect(spy).toHaveBeenCalled();
    });
  });
  
  describe('changeZoom()', () => {
    it('should call controls.wheelZoom()', () => {
      sceneContainer.refs = {camera};
      sceneContainer.props = {action: {}};
      const spy = jest.spyOn(sceneContainer.refs.camera.controls, 'wheelZoom');
      
      sceneContainer.changeZoom();

      expect(spy).toHaveBeenCalled();
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

const camera = {
  controls: {
    wheelZoom: jest.fn()
  },
  update: jest.fn(),
  refs: {
    camera: {
      position: {
        clone: jest.fn()
      }
    }
  }
};

