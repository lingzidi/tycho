import React from 'react';
import LabelGroup from './LabelGroup';
import SceneContainer from '../containers/SceneContainer';
import UIControlsContainer from '../containers/UIControlsContainer';
import LoaderContainer from '../containers/LoaderContainer';
import TourContainer from '../containers/TourContainer';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <SceneContainer
          onAnimate={this.props.onAnimate}
          updateScreenPosition={this.props.updateScreenPosition}
          time={this.props.time}
          orbitalData={this.props.orbitalData}
          width={window.innerWidth}
          height={window.innerHeight}
          perspective={false}
        />
        <LabelGroup
          positions={this.props.positions}
          orbitalData={this.props.orbitalData}
        />
        <UIControlsContainer
          time={this.props.time}
        />
        <LoaderContainer />
        <TourContainer
          labels={[
            {
              duration: 1000,
              text: 'Welcome to the Solar System'
            },
            {
              duration: 1000,
              text: 'This is a real-time interactive simulation of major planetary bodies'
            },
            {
              duration: 1000,
              text: 'Let\'s start exploring'
            }
          ]}
        />
      </div>
    );
  }
}


