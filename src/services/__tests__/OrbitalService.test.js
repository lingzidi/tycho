import {Euler, Matrix4, Vector3, Camera} from 'three';
import OrbitalService from '../OrbitalService';
import Math2 from '../Math2';

describe('Orbital Service', () => {

  afterEach(() => jest.resetAllMocks());

  describe('getInclination()', () => {
    const incline = 123;

    it('should return the inclination if the `odd` parameter is truthy', () => {
      const result = OrbitalService.getInclination(incline, true);
      expect(result).toEqual(incline);
    });

    it('should return the inclination rotated by 90 degrees if the `odd` parameter is falsy', () => {
      const result = OrbitalService.getInclination(incline);
      expect(result).toEqual(incline - 90);
    });
  });

  describe('getEclipticGroupRotation()', () => {
    const param = {
      inclination: 10,
      longitudeOfAscendingNode: 15,
      odd: false
    };

    it('should return an Eulerian vector', () => {
      const result = OrbitalService.getEclipticGroupRotation(param);
      expect(result).toBeInstanceOf(Euler);
    });

    it('should call getInclination() on the provided inclination', () => {
      const spy = jest.spyOn(OrbitalService, 'getInclination');
      OrbitalService.getEclipticGroupRotation(param);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(param.inclination, param.isSatellite);
    });

    it('should not set a y-dimensional Eulerian rotation', () => {
      const result = OrbitalService.getEclipticGroupRotation(param);

      expect(typeof result.y).toBe('number');
      expect(result.y).toEqual(0);
    });
  });

  describe('getOrbitalGroupRotation()', () => {
    it('should return an Eulerian vector', () => {
      const result = OrbitalService.getOrbitalGroupRotation({
        argumentOfPeriapsis: 10
      });
      expect(result).toBeInstanceOf(Euler);
    });
  });

  describe('getBodyRotation()', () => {
    const param = {
      axialTilt: 10,
      arcRotate: 15,
      time: 0
    };

    it('should return an Eulerian vector', () => {
      const result = OrbitalService.getEclipticGroupRotation(param);
      expect(result).toBeInstanceOf(Euler);
    });

    it('should set the x Euler rotation param to axialTilt rotated 90 degrees counter-clockwise', () => {
      const x = Math.abs(90 - param.axialTilt);
      const result = OrbitalService.getBodyRotation(param);
      const expected = OrbitalService.toEuler({x});
      
      expect(typeof result.x).toBe('number');
      expect(result.x).toEqual(expected.x);
    });

    it('should set the y Euler rotation param to the rotation speed, in arcsecs, w.r.t. present time', () => {
      const y = Math2.arcSecToDeg(param.time, param.arcrotate);
      const result = OrbitalService.getBodyRotation(param);
      const expected = OrbitalService.toEuler({y});
      
      expect(typeof result.y).toBe('number');
      expect(result.y).toEqual(expected.y);
    });

    it('should omit the z Euler rotation param', () => {
      const z = 0;
      const result = OrbitalService.getBodyRotation(param);
      const expected = OrbitalService.toEuler({z});
      
      expect(typeof result.z).toBe('number');
      expect(result.z).toEqual(0);
    });
  });

  describe('getBodyPosition()', () => {
    it('should call getPosition() on the ellipse instance with periapses and time props', () => {
      const getPosition = jest.fn();
      const props = {
        time: 0,
        periapses: {}
      };
      const ellipse = {getPosition};
      const spy = jest.spyOn(ellipse, 'getPosition');

      OrbitalService.getBodyPosition(props, ellipse);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(props.time, props.periapses);
    });
  });

  describe('isInCameraView()', () => {
    it('should return a boolean', () => {
      const position = new Vector3();
      const camera = new Camera();
      const matrix = new Matrix4();

      const result = OrbitalService.isInCameraView(camera, matrix, position);

      expect(typeof result).toBe('boolean');
    });
  });

  describe('translateWorldToScreen()', () => {
    let result;
    const position = new Vector3();
    const camera = new Camera();

    it('should return an object with left and top properties', () => {
      const result = OrbitalService.translateWorldToScreen(position, camera);

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('top');
      expect(result).toHaveProperty('left');
      expect(typeof result.top).toBe('number');
      expect(typeof result.left).toBe('number');
    });

    it('should return null if the position vector is not in the camera frustum', () => {
      OrbitalService.isInCameraView = () => false;
      const result = OrbitalService.translateWorldToScreen(position, camera);
      expect(result).toBeNull();
    });

    it('should return null if position is undefined', () => {
      const result = OrbitalService.translateWorldToScreen(undefined, camera);
      expect(result).toBeNull();
    });

    it('should return null if camera is undefined', () => {
      const result = OrbitalService.translateWorldToScreen(position, undefined);
      expect(result).toBeNull();
    });
  });

  describe('getWorldPosition()', () => {
    it('should return the world position of the mesh, if defined', () => {
      const matrixWorld = new Matrix4();
      const mockMesh = {
        _reactInternalInstance: {
          _threeObject: {matrixWorld}
        }
      };
      const result = OrbitalService.getWorldPosition(mockMesh);

      expect(result).not.toBeNull();
      expect(result).toBeInstanceOf(Vector3);
    });

    it('should return null if the mesh is undefined', () => {
      const result = OrbitalService.getWorldPosition();
      expect(result).toBeNull();
    });
  });

  describe('toEuler()', () => {
    it('should return an Eulerian vector', () => {
      const result = OrbitalService.toEuler({});

      expect(result).toBeInstanceOf(Euler);
    });

    it('should convert a coordinate to radians if defined', () => {
      const spy = jest.spyOn(Math2, 'toRadians');
      const x = 5;

      OrbitalService.toEuler({x});
    
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(x);
    });

    it('should set undefined coordinates to zero', () => {
      const result = OrbitalService.toEuler({x: 5});
    
      expect(result.y).toEqual(0);
      expect(result.z).toEqual(0);
    });
  });
});
