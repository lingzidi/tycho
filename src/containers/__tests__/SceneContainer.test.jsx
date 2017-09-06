import React from 'react';
import React3 from 'react-three-renderer';
import renderer from 'react-test-renderer';
import ReactDOM from 'react-dom';
import {Vector3, Camera} from 'three';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import SceneContainer from '../SceneContainer';
import Controls from '../../utils/Controls';
import data from '../../global/fixtures';

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

  describe('onAnimate()', () => {
    it('should call updateCameraVectors() and onAnimate()', () => {
      sceneContainer.props = {onAnimate: jest.fn()};
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

  describe('getTargetPosition()', () => {
    describe('when not in perspective mode', () => {
      it('should return the `position3d` if the target is defined', () => {
        const position3d = {x: 1, y: 1, z: 1};
        const targetName = 'MARS';

        sceneContainer.props = {targetName};
        sceneContainer.state = {
          positions: {
            [targetName]: {position3d}
          }
        };

        const result = sceneContainer.getTargetPosition();

        expect(result).toBeDefined();
        expect(result).toEqual(position3d);
      });

      it('should return <0> when the target is not defined', () => {
        sceneContainer.state = {positions: {}};

        const result = sceneContainer.getTargetPosition();

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Vector3);
        expect(result).toEqual(new Vector3(0, 0, 0));
      });

      it('should return <0> when state is null', () => {
        sceneContainer.state = null;

        const result = sceneContainer.getTargetPosition();

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Vector3);
        expect(result).toEqual(new Vector3(0, 0, 0));
      });
    });

    describe('when in perspective mode', () => {
      it('should return <0>', () => {
        sceneContainer.state = {
          perpsective: true,
          positions: {}
        };

        const result = sceneContainer.getTargetPosition();

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Vector3);
        expect(result).toEqual(new Vector3(0, 0, 0));
      });
    });
  });

  describe('updateCameraVectors()', () => {
    let copySpy, lookAtSpy;

    beforeEach(() => {
      const copy = jest.fn();
      const lookAt = jest.fn();

      sceneContainer.refs = {
        camera: {position: {copy}, lookAt}
      };
      lookAtSpy = jest.spyOn(sceneContainer.refs.camera, 'lookAt');
      copySpy = jest.spyOn(sceneContainer.refs.camera.position, 'copy');
    });

    describe('when not in perspective mode', () => {
      it('should not change the lookAt or target of the camera', () => {
        sceneContainer.state = {
          positions: {
            Earth: 1,
            Mars: 2
          }
        };
        sceneContainer.props = {
          lookAtName: 'Mars',
          targetName: 'Earth'
        };
        sceneContainer.updateCameraVectors();

        expect(copySpy).not.toHaveBeenCalled();
        expect(lookAtSpy).not.toHaveBeenCalled();
      });
    });

    describe('when in perspective mode', () => {
      it('should look at the lookAtName from the targetName if both are defined', () => {
        const position3d = new Vector3(1, 2, 3);

        sceneContainer.state = {
          positions: {
            Earth: {position3d},
            Mars: {position3d}
          }
        };
        sceneContainer.props = {
          lookAtName: 'Mars',
          targetName: 'Earth',
          perspective: true
        };
        sceneContainer.updateCameraVectors(true);

        expect(copySpy).toHaveBeenCalled();
        expect(copySpy).toHaveBeenCalledWith(position3d);
        expect(lookAtSpy).toHaveBeenCalled();
        expect(lookAtSpy).toHaveBeenCalledWith(position3d);
      });

      it('should not change the lookAt or target positions of the camera if the lookAtName is undefined', () => {
        sceneContainer.state = {
          positions: {
            Earth: 1
          }
        };
        sceneContainer.props = {
          lookAtName: 'Mars',
          targetName: 'Earth',
          perspective: true
        };
        sceneContainer.updateCameraVectors();

        expect(copySpy).not.toHaveBeenCalled();
        expect(lookAtSpy).not.toHaveBeenCalled();
      });

      it('should not change the lookAt or target of the camera if the targetName is undefined', () => {
        sceneContainer.state = {
          positions: {
            Mars: 2
          }
        };
        sceneContainer.props = {
          lookAtName: 'Mars',
          targetName: 'Earth',
          perspective: true
        };
        sceneContainer.updateCameraVectors();

        expect(copySpy).not.toHaveBeenCalled();
        expect(lookAtSpy).not.toHaveBeenCalled();
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
    it('should render the scene container successfully', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
