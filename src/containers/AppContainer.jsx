import React from 'react';
import {connect} from 'react-redux';
import Clock from '../utils/Clock';
import ReduxService from '../services/ReduxService';
import App from '../components/App';
import SplashScreen from '../components/SplashScreen';
import * as DataActions from '../actions/DataActions';
import * as AnimationActions from '../actions/AnimationActions';

export class AppContainer extends React.Component {

  componentWillMount = () => {
    this.props.action.requestOrbitalData();
    this.props.action.requestPageText();
    this.clock = new Clock();
    this.lastTime = 0;
    this.state = {};
  }

  componentWillReceiveProps = (nextProps) => {
    this.maybeUpdateOffset(nextProps.timeOffset);
  }
  
  onAnimate = () => {
    this.maybeUpdateTime();
    this.clock.speed(this.props.speed);
    this.clock.update();
  }

  /**
   * Updates the offset of the clock instance if not paused.
   * 
   * @param  {Number} timeOffset - offset to update, in UNIX time (ms)
   */
  maybeUpdateOffset = (timeOffset) => {
    if (timeOffset && !this.clock.paused) {
      this.clock.setOffset(timeOffset);
    }
  }

  /**
   * Updates the global time with clock time, if changed.
   */
  maybeUpdateTime = () => {
    if (this.clock.getTime() !== this.lastTime) {
      this.lastTime = this.clock.getTime();
      this.props.action.setTime(this.clock.getTime());
    }
  }

  render() {
    const {orbitalData, pageText} = this.props;

    if (orbitalData && pageText) {
      return <App onAnimate={this.onAnimate} />
    }
    return <SplashScreen />
  }
}

export default connect(
  ReduxService.mapStateToProps(
    'uiControls.speed',
    'uiControls.timeOffset',
    'data.orbitalData',
    'data.pageText'
  ),
  ReduxService.mapDispatchToProps(
    DataActions,
    AnimationActions
  )
)(AppContainer);