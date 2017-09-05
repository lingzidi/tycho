import React from 'react';
import PropTypes from 'prop-types';

class Label extends React.Component {

  static propTypes = {
    position: PropTypes.object,
    text: PropTypes.string.isRequired,
    active: PropTypes.bool
  }

  getPosition = (pos) => {
    if (pos) {
      return {
        position: 'absolute',
        top: `${pos.top}px`,
        left: `${pos.left}px`
      };
    }
    return null;
  }

  getChildren = (children, active) => {
    if (active) {
      return children;
    }
    return null;
  }
  
  render() {
    return (
      <div>
        <span style={this.getPosition(this.props.position)}>
          {this.props.text}
        </span>
        {this.getChildren(this.props.children, this.props.active)}
      </div>
    );
  }
}

export default Label;
