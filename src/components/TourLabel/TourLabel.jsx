import React from 'react';

export default class TourLabel extends React.Component {
  render() {
    return (
      <div className="tour-label">
        <span className={`
          tour-label__text
          tour-label__text--${this.props.modifier}`
        }>
          {this.props.text}
        </span>
      </div>
    );
  }
}

