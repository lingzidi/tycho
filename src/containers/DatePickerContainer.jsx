import React from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';
import DatePicker from '../components/DatePicker';

export default class DatePickerContainer extends React.Component {

  componentWillMount = () => {
    this.state = {};
  }
  
  componentWillReceiveProps = () => {
    const {time} = this.props;
    const timeInstance = moment(time * 1000);
    const realTime = timeInstance.toDate();
    const uxTime = this.getUXTime(timeInstance);
    
    if (!this.isOpen) {
      this.setState({uxTime, realTime});
    }
  }

  shouldComponentUpdate = () => !this.isOpen

  /**
   * Formats given moment date to user-friendly time.
   *
   * @param {Moment} timeInstance - moment instance
   * @returns {String} user-friendly time
   */
  getUXTime = (timeInstance) => {
    return timeInstance
      .format('MMM DD, YYYY h:mm a') // TODO: move to const
      .replace(/ /g, '\u00A0');
  }

  /**
   * Closes the date picker.
   */
  hidePicker = () => {
    this.isOpen = false;
  }

  /**
   * Opens the date picker.
   */
  showPicker = () => {
    const {picker} = this.refs;
    
    if (picker) {
      this.isOpen = true;
      picker.openCalendar();
    }
  }

  /**
   * Calls the callback prop with the current UNIX timestamp.
   *
   * @param {Moment} timeInstance - moment instance
   */
  changeTime = (timeInstance) => {
    const time = timeInstance.unix();
    this.props.onUpdate(time);
  }
  
  render() {
    return (
      <DatePicker
        onClick={this.showPicker}
        uxTime={this.state.uxTime}>
        <Datetime
          value={this.state.realTime}
          ref="picker"
          className="clock__picker"
          onBlur={this.hidePicker}
          onChange={this.changeTime}
          closeOnSelect={true}
          inputProps={{
            className: 'clock__input'
          }}
        />
      </DatePicker>
    );
  }
}
