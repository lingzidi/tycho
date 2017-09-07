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

  componentDidUpdate = () => {
    const {speed} = this.props;

    if (speed) {
      this.clock.speed(speed);
    }
  }
  
  onAnimate = () => {
    this.setState({
      time: this.clock.getTime()
    });
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
        <UIControlsContainer />
      </div>
    );
  }
}

export default connect(ReduxService.mapStateToProps('uiControls', 'speed'), null)(App);
