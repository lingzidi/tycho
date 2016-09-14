import moment from 'moment';

export class TimepickerController {

  timeFormat = 'YYYY-MM-DD HH:mm:ss';

  constructor($rootScope, scope) {
    this.scope = scope;
    this.scene = $rootScope.scene;
    this.scene.tick(this.tick);
  }

  openCalendar = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.isOpen = true;
  }

  /**
   * Updates the scene clock offset.
   * Should be used as the callback for whenChanged
   */
  changeTime = () => {
    this.scope.scene.clock
      .setOffset(this.getUnixTime());
  }

  /**
   * Updates time parameters.
   * @param  {Number} time - current UNIX time
   */
  tick = (time) => {
    this.currentUnixTime = time;
    this.setUXTime(time);
  }

  /**
   * Returns the editable time in UNIX.
   * @return {Number}
   */
  getUnixTime = () => {
    return moment(this.uxTime, this.timeFormat)
      .unix();
  }

  /**
   * Sets the converted UNIX microtime to UX-friendly time.
   * @param  {Number} unix microtime
   */
  setUXTime = (time) => {
    if(!this.isOpen) {
      this.uxTime = moment(this.currentUnixTime * 1000)
        .format(this.timeFormat);
      this.scope.$apply();
    }
  }
}

TimepickerController.$inject = ['$rootScope', '$scope'];