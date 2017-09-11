import React from 'react';
import PropTypes from 'prop-types';

export default class Label extends React.Component {

  static propTypes = {
    style: PropTypes.object,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    active: PropTypes.bool
  }
  
  render() {
    return (
      <div>
        <span
          style={this.props.style}
          onClick={this.props.onClick}>
          {this.props.text}
        </span>
        {this.props.children}
      </div>
    );
  }
}
