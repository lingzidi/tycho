import React from 'react';
import {connect} from 'react-redux';
import ScaleSlider from '../components/Slider/ScaleSlider';
import ZoomSlider from '../components/Slider/ZoomSlider';
import * as Actions from '../actions/UIControlsActions';
import ReduxService from '../services/ReduxService';

export class UIControlsContainer extends React.Component {
  render() {
    return (
      <div>
        <div className="uicontrol uicontrol--scales">
          <ScaleSlider
            value={this.props.speed}
            label="Time speed:"
            onChange={this.props.action.changeSpeed}
          />
          <ScaleSlider
            value={this.props.scale}
            label="Planet scale:"
          />
        </div>

        <div className="uicontrol uicontrol--datetime">
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
  ReduxService.mapStateToProps('uiControls', 'speed', 'zoom'),
  ReduxService.mapDispatchToProps(Actions)
)(UIControlsContainer);
