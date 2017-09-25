import React from 'react';
import {connect} from 'react-redux';
import Clock from '../utils/Clock';
import ReduxService from '../services/ReduxService';
import App from '../components/App';
import SplashScreen from '../components/SplashScreen';
import Constants from '../constants';
import * as Actions from '../actions/DataActions';

export class AppContainer extends React.Component {

  componentWillMount = () => {
    this.props.action.requestOrbitalData();
    this.props.action.requestPageText();
    this.clock = new Clock();
    this.state = {
      time: this.clock.getTime()
    };
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
    this.setState({
      time: this.clock.getTime()
    });
    this.clock.speed(this.props.speed);
    this.clock.update();
  }

  render() {
    const {orbitalData, pageText} = this.props;
    if (orbitalData && pageText) {
      return (
        <App
          time={this.state.time}
          onAnimate={this.onAnimate}
          targetName={Constants.UI.DEFAULT_TARGET_NAME}
        />
      );
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
  ReduxService.mapDispatchToProps(Actions)
)(AppContainer);
