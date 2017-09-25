import * as Actions from '../AnimationActions';
import ActionType from '../../constants/Actions';

describe('Animation Actions', () => {
  describe('setPosition()', () => {
    it('should be of type SET_POSITION with the position and id payload', () => {
      const id = 'Earth';
      const position = {x: 1, y: 2, z: 3};
      const result = Actions.setPosition(position, id);
      
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('position');
      expect(result.type).toEqual(ActionType.SET_POSITION);
      expect(result.id).toEqual(id);
      expect(result.position).toEqual(position);
    });
  });

  describe('setTime()', () => {
    it('should be of type SET_TIME with the time payload', () => {
      const time = 1;
      const result = Actions.setTime(time);
      
      expect(result).toHaveProperty('time');
      expect(result.type).toEqual(ActionType.SET_TIME);
      expect(result.time).toEqual(time);
    });
  });
});
 
