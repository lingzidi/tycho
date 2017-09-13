import React from 'react';
import {connect} from 'react-redux';
import data from '../global/fixtures';
import Clock from '../utils/Clock';
import ReduxService from '../services/ReduxService';
import App from '../components/App';
import LoaderContainer from './LoaderContainer';

export class AppContainer extends React.Component {

  componentWillMount = () => {
    this.clock = new Clock();
    this.state = {
      positions: {},
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

  updateScreenPosition = (position, id) => {
    this.setState({
      positions: Object.assign(this.state.positions, {
        [id]: position
      })
    });
  }

  render() {
    return (
      <App
        positions={this.state.positions}
        time={this.state.time}
        orbitalData={data}
        updateScreenPosition={this.updateScreenPosition}
        onAnimate={this.onAnimate}
        targetName="dummyOuter"
        lookAtName="dummyParent"
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
