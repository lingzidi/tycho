import React from 'react';
import PropTypes from 'prop-types';

export default class Label extends React.Component {

  static propTypes = {
    position: PropTypes.object,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    active: PropTypes.bool
  }
  
  render() {
    return (
      <div>
        <span
          className="label"
          style={this.props.position}
          onClick={this.props.onClick}>
          {!this.props.active && this.props.text}
        </span>
        {this.props.active && this.props.children}
      </div>
    );
  }
}
