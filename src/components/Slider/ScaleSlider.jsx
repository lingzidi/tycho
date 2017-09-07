import React from 'react';
import Slider from './Slider';

export default class ScaleSlider extends React.Component {
  render() {
    return (
      <div>
        <div className="slider slider--horizontal">
          <span className="slider__label">
            <span>{this.props.label}: &times; 10</span>
            <sup>{this.props.value}</sup>
          </span>
          <Slider
            orientation="horizontal"
            value={this.props.value}
            onChange={this.props.onChange}
            min={0}
            max={10}
          />
        </div>
      </div>
    );
  }
}
