import React from 'react';
import ScaleSlider from '../Slider/ScaleSlider';
import ZoomSlider from '../Slider/ZoomSlider';
import DatePickerContainer from '../../containers/DatePickerContainer';

export default class UIControls extends React.Component {
  render() {
    return (
      <div className={`uicontrols--${this.props.modifier}`}>
        <div className="uicontrols__control uicontrols__control--scales">
          <ScaleSlider
            value={this.props.speed}
            label="Time speed: &times; 10^"
            onChange={this.props.changeSpeed}
            min={0}
            max={10}
          />
          <ScaleSlider
            value={this.props.scale}
            label="Planet scale: &times; "
            onChange={this.props.changeScale}
            min={1}
            max={10}
          />
        </div>

        <div className="uicontrols__control uicontrols__control--datetime">
          <DatePickerContainer 
            time={this.props.time} 
            onUpdate={this.props.changeTimeOffset}
          />
        </div>

        <div className="uicontrols__control uicontrols__control--left-bar"> 
          <div className="uicontrols__button"></div>
          <ZoomSlider
            value={this.props.zoom}
            onChange={this.props.changeZoom}
          />
          <div className="uicontrols__button"></div>
        </div>
      </div>
    );
  }
}
