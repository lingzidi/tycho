import moment from 'moment';

export class TimepickerController {

  timeFormat = 'YYYY-MM-DD HH:mm:ss';

  constructor($rootScope, scope) {
    this.scope = scope;
    this.scene = $rootScope.scene;
    this.scene.tick(this.tick);

    scope.$watch('timepicker.editableTime', this.onChange);
  }

  /**
   * Sets flag if user made a change to the picker.
   */
  onChange = () => {
    this.changed = this.editableTime !== this.savedTime;
  }

  /**
   * Updates the scene clock offset if user changed time.
   */
  changeTime = () => {
    if(this.changed && !this.isPickerOpen()) {
      this.scene.clock.setOffset(
        this.getUnixTime()
      );
      this.savedTime = this.editableTime;
      this.changed = false;
    }
  }

  /**
   * Updates time parameters.
   * @param  {Number} time - current UNIX time
   */
  tick = (time) => {
    this.currentUnixTime = time;
    this.changeTime();
    this.scope.$apply();
  }

  /**
   * Returns the editable time in UNIX.
   * @return {Number}
   */
  getUnixTime = () => {
    return moment(
      this.editableTime, this.timeFormat
    ).unix();
  }

  /**
   * Returns formatted current scene time.
   * @return {String} YYYY-MM-DD HH:mm:ss
   */
  getFormattedTime = () => {
    return moment(this.currentUnixTime * 1000)
      .format(this.timeFormat);
  }

  /**
   * Returns true if calendar picker is open.
   * @return {Boolean}
   */
  isPickerOpen = () => {
    return angular
      .element(
        document.querySelector('.angularjs-datetime-picker')
      )
      .length;
  }

  /**
   * Opens the timepicker with current scene time.
   */
  openPicker = () => {
    setTimeout(() => {
      this.editableTime = this.getFormattedTime(); 
      this.savedTime    = this.getFormattedTime();

      angular
        .element(
          document.querySelector('#timepicker')
        )
        .click();
    });
  }
}

TimepickerController.$inject = ['$rootScope', '$scope'];