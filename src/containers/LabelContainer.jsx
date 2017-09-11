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
    id: PropTypes.string.isRequired,
    active: PropTypes.bool
  }

  getPosition = (pos) => {
    if (pos) {
      return {
        position: 'absolute',
        top: `${pos.top}px`,
        left: `${pos.left}px`
      };
    }
    return null;
  }

  getChildren = (children, active) => {
    if (active) {
      return children;
    }
    return null;
  }

  setActiveOrbital = () => {
    this.props.action.setActiveOrbital(this.props.id);
  }

  setHighlightedOrbital = () => {
    this.props.action.setHighlightedOrbital(this.props.id);
  }
  
  render() {
    return (
      <Label
        style={this.getPosition(this.props.position)}
        onClick={this.setActiveOrbital}
        onHover={this.setHighlightedOrbital}
        active={this.props.active}
        text="Test Thing">
        {this.getChildren(this.props.children, this.props.active)}
      </Label>
    );
  }
}

export default connect(
  ReduxService.mapStateToProps(
    'viewer.activePlanet'
  ),
  ReduxService.mapDispatchToProps(Actions)
)(LabelContainer);
