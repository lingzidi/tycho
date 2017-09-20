import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import SpinLabel from '../components/SpinLabel';
import ReduxService from '../services/ReduxService';
import Constants from '../constants';

export class SpinLabelContainer extends React.Component {

  static propTypes = {
    isComplete: PropTypes.bool,
    isAutoOrbitEnabled: PropTypes.bool
  }

  /**
   * Calculate visibility of label based on props.
   *
   * @returns {Boolean} visibility of label
   */
  isVisible = () => {
    const {isComplete, isAutoOrbitEnabled} = this.props;
    return isComplete && isAutoOrbitEnabled;
  }

  render() {
    return (
      <SpinLabel
        show={this.isVisible()}
        count={Constants.UI.SPIN_LABEL_ARROW_COUNT}
      />
    );
  }
}

export default connect(
  ReduxService.mapStateToProps(
    'tour.isComplete',
    'tour.isAutoOrbitEnabled'
  ),
  null  
)(SpinLabelContainer);
