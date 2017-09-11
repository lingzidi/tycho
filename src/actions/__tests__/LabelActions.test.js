import * as Actions from '../LabelActions';
import ActionType from '../../constants/Actions';

describe('Label Actions', () => {
  describe('setActiveOrbital()', () => {
    it('should be of type SET_ACTIVE_ORBITAL with the targetName payload', () => {
      const targetName = 'Mars';
      const result = Actions.setActiveOrbital(targetName);
      
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('targetName');
      expect(result.type).toEqual(ActionType.SET_ACTIVE_ORBITAL);
      expect(result.targetName).toEqual(targetName);
    });
  });
});
