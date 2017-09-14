import TourService from '../TourService';

const labels = [
  {
    duration: 5000,
    text: 'Welcome to the Solar System'
  },
  {
    duration: 5000,
    text: 'This is a real-time interactive simulation of major planetary bodies'
  },
  {
    duration: 3000,
    text: 'Let\'s start exploring'
  }
];

describe('Tour Service', () => {
  describe('getTourDuration()', () => {
    it('should return the total duration of the labels', () => {
      const result = TourService.getTourDuration(labels);

      expect(typeof result).toBe('number');
      expect(result).toEqual(18000);
    });
  });
});
