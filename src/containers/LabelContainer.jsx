import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import * as Actions from '../actions/LabelActions';
import ReduxService from '../services/ReduxService';
import Label from '../components/Label';
import Constants from '../constants';

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
    this.props.action.setLabelText(this.props.text);
  }

  /**
   * Sets the currently-highlighted orbital path.
   */
  setHighlightedOrbital = () => {
    this.props.action.setHighlightedOrbital(this.props.id);
  }

  /**
   * Removes the currently-highlighted orbital path.
   */
  removeHighlightedOrbital = () => {
    this.props.action.setHighlightedOrbital(null);
  }

  /**
   * Determine if the current label is active or not.
   *
   * @returns {Boolean} state of label
   */
  isActive = () => {
    const {targetName, id, zoom} = this.props;
    return targetName === id && zoom <= Constants.UI.ZOOM_LABEL_TRIGGER;
  }

  /**
   * Returns the position of the id, if any defined.
   *
   * @returns {Object} 2d position of object
   */
  getPosition = () => {
    const {positions, id} = this.props;

    if (positions && positions[id]) {
      return positions[id].position2d;
    }
  }
  
  render() {
    return (
      <Label
        position={this.getPosition()}
        onClick={this.setActiveOrbital}
        onMouseOver={this.setHighlightedOrbital}
        onMouseOut={this.removeHighlightedOrbital}
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
    'uiControls.controlsEnabled',
    'animation.positions'
  ),
  ReduxService.mapDispatchToProps(Actions)
)(LabelContainer);
