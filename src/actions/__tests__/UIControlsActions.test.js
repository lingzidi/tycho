import * as Actions from '../UIControlsActions';

describe('UIControls Actions', () => {
  describe('changeZoom()', () => {
    it('should be of type ZOOM_CHANGE with the zoom payload', () => {
      const zoom = 10;
      const result = Actions.changeZoom(zoom);
      
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('zoom');
      expect(result.type).toEqual('ZOOM_CHANGE');
      expect(result.zoom).toEqual(zoom);
    });
  });

  describe('changeSpeed()', () => {
    it('should be of type SPEED_CHANGE with the speed payload', () => {
      const speed = 10;
      const result = Actions.changeSpeed(speed);
      
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('speed');
      expect(result.type).toEqual('SPEED_CHANGE');
      expect(result.speed).toEqual(speed);
    });
  });

  describe('changeScale()', () => {
    it('should be of type SCALE_CHANGE with the speed payload', () => {
      const scale = 5;
      const result = Actions.changeScale(scale);
      
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('scale');
      expect(result.type).toEqual('SCALE_CHANGE');
      expect(result.scale).toEqual(scale);
    });
  });

  describe('changeTimeOffset()', () => {
    it('should be of type TIME_OFFSET_CHANGE with the speed payload', () => {
      const timeOffset = 12345;
      const result = Actions.changeTimeOffset(timeOffset);
      
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('timeOffset');
      expect(result.type).toEqual('TIME_OFFSET_CHANGE');
      expect(result.timeOffset).toEqual(timeOffset);
    });
  });
});
