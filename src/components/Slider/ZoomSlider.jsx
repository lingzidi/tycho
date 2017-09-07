import React from 'react';
import Slider from './Slider';

export default class ZoomSlider extends React.Component {
  render() {
    return (
      <div className="slider slider--vertical">
        <Slider
          orientation="vertical"
          invert={true}
          step={1}
          min={1}
          max={100}
          value={this.props.value}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}
