import React from 'react';
import data from '../global/fixtures';
import Clock from '../utils/Clock';
import SceneContainer from '../containers/SceneContainer';
import LabelGroup from './LabelGroup';
import UIControlsContainer from '../containers/UIControlsContainer';

export default class App extends React.Component {

  componentWillMount = () => {
    this.clock = new Clock();
    this.state = {
      positions: {},
      time: this.clock.getTime()
    };
    this.clock.speed(5); // temporary
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
