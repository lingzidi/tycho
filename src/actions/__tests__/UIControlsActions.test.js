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

});
