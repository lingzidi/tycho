import React from 'react';
import {connect} from 'react-redux';
import * as Actions from '../actions/UIControlsActions';
import ReduxService from '../services/ReduxService';
import UIControls from '../components/UIControls';

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
      <UIControls
        modifier={this.getClassModifier()}
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
    'uiControls.controlsEnabled'
  ),
  ReduxService.mapDispatchToProps(Actions)
)(UIControlsContainer);
