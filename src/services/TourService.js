import Cookies from 'js-cookie';

export default class TourService {

  /**
   * Determines if the user has opted, via cookie, to skip the tour.
   *
   * @returns {Boolean} ability to skip tour
   */
  static canSkip = () => {
    return Cookies.get('tourViewed') === 'true';
  }

  /**
   * Sets a cookie to indicate that the tour was either viewed or skipped.
   */
  static setSkip = () => {
    Cookies.set('tourViewed', 'true', {expires: 365});
  }

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
