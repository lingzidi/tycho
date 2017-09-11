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
    describe('when not in perspective mode', () => {
      it('should return the `position3d` if the target is defined', () => {
        const position3d = {x: 1, y: 1, z: 1};
        const targetName = 'Mars';

        const props = {targetName};
        const state = {
          positions: {
            [targetName]: {position3d}
          }
        };

        const result = SceneService.getTargetPosition(state, props);

        expect(result).toBeDefined();
        expect(result).toEqual(position3d);
      });

      it('should return <0> when the target is not defined', () => {
        const state = {positions: {}};
        const result = SceneService.getTargetPosition(state, {});

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Vector3);
        expect(result).toEqual(new Vector3(0, 0, 0));
      });

      it('should return <0> when state is null', () => {
        const result = SceneService.getTargetPosition(null, {});

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Vector3);
        expect(result).toEqual(new Vector3(0, 0, 0));
      });
    });

    describe('when in perspective mode', () => {
      it('should return <0>', () => {
        const state = {
          perpsective: true,
          positions: {}
        };
        const result = SceneService.getTargetPosition(state, {});

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Vector3);
        expect(result).toEqual(new Vector3(0, 0, 0));
      });
    });

  });

  describe('updateCameraVectors()', () => {
    let camera, copySpy, lookAtSpy;

    beforeEach(() => {
      camera = new Camera();
      
      lookAtSpy = jest.spyOn(camera, 'lookAt');
      copySpy = jest.spyOn(camera.position, 'copy');
    });
    
    describe('when not in perspective mode', () => {
      it('should not change the lookAt or target of the camera', () => {
        const state = {
          positions: {
            Earth: 1,
            Mars: 2
          },
          targetName: 'Earth'
        };
        const props = {
          lookAtName: 'Mars'
        };

        SceneService.updateCameraVectors(state, props, camera);

        expect(copySpy).not.toHaveBeenCalled();
        expect(lookAtSpy).not.toHaveBeenCalled();
      });
    });

    describe('when in perspective mode', () => {
      it('should look at the lookAtName from the targetName if both are defined', () => {
        const position3d = new Vector3(1, 2, 3);
        const state = {
          positions: {
            Earth: {position3d},
            Mars: {position3d}
          },
          targetName: 'Earth'
        };
        const props = {
          lookAtName: 'Mars',
          perspective: true
        };
        
        SceneService.updateCameraVectors(state, props, camera);

        expect(copySpy).toHaveBeenCalled();
        expect(copySpy).toHaveBeenCalledWith(position3d);
        expect(lookAtSpy).toHaveBeenCalled();
        expect(lookAtSpy).toHaveBeenCalledWith(position3d);
      });

      it('should not change the lookAt or target positions of the camera if the lookAtName is undefined', () => {
        const state = {
          positions: {
            Earth: 1
          },
          targetName: 'Earth'
        };
        const props = {
          lookAtName: 'Mars',
          perspective: true
        };

        SceneService.updateCameraVectors(state, props, camera);

        expect(copySpy).not.toHaveBeenCalled();
        expect(lookAtSpy).not.toHaveBeenCalled();
      });

      it('should not change the lookAt or target of the camera if the targetName is undefined', () => {
        const state = {
          positions: {
            Mars: 2
          },
          targetName: 'Earth'
        };
        const props = {
          lookAtName: 'Mars',
          perspective: true
        };

        SceneService.updateCameraVectors(state, props, camera);

        expect(copySpy).not.toHaveBeenCalled();
        expect(lookAtSpy).not.toHaveBeenCalled();
      });
    });
  });
});
