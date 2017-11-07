import {Euler, Matrix4, Vector3, Camera} from 'three';
import OrbitalService from '../OrbitalService';
import Constants from '../../constants';
import Math2 from '../Math2';
import fixture from './__fixtures__/planets.json';

describe('Orbital Service', () => {

  afterEach(() => jest.resetAllMocks());

  describe('getEclipticGroupRotation()', () => {
    let params = {
      inclination: 10,
      longitudeOfAscendingNode: 15
    };

    describe('when the object is not a satellite', () => {
      beforeEach(() => {
        params.isSatellite = false;
      });

      it('should set the x-dimensional rotation to the ascension vector', () => {
        const result = OrbitalService.getEclipticGroupRotation(params);

        expect(typeof result.x).toBe('number');
        expect(result.x).toEqual(-Math.PI / 2);
      });

      it('should return an Eulerian vector', () => {
        const result = OrbitalService.getEclipticGroupRotation(params);
        expect(result).toBeInstanceOf(Euler);
      });

      it('should not set a y-dimensional Eulerian rotation', () => {
        const result = OrbitalService.getEclipticGroupRotation(params);

        expect(typeof result.y).toBe('number');
        expect(result.y).toEqual(0);
      });
    });

    describe('when the object is not a satellite', () => {
      it('should set the x-dimensional rotation to the ascension vector', () => {
        params.isSatellite = true;
        const result = OrbitalService.getEclipticGroupRotation(params);

        expect(typeof result.x).toBe('number');
        expect(result.x).toEqual(0);
      });
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
      const x = param.axialTilt;
      const result = OrbitalService.getBodyRotation(param);
      const expected = OrbitalService.toEuler({x});
      
      expect(typeof result.x).toBe('number');
      expect(result.x).toEqual(expected.x);
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

  describe('getPathOpacity()', () => {
    it('should return the ON opacity if active', () => {
      expect(OrbitalService.getPathOpacity(true)).toEqual(Constants.UI.HOVER_OPACITY_ON);
    });

    it('should return the OFF opacity if inactive', () => {
      expect(OrbitalService.getPathOpacity(false)).toEqual(Constants.UI.HOVER_OPACITY_OFF);
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
      expect(typeof result).toEqual('object');
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

  describe('getDistanceToSun()', () => {
    it('should return 0 if positions is not defined', () => {
      const result = OrbitalService.getDistanceToSun();

      expect(typeof result).toBe('number');
      expect(result).toEqual(0);
    });

    it('should return 0 if the position of the targetName was not found', () => {
      const result = OrbitalService.getDistanceToSun({Earth: {}}, 'Mars');

      expect(typeof result).toBe('number');
      expect(result).toEqual(0);
    });

    it('should return the magnitude of the current position', () => {
      const targetName = 'Earth';
      const position3d = {x: 1, y: 2, z: 3};
      const result = OrbitalService.getDistanceToSun({[targetName]: {position3d}}, targetName);
    
      expect(typeof result).toBe('number');
      expect(result).toEqual(3741657.386773941);
    });
  });

  describe('getTargetByName()', () => {
    it('should return a planet\'s radius', () => {
      expect(OrbitalService.getTargetByName(fixture, 'Earth')).toEqual(fixture[1]);
    });

    it('should return a satellite\'s radius', () => {
      expect(OrbitalService.getTargetByName(fixture, 'Moon')).toEqual(fixture[1].satellites[0]);
    });

    it('should return a mid-entry list item radius', () => {
      expect(OrbitalService.getTargetByName(fixture, 'Mars')).toEqual(fixture[0]);
    });
  });
});
