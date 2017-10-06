import CameraService from '../CameraService';
import TWEEN from 'tween.js';
import {Vector3, Camera, Object3D, Scene} from 'three';
import fixture from './__fixtures__/planets.json';

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

  describe('getPivotTween()', () => {
    // TODO: write better tests for this...
    it('should return a new instance of Tween', () => {
      const tween = CameraService.getPivotTween();

      expect(tween).toBeDefined();
      expect(tween).toBeInstanceOf(TWEEN.Tween);
    });
  });

  describe('movePivot()', () => {
    const target = new Object3D();
    const pivot = new Object3D();

    it('should add the given pivot to the target', () => {
      const spy = jest.spyOn(target, 'add');

      CameraService.movePivot(pivot, target);

      expect(spy).toHaveBeenCalled;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(pivot);
    });

    it('should reset the pivot position to <0>', () => {
      const spy = jest.spyOn(pivot.position, 'set');

      CameraService.movePivot(pivot, target);

      expect(spy).toHaveBeenCalled;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(0, 0, 0);
    });
  });

  describe('setPivotPosition()', () => {
    it('should reset the pivot position to the given vector', () => {
      const x = 1, y = 2, z = 3;
      const pivot = new Object3D();
      const spy = jest.spyOn(pivot.position, 'set');

      CameraService.setPivotPosition(pivot, {x, y, z});

      expect(spy).toHaveBeenCalled;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(x, y, z);
    });
  });

  describe('getWorldPosition()', () => {
    const scene = new Scene();
    const object = new Object3D();
    const position = new Vector3(5, 6, 1);

    beforeEach(() => {
      scene.add(object);
      object.position.copy(position);
    });

    it('should call updateMatrixWorld() on the target', () => {
      const spy = jest.spyOn(object, 'updateMatrixWorld');

      CameraService.getWorldPosition(object);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    
    it('should be an instance of Vector3', () => {
      const result = CameraService.getWorldPosition(object);

      expect(result).toBeInstanceOf(Vector3);
    });

    it('should return the world position of a given object', () => {
      const result = CameraService.getWorldPosition(object);

      expect(result).toEqual(position);
    });
  });

  describe('getMinDistance()', () => {
    it('should return the min distance required for a given planet', () => {
      expect(CameraService.getMinDistance(fixture, 'Earth')).toEqual(0.00001);
    });
  });
});
