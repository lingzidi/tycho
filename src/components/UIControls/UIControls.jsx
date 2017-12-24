import React from 'react';
import cx from 'classnames';
import Settings from '../Settings';
import ZoomSlider from '../Slider/ZoomSlider';
import DatePickerContainer from '../../containers/DatePickerContainer';
import Constants from '../../constants';

export default class UIControls extends React.Component {
  render() {
    return (
      <div className={cx({
        'uicontrols': true,
        'uicontrols--enabled': this.props.controlsEnabled,
        'uicontrols--disabled': !this.props.controlsEnabled,
      })}>
        <div className="uicontrols__control uicontrols__control--scales">
          <Settings {...this.props} />
        </div>

        <div className="uicontrols__control uicontrols__control--target-label">
          <span
            className="uicontrols__control uicontrols__control--modal-opener"
            onClick={this.props.openModal.bind(this, Constants.UI.ModalTypes.STATS_MODAL)}>
            {this.props.targetName}
          </span>
        </div>

        <div className="uicontrols__control uicontrols__control--datetime">
          <DatePickerContainer 
            time={this.props.time} 
            onUpdate={this.props.changeTimeOffset}
          />
        </div>

        <div className="uicontrols__control uicontrols__control--left-bar"> 
          <div
            className="uicontrols__button uicontrols__button--about"
            onClick={this.props.openModal.bind(this, Constants.UI.ModalTypes.ABOUT_MODAL)}>
          </div>
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
