import React from 'react';
import {connect} from 'react-redux';
import ScaleSlider from '../components/Slider/ScaleSlider';
import ZoomSlider from '../components/Slider/ZoomSlider';
import DatePicker from '../components/DatePicker';
import * as Actions from '../actions/UIControlsActions';
import ReduxService from '../services/ReduxService';

export class UIControlsContainer extends React.Component {
  render() {
    return (
      <div>
        <div className="uicontrol uicontrol--scales">
          <ScaleSlider
            value={this.props.speed}
            label="Time speed: &times; 10^"
            onChange={this.props.action.changeSpeed}
            min={0}
            max={10}
          />
          <ScaleSlider
            value={this.props.scale}
            label="Planet scale: &times; "
            onChange={this.props.action.changeScale}
            min={1}
            max={10}
          />
        </div>

        <div className="uicontrol uicontrol--datetime">
          <DatePicker 
            time={this.props.time} 
            onUpdate={this.props.action.changeTimeOffset}
          />
        </div>

        <div className="uicontrol uicontrol--left-bar"> 
          <div className="uicontrol__button"></div>
          <ZoomSlider
            value={this.props.zoom}
            onChange={this.props.action.changeZoom}
          />
          <div className="uicontrol__button"></div>
        </div>
      </div>
    );
  }
}

export default connect(
  ReduxService.mapStateToProps(
    'uiControls.speed',
    'uiControls.zoom',
    'uiControls.scale'
  ),
  ReduxService.mapDispatchToProps(Actions)
)(UIControlsContainer);
