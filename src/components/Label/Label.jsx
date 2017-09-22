import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Label extends React.Component {

  static propTypes = {
    position: PropTypes.object,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    active: PropTypes.bool,
    enabled: PropTypes.bool
  }
  
  render() {
    return (
      <div className={classNames({
        'label--show': this.props.enabled,
        'label--hide': !this.props.enabled,
      })}>
      <span
        className="label__text"
        style={this.props.position}
        onClick={this.props.onClick}>
        {!this.props.active && this.props.text}
      </span>
      {this.props.active && this.props.children}
    </div>
    );
  }
}
