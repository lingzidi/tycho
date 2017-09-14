import React from 'react';
import {connect} from 'react-redux';
import * as UIControlsActions from '../actions/UIControlsActions';
import * as TourActions from '../actions/TourActions';
import * as LabelActions from '../actions/LabelActions';
import ReduxService from '../services/ReduxService';
import TourService from '../services/TourService';
import TourLabelContainer from './TourLabelContainer';
import SpinLabelContainer from '../containers/SpinLabelContainer';

export class TourContainer extends React.Component {

  componentDidMount = () => {
    const {action, labels} = this.props;
    const tourDuration = TourService.getTourDuration(labels);

    action.setUIControls(false);
    action.setCameraOrbit(true);

    setTimeout(this.onOrbitComplete, tourDuration);
  }

  componentWillReceiveProps = ({isSkipped}) => {
    if (this.props.isSkipped !== isSkipped && isSkipped) {
      this.skipTour();
    }
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

    action.tourCompleted(true);
    action.setCameraOrbit(false);
    action.setActiveOrbital('dummyParent'); // TODO
  }

  /**
   * Update the state to skip the tour.
   */
  triggerSkipTour = () => {
    this.props.action.tourSkipped(true);
  }
  
  /**
   * Maps the labels list prop to TourLabelContainers.
   *
   * @param {Object[]} labels - list of labels
   * @returns {TourLabelContainer[]}
   */
  getLabels = (labels) => {
    let totalTime = 0;
    const SEPARATION_INTERVAL = 1000;
    
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

  render() {
    const modifier = this.props.isComplete ? 'hide' : 'show';
    return (
      <div>
        <div className={`tour tour--${modifier}`}>
          <div
            className={`tour__theater-bar tour__theater-bar--${modifier}`}
            style={{top: 0}}>
          </div>
          <div className="tour__labels">
						{this.getLabels(this.props.labels)}
					</div>
          <div
            className={`tour__theater-bar tour__theater-bar--${modifier}`}
            style={{bottom: 0}}>
            <span
              className="tour__skip-link"
              onClick={this.skipTour}>
              Skip Tour
            </span>
          </div>
				</div>
        <SpinLabelContainer />
      </div>
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
