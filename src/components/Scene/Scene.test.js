import React from 'react';
import React3 from 'react-three-renderer';
import renderer from 'react-test-renderer';
import ReactDOM from 'react-dom';
import {Vector3, Camera} from 'three';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Scene from './Scene';
import Controls from '../../utils/Controls';
import data from '../../global/fixtures';

describe('Scene Component', () => {
  let component, scene;

  beforeEach(() => {
    component = shallow(<Scene
      orbitalData={data}
      onAnimate={() => {}}
      updateScreenPositions={() => {}}
      time={1}
      width={500}
      height={300}
    />);

    scene = component.instance();
  });

  describe('componentDidMount()', () => {
    it('should initialize a new instance of controls', () => {
      scene.refs = {camera: new Camera()};
      scene.componentDidMount();

      expect(scene).toHaveProperty('controls');
      expect(scene.controls).toBeInstanceOf(Controls);
    });
  });

  describe('componentWillUnmount()', () => {
    beforeEach(() => {
      const camera = new Camera();
      scene.controls = new Controls(camera);
    });

    it('should dispose of the controls', () => {
      const spy = jest.spyOn(scene.controls, 'dispose');

      scene.componentWillUnmount();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should no longer have controls assigned to the class instance', () => {
      scene.componentWillUnmount();

      expect(scene).not.toHaveProperty('controls');
    });
  });

  describe('getCamera()', () => {
    let camera;

    beforeEach(() => {
      camera = scene.getCamera(100, 200);
    });

    it('should return an instance of camera', () => {
      expect(camera).toBeDefined();
      expect(typeof camera).toBe('object');
    });

    it('should render a camera with fixed constant props', () => {
      const cameraJson = toJson(shallow(camera));
      expect(cameraJson).toMatchSnapshot();
    });
  });

  describe('getCameraPosition()', () => {
    it('should returned the cloned position vector', () => {
      const position = new Vector3(1, 2, 3);
      const camera = {position};
      const cloned = scene.getCameraPosition(camera);

      expect(cloned !== position).toBe(true);
      expect(cloned).toEqual(position);
    });

    it('should return null if the camera is undefined', () => {
      const cloned = scene.getCameraPosition();

      expect(cloned).toBeDefined();
      expect(cloned).toBeNull();
    });
  });

  describe('getOrbitalElements()', () => {
    let orbitalContainers;

    beforeEach(() => {
      orbitalContainers = scene.getOrbitalElements(data);
    });

    it('should be an array', () => {
      expect(Array.isArray(orbitalContainers)).toBe(true)
    });

    it('should match the snapshot of OrbitalElements', () => {
      const orbitalJson = toJson(shallow(
        <group>orbitalContainers</group>
      ));

      expect(orbitalJson).toMatchSnapshot();
    });
  });

  describe('render()', () => {
    it('should render the scene', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
