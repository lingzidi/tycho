import * as Actions from '../UIControlsActions';
import ActionType from '../../constants/Actions';

describe('UIControls Actions', () => {
  describe('changeZoom()', () => {
    it('should be of type ZOOM_CHANGE with the zoom payload', () => {
      const zoom = 10;
      const result = Actions.changeZoom(zoom);
      
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('zoom');
      expect(result.type).toEqual(ActionType.ZOOM_CHANGE);
      expect(result.zoom).toEqual(zoom);
    });
  });

  describe('changeSpeed()', () => {
    it('should be of type SPEED_CHANGE with the speed payload', () => {
      const speed = 10;
      const result = Actions.changeSpeed(speed);
      
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('speed');
      expect(result.type).toEqual(ActionType.SPEED_CHANGE);
      expect(result.speed).toEqual(speed);
    });
  });

  describe('changeScale()', () => {
    it('should be of type SCALE_CHANGE with the speed payload', () => {
      const scale = 5;
      const result = Actions.changeScale(scale);
      
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('scale');
      expect(result.type).toEqual(ActionType.SCALE_CHANGE);
      expect(result.scale).toEqual(scale);
    });
  });

  describe('changeTimeOffset()', () => {
    it('should be of type TIME_OFFSET_CHANGE with the speed payload', () => {
      const timeOffset = 12345;
      const result = Actions.changeTimeOffset(timeOffset);
      
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('timeOffset');
      expect(result.type).toEqual(ActionType.TIME_OFFSET_CHANGE);
      expect(result.timeOffset).toEqual(timeOffset);
    });
  });

  describe('setUIControls()', () => {
    it('should be of type SET_UI_CONTROLS with the controlsEnabled payload', () => {
      const controlsEnabled = true;
      const result = Actions.setUIControls(controlsEnabled);
      
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('controlsEnabled');
      expect(result.type).toEqual(ActionType.SET_UI_CONTROLS);
      expect(result.controlsEnabled).toEqual(controlsEnabled);
    });
  });
});
