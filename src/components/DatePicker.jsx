import React from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    
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

  getUXTime = (timeInstance) => {
    return timeInstance
      .format('MMM DD, YYYY h:mm a') // TODO: move to const
      .replace(/ /g, '\u00A0');
  }
  
  shouldComponentUpdate = () => {
    return !this.isOpen;
  }
  
  hidePicker = () => {
    this.isOpen = false;
  }
  
  showPicker = () => {
    const {picker} = this.refs;
    
    if (picker) {
      this.isOpen = true;
      picker.openCalendar();
    }
  }
  
  changeTime = (timeInstance) => {
    const time = timeInstance.unix();
    this.props.onUpdate(time);
  }
  
  render() {
    return (
      <div className="clock">
        <span
          className="clock__display"
          onClick={this.showPicker}>
          {this.state.uxTime}
        </span>
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
      </div>
    );
  }
}
