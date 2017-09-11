import React from 'react';
import {connect} from 'react-redux';
import data from '../global/fixtures';
import Clock from '../utils/Clock';
import LabelGroup from './LabelGroup';
import SceneContainer from '../containers/SceneContainer';
import UIControlsContainer from '../containers/UIControlsContainer';
import ReduxService from '../services/ReduxService';

export class App extends React.Component {

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
      <div>
        <SceneContainer
          onAnimate={this.onAnimate}
          updateScreenPosition={this.updateScreenPosition}
          time={this.state.time}
          orbitalData={data}
          width={window.innerWidth}
          height={window.innerHeight}
          perspective={false}
          targetName="dummyOuter"
          lookAtName="dummyParent"
        />
        <LabelGroup
          positions={this.state.positions}
          orbitalData={data}
        />
        <UIControlsContainer
          time={this.state.time}
        />
      </div>
    );
  }
}

export default connect(
  ReduxService.mapStateToProps(
    'uiControls.speed',
    'uiControls.timeOffset'
  ),
  null
)(App);
