import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import * as UIControlsActions from '../actions/UIControlsActions';
import * as TourActions from '../actions/TourActions';
import * as LabelActions from '../actions/LabelActions';
import ReduxService from '../services/ReduxService';
import TourService from '../services/TourService';
import TourLabelContainer from './TourLabelContainer';
import Tour from '../components/Tour';
import Constants from '../constants';

export class TourContainer extends React.Component {

  static propTypes = {
    labels: PropTypes.array
  }

  componentDidMount = () => {
    if (TourService.canSkip()) {
      this.props.action.tourSkipped(true);
    } else {
      this.initializeTour();
    }
  }

  componentWillReceiveProps = ({isSkipped}) => {
    if (this.props.isSkipped !== isSkipped && isSkipped) {
      this.skipTour();
    }
  }

  /**
   * Initializes the tour.
   */
  initializeTour = () => {
    const {action, labels} = this.props;
    const tourDuration = TourService.getTourDuration(labels);

    action.setUIControls(false);
    action.setCameraOrbit(true);

    setTimeout(this.onOrbitComplete, tourDuration);
  }

  /**
   * Callback to invoke once the tour orbit has completed.
   */
  onOrbitComplete = () => {
    if (!this.props.isComplete) {
      this.setDefaultActiveOrbital();
      setTimeout(this.onTourComplete, Constants.Tour.TRANSITION_TIME);
    }
  }

  /**
   * Callback to invoke once the entire tour is completed.
   */
  onTourComplete = () => {
    this.props.action.tourCompleted(true);
  }

  /**
   * Skips the tour and zooms directly into the target planet.
   */
  skipTour = () => {
    const {action} = this.props;

    action.tourCompleted(true);
    action.setCameraOrbit(false);
    action.setUIControls(true);
    this.setDefaultActiveOrbital();
  }

  /**
   * Sets the active orbital targetName and the header label text to UI defaults.
   */
  setDefaultActiveOrbital = () => {
    this.props.action.setActiveOrbital(Constants.UI.ALTERNATE_TARGET_NAME);
    this.props.action.setActiveOrbital(Constants.UI.DEFAULT_TARGET_NAME);
    this.props.action.setLabelText(Constants.UI.DEFAULT_LABEL_TEXT);
  }

  /**
   * Sets the skip tour cookie and skips tour.
   */
  skipTourTrigger = () => {
    TourService.setSkip();
    this.skipTour();
  }
  
  /**
   * Maps the labels list prop to TourLabelContainers.
   *
   * @param {Object[]} labels - list of labels
   * @returns {TourLabelContainer[]}
   */
  getLabels = (labels) => {
    const separation = Constants.Tour.SEPARATION_INTERVAL;
    let totalTime = separation;
    
    return labels.map(({text, duration}, key) => {
      totalTime += separation;
      const start = totalTime;
      totalTime += duration;
      const end = totalTime;

      return (
        <TourLabelContainer
          key={key}
          text={text}
          start={start}
          end={end}
        />
      );
    });
  }

  /**
   * Returns class modifier based on prop state.
   *
   * @param {Object} props - component props
   * @returns {String} modifier
   */
  getModifier = ({isComplete, isSkipped}) => {
    if (isSkipped) {
      return 'skip';
    }
    return isComplete ? 'hide' : 'show';
  }

  render() {
    return (
      <Tour
        skipTour={this.skipTourTrigger}
        modifier={this.getModifier(this.props)}
        labels={this.getLabels(this.props.labels)}
      />
    );
  }
}

export default connect(
  ReduxService.mapStateToProps(
    'uiControls.controlsEnabled',
    'uiControls.scale',
    'label.targetName',
    'tour.isComplete',
    'tour.isSkipped'
  ),
  ReduxService.mapDispatchToProps(
    UIControlsActions,
    TourActions,
    LabelActions
  )
)(TourContainer);
