import React from 'react';
import LabelGroupContainer from '../../containers/LabelGroupContainer';
import SceneContainer from '../../containers/SceneContainer';
import UIControlsContainer from '../../containers/UIControlsContainer';
import LoaderContainer from '../../containers/LoaderContainer';
import TourContainer from '../../containers/TourContainer';
import Constants from '../../constants';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <SceneContainer
          onAnimate={this.props.onAnimate}
          time={this.props.time}
          orbitalData={this.props.orbitalData}
          width={window.innerWidth}
          height={window.innerHeight}
          perspective={false}
        />
        <LabelGroupContainer
          orbitalData={this.props.orbitalData}
        />
        <UIControlsContainer time={this.props.time} />
        <LoaderContainer />
        <TourContainer labels={Constants.Tour.LABELS} />
      </div>
    );
  }
}


