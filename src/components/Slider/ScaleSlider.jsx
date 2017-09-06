import React from 'react';
import Slider from './Slider';

export default class ScaleSlider extends React.Component {
  render() {
    return (
      <div>
        <div className="slider slider--horizontal">
          <span className="slider__label">
            {this.props.label}
          </span>
          <Slider
            orientation="horizontal"
            step={10}
            value={this.props.value}
          />
        </div>
      </div>
    );
  }
}
