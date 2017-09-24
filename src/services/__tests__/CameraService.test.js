import CameraService from '../CameraService';
import TWEEN from 'tween.js';
import {Vector3, Camera} from 'three';

const fixture = [
  {
    id: 'Mars',
    radius: 4
  },
  {
    id: 'Earth',
    radius: 5,
    satellites: [{
      id: 'Moon',
      radius: 2
    }]
  },
  {
    id: 'Venus',
    radius: 3
  }
];

describe('Camera Service', () => {
  describe('vectorToObject()', () => {
    it('should extract the x, y, z properties into an object from the given vector', () => {
      const x = 1;
      const y = 2;
      const z = 3;

      const result = CameraService.vectorToObject(new Vector3(x, y, z));

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

        const result = CameraService.objectToVector({x, y, z});

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

      CameraService.startTween(tween, {});

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

      const result = CameraService.getTargetPosition(positions, targetName);

      expect(result).toBeDefined();
      expect(result).toEqual(position3d);
    });

    it('should return <0> when the targetName is not defined', () => {
      const state = {positions: {}};
      const result = CameraService.getTargetPosition(state, {});

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Vector3);
      expect(result).toEqual(new Vector3(0, 0, 0));
    });

    it('should return <0> when positions is not defined', () => {
      const result = CameraService.getTargetPosition(undefined, {});

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Vector3);
      expect(result).toEqual(new Vector3(0, 0, 0));
    });
  });

  describe('getMinDistance()', () => {
    it('should return the min distance required for a given planet', () => {
      expect(CameraService.getMinDistance(fixture, 'Earth')).toEqual(0.00001);
    });
  });

  describe('getTargetRadius()', () => {
    it('should return a planet\'s radius', () => {
      expect(CameraService.getTargetRadius(fixture, 'Earth')).toEqual(5);
    });

    it('should return a satellite\'s radius', () => {
      expect(CameraService.getTargetRadius(fixture, 'Moon')).toEqual(2);
    });

    it('should return a mid-entry list item radius', () => {
      expect(CameraService.getTargetRadius(fixture, 'Mars')).toEqual(4);
    });
  });
});
