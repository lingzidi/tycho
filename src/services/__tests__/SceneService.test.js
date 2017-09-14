import SceneService from '../SceneService';
import TWEEN from 'tween.js';
import {Vector3, Camera} from 'three';

describe('Scene Service', () => {
  describe('vectorToObject()', () => {
    it('should extract the x, y, z properties into an object from the given vector', () => {
      const x = 1;
      const y = 2;
      const z = 3;

      const result = SceneService.vectorToObject(new Vector3(x, y, z));

      expect(typeof result).toBe('object');
      expect(result.x).toEqual(x);
      expect(result.y).toEqual(y);
      expect(result.z).toEqual(z);
    });
  });

  describe('objectToVector()', () => {
    it('should convert a plain object with x, y, z values to a Vector3', () => {
        const x = 1;
        const y = 2;
        const z = 3;

        const result = SceneService.objectToVector({x, y, z});

        expect(result).toBeInstanceOf(Vector3);
        expect(result.x).toEqual(x);
        expect(result.y).toEqual(y);
        expect(result.z).toEqual(z);
    });
  });

  describe('startTween()', () => {
    it('should start the given tween', () => {
      const tween = new TWEEN.Tween({});
      const spy = jest.spyOn(tween, 'start');

      SceneService.startTween(tween, {});

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTargetPosition()', () => {
    it('should return the `position3d` if the target is defined', () => {
      const position3d = {x: 1, y: 1, z: 1};
      const targetName = 'Mars';
      const positions = {
        [targetName]: {position3d}
      };

      const result = SceneService.getTargetPosition(positions, targetName);

      expect(result).toBeDefined();
      expect(result).toEqual(position3d);
    });

    it('should return <0> when the targetName is not defined', () => {
      const state = {positions: {}};
      const result = SceneService.getTargetPosition(state, {});

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Vector3);
      expect(result).toEqual(new Vector3(0, 0, 0));
    });

    it('should return <0> when positions is not defined', () => {
      const result = SceneService.getTargetPosition(undefined, {});

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Vector3);
      expect(result).toEqual(new Vector3(0, 0, 0));
    });
  });

  describe('mapZoom()', () => {
    let action, spy; 

    beforeEach(() => {
      action = {changeZoom: jest.fn()};
      spy = jest.spyOn(action, 'changeZoom');
    });

    it('should call the given action callback with the calculated zoom, if changed', () => {
      const newZoom = 20;
      const controls = {
        getZoomDelta: () => newZoom
      };
      SceneService.mapZoom({}, controls, action.changeZoom);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(newZoom);
    });

    it('should not call the given callback if the zoom stays the same', () => {
      const newZoom = 20;
      const controls = {
        getZoomDelta: () => newZoom,
        level: newZoom / 100
      };
      SceneService.mapZoom({}, controls, action.changeZoom);

      expect(spy).not.toHaveBeenCalled();
    });
  });

});
