import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import * as Actions from '../actions/UIControlsActions';
import ReduxService from '../services/ReduxService';
import UIControls from '../components/UIControls';

export class UIControlsContainer extends React.Component {

  static propTypes = {
    time: PropTypes.number
  }

  /**
   * Toggles the settings pane.
   */
  toggleSettings = () => {
    this.props.action.toggleSettings(!this.props.settingsActive);
  }

  /**
   * Opens the modal and hides the controls
   */
  openModal = () => {
    this.props.action.toggleModal(true);
    this.props.action.setUIControls(false);
  }

  render() {
    return (
      <UIControls
        openModal={this.openModal}
        toggleSetting={this.toggleSettings}
        {...this.props}
        {...this.props.action}
      />
    );
  }
}

export default connect(
  ReduxService.mapStateToProps(
    'uiControls.speed',
    'uiControls.zoom',
    'uiControls.scale',
    'uiControls.controlsEnabled',
    'uiControls.settingsActive',
    'data.labelText',
    'data.pageText',
    'animation.time'
  ),
  ReduxService.mapDispatchToProps(Actions)
)(UIControlsContainer);
