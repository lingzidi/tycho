import React from 'react';
import {connect} from 'react-redux';
import data from '../global/fixtures';
import Clock from '../utils/Clock';
import ReduxService from '../services/ReduxService';
import App from '../components/App';
import Constants from '../constants';

export class AppContainer extends React.Component {

  componentWillMount = () => {
    this.clock = new Clock();
    this.state = {
      time: this.clock.getTime()
    };
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.timeOffset && !this.clock.paused) {
      this.clock.setOffset(nextProps.timeOffset);
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
    return (
      <App
        time={this.state.time}
        orbitalData={data}
        onAnimate={this.onAnimate}
        targetName={Constants.UI.DEFAULT_TARGET_NAME}
      />
    );
  }
}

export default connect(
  ReduxService.mapStateToProps(
    'uiControls.speed',
    'uiControls.timeOffset'
  ),
  null
)(AppContainer);
