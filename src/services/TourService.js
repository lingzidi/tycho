export default class TourService {

  /**
   * Calculates the total time that showing labels will take,
   * separated and padded by the SEPARATION_INTERVAL constant.
   *
   * @param {Object[]} labels - list of labels to sum
   * @returns {Number} total duration
   */
  static getTourDuration = (labels) => {
    const SEPARATION_INTERVAL = 1000;

    let duration = SEPARATION_INTERVAL;
    
    duration += labels.reduce((cur, next) => {
      return cur + next.duration + SEPARATION_INTERVAL;
    }, 0);
    duration += SEPARATION_INTERVAL;

    return duration;
  }
}
