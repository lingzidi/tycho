import React from 'react';
import LabelGroupContainer from '../../containers/LabelGroupContainer';
import SceneContainer from '../../containers/SceneContainer';
import UIControlsContainer from '../../containers/UIControlsContainer';
import LoaderContainer from '../../containers/LoaderContainer';
import TourContainer from '../../containers/TourContainer';
import ModalContainer from '../../containers/ModalContainer';
import Constants from '../../constants';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <SceneContainer
          onAnimate={this.props.onAnimate}
          width={window.innerWidth}
          height={window.innerHeight}
        />
        <LabelGroupContainer />
        <UIControlsContainer />
        <LoaderContainer />
        <TourContainer labels={Constants.Tour.LABELS} />
        <ModalContainer />
      </div>
    );
  }
}


