import React from 'react';
import {connect} from 'react-redux';
import SpinLabel from '../components/SpinLabel';
import ReduxService from '../services/ReduxService';

export class SpinLabelContainer extends React.Component {

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
        count={4}
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
