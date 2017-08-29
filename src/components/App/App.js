import React from 'react';
import data from '../../global/fixtures';
import Clock from '../../utils/Clock';
import Scene from '../Scene';
import LabelGroup from '../LabelGroup';

export default class App extends React.Component {

  componentWillMount = () => {
    this.clock = new Clock();
    this.state = {
      positions: {},
      time: this.clock.getTime()
    };
    this.clock.speed(4); // temporary
  }

  onAnimate = () => {
    this.setState({
      time: this.clock.getTime()
    });
  }

  updateScreenPositions = (position, id) => {
    this.setState({
      positions: Object.assign(this.state.positions, {
        [id]: position
      })
    });
  }

  render() {
    return (
      <div>
        <Scene
          onAnimate={this.onAnimate}
          updateScreenPositions={this.updateScreenPositions}
          time={this.state.time}
          orbitalData={data}
        />
        <LabelGroup
          positions={this.state.positions}
          orbitalData={data}
        />
      </div>
    );
  }
}
