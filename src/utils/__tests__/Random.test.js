import Random from '../Random';

describe('Random Number Generator', () => {
  it('should be a number', () => {
    expect(typeof Random()).toBe('number');
  });
});
