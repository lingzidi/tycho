import React from 'react';
import {connect} from 'react-redux';
import ScaleSlider from '../components/Slider/ScaleSlider';
import ZoomSlider from '../components/Slider/ZoomSlider';
import DatePicker from '../components/DatePicker';
import * as Actions from '../actions/UIControlsActions';
import ReduxService from '../services/ReduxService';

export class UIControlsContainer extends React.Component {
  /**
   * Returns class modifier based on global controlsEnabled state.
   *
   * @return {String} CSS BEM modifier name
   */
  getClassModifier = () => {
    if (this.props.controlsEnabled) {
      return 'enabled';
    }
    return 'disabled';
  }

  render() {
    return (
      <div className={`uicontrols--${this.getClassModifier()}`}>
        <div className="uicontrols__control uicontrols__control--scales">
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

        <div className="uicontrols__control uicontrols__control--datetime">
          <DatePicker 
            time={this.props.time} 
            onUpdate={this.props.action.changeTimeOffset}
          />
        </div>

        <div className="uicontrols__control uicontrols__control--left-bar"> 
          <div className="uicontrols__button"></div>
          <ZoomSlider
            value={this.props.zoom}
            onChange={this.props.action.changeZoom}
          />
          <div className="uicontrols__button"></div>
        </div>
      </div>
    );
  }
}

export default connect(
  ReduxService.mapStateToProps(
    'uiControls.speed',
    'uiControls.zoom',
    'uiControls.scale',
    'uiControls.controlsEnabled'
  ),
  ReduxService.mapDispatchToProps(Actions)
)(UIControlsContainer);
