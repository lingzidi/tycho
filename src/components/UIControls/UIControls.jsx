import React from 'react';
import ScaleSlider from '../Slider/ScaleSlider';
import ZoomSlider from '../Slider/ZoomSlider';
import DatePickerContainer from '../../containers/DatePickerContainer';
import Constants from '../../constants';

export default class UIControls extends React.Component {
  render() {
    return (
      <div className={`uicontrols--${this.props.modifier}`}>
        <div className="uicontrols__control uicontrols__control--scales">
          <ScaleSlider
            value={this.props.speed}
            label="Time speed: &times; 10^"
            onChange={this.props.changeSpeed}
            min={Constants.UI.Sliders.Speed.MIN}
            max={Constants.UI.Sliders.Speed.MAX}
          />
          <ScaleSlider
            value={this.props.scale}
            label="Planet scale: &times; "
            onChange={this.props.changeScale}
            min={Constants.UI.Sliders.Scale.MIN}
            max={Constants.UI.Sliders.Scale.MAX}
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
