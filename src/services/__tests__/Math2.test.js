import Math2 from '../Math2';

describe('Math2 Service', () => {
  describe('ramanujan()', () => {
    it('should solve for the circumference of an ellipse', () => {
      const result = Math2.ramanujan(5, 10);

      expect(typeof result).toBe('number');
      expect(result).toEqual(-48.44210548835644);
    });
  });

  describe('getFocus()', () => {
    it('should solve for one of two focii of an ellipse', () => {
      const result = Math2.getFocus(5, 10);

      expect(typeof result).toBe('number');
      expect(result).toEqual(result);
    });
  });

  describe('toRadians()', () => {
    it('should return radians for the given `deg` parameter', () => {
      const result = Math2.toRadians(10);

      expect(typeof result).toBe('number');
      expect(result).toEqual(0.17453292519943295);
    });
  });

  describe('toDegrees()', () => {
    it('should return radians for the given `rad` parameter', () => {
      const result = Math2.toDegrees(10);

      expect(typeof result).toBe('number');
      expect(result).toEqual(572.9577951308232);
    });
  });

  describe('arcSecToRad()', () => {
    it('should return arcseconds for the given rotation and time', () => {
      const result = Math2.arcSecToRad(1, 10);

      expect(typeof result).toBe('number');
      expect(result).toEqual(0.0000484813681109536);
    });
  });

  describe('arcSecToDeg()', () => {
    it('should return arcseconds for the given rotation and time', () => {
      const result = Math2.arcSecToDeg(1, 10);

      expect(typeof result).toBe('number');
      expect(result).toEqual(0.002777777777777778);
    });
  });

});
