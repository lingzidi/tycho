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

  describe('setLabelText()', () => {
    it('should be of type SET_LABEL_TEXT with the setLabelText payload', () => {
      const labelText = 'Mars';
      const result = Actions.setLabelText(labelText);
      
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('labelText');
      expect(result.type).toEqual(ActionType.SET_LABEL_TEXT);
      expect(result.labelText).toEqual(labelText);
    });
  });

  describe('setHighlightedOrbital()', () => {
    it('should be of type SET_HIGHLIGHTED_ORBITAL with the highlightedOrbital payload', () => {
      const highlightedOrbital = 'Mars';
      const result = Actions.setHighlightedOrbital(highlightedOrbital);
      
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('highlightedOrbital');
      expect(result.type).toEqual(ActionType.SET_HIGHLIGHTED_ORBITAL);
      expect(result.highlightedOrbital).toEqual(highlightedOrbital);
    });
  });
});
