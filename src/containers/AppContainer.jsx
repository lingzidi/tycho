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
  }

  componentWillReceiveProps = (nextProps) => {
    this.maybeUpdateOffset(nextProps.timeOffset);
  }

  maybeUpdateOffset = (timeOffset) => {
    if (timeOffset && !this.clock.paused) {
      this.clock.setOffset(timeOffset);
    }
  }

  onAnimate = () => {
    this.props.action.setTime(this.clock.getTime());
    this.clock.speed(this.props.speed);
    this.clock.update();
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
