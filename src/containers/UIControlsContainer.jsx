import React from 'react';
import ScaleSlider from '../components/Slider/ScaleSlider';
import ZoomSlider from '../components/Slider/ZoomSlider';

export default class UIControlsContainer extends React.Component {
  render() {
    return (
      <div>
        <div className="uicontrol uicontrol--scales">
          <ScaleSlider value={this.props.time} label="Time speed:" />
          <ScaleSlider value={this.props.speed} label="Planet scale:" />
        </div>

        <div className="uicontrol uicontrol--datetime">
        </div>

        <div className="uicontrol uicontrol--left-bar">
          <div className="uicontrol__button"></div>
          <ZoomSlider value={this.props.zoom} />
          <div className="uicontrol__button"></div>
        </div>
      </div>
    );
  }
}
