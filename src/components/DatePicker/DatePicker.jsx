import React from 'react';

export default class DatePicker extends React.Component {
  render() {
    return (
      <div className="clock">
        <span
          className="clock__display"
          onClick={this.props.onClick}>
          {this.props.uxTime}
        </span>
        {this.props.children}
      </div>
    );
  }
}
