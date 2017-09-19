import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import * as Actions from '../actions/LabelActions';
import ReduxService from '../services/ReduxService';
import Label from '../components/Label';

export class LabelContainer extends React.Component {

  static propTypes = {
    position: PropTypes.object,
    text: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
  }

  /**
   * Sets the targetName global state.
   */
  setActiveOrbital = () => {
    this.props.action.setActiveOrbital(this.props.id);
  }

  /**
   * Sets the currently-highlighted orbital path.
   */
  setHighlightedOrbital = () => {
    this.props.action.setHighlightedOrbital(this.props.id);
  }

  /**
   * Determine if the current label is active or not.
   *
   * @returns {Boolean} state of label
   */
  isActive = () => {
    const {targetName, id, zoom} = this.props;
    return targetName === id && zoom <= 25; // TODO: 25 = const
  }
  
  render() {
    return (
      <Label
        position={this.props.position}
        onClick={this.setActiveOrbital}
        onHover={this.setHighlightedOrbital}
        active={this.isActive()}
        enabled={this.props.controlsEnabled}
        text={this.props.text}>
        {this.props.children}
      </Label>
    );
  }
}

export default connect(
  ReduxService.mapStateToProps(
    'label.targetName',
    'uiControls.zoom',
    'uiControls.controlsEnabled'
  ),
  ReduxService.mapDispatchToProps(Actions)
)(LabelContainer);
