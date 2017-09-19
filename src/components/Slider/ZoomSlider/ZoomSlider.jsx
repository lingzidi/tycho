import React from 'react';
import Slider from '../Slider';
import PropTypes from 'prop-types';

export default class ZoomSlider extends React.Component {

  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func
  }

  render() {
    return (
      <div className="slider slider--vertical">
        <Slider
          orientation="vertical"
          invert={true}
          step={1}
          min={1}
          max={100}
          value={this.props.value || 100}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}
