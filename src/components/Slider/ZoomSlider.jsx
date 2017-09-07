import React from 'react';
import Slider from './Slider';

export default class ZoomSlider extends React.Component {
  render() {
    return (
      <div className="slider slider--vertical">
        <Slider
          orientation="vertical"
          step={1}
          min={1}
          max={300}
          value={this.props.value}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}
