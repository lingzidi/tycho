import React from 'react';
import {connect} from 'react-redux';
import * as UIControlsActions from '../actions/UIControlsActions';
import * as TourActions from '../actions/TourActions';
import * as LabelActions from '../actions/LabelActions';
import ReduxService from '../services/ReduxService';
import TourService from '../services/TourService';
import TourLabelContainer from './TourLabelContainer';
import Tour from '../components/Tour';

export class TourContainer extends React.Component {

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
   * Initlaizes the tour.
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
    this.props.action.setActiveOrbital('dummyParent');

    setTimeout(this.onTourComplete, 5000);
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

    TourService.setSkip();

    action.tourCompleted(true);
    action.setCameraOrbit(false);
    action.setUIControls(true);
    action.setActiveOrbital('dummyParent'); // TODO
  }
  
  /**
   * Maps the labels list prop to TourLabelContainers.
   *
   * @param {Object[]} labels - list of labels
   * @returns {TourLabelContainer[]}
   */
  getLabels = (labels) => {
    const SEPARATION_INTERVAL = 1000;
    let totalTime = SEPARATION_INTERVAL;
    
    return labels.map(({text, duration}, key) => {
      totalTime += SEPARATION_INTERVAL;
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
        skipTour={this.skipTour}
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
