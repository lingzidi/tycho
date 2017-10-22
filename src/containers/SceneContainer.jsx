import TWEEN from 'tween.js';
import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React3 from 'react-three-renderer';
import Scene from '../components/Scene';
import * as AnimationActions from '../actions/AnimationActions';
import * as UIControlsActions from '../actions/UIControlsActions';
import * as TourActions from '../actions/TourActions';
import * as LabelActions from '../actions/LabelActions';
import ReduxService from '../services/ReduxService';
import CameraContainer from './CameraContainer';
import DomEvents from '../utils/DomEvents';

export class SceneContainer extends React.Component {

  static propTypes = {
    orbitalData: PropTypes.array.isRequired,
    onAnimate: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    time: PropTypes.number
  }

  /**
   * Animation frame update method.
   */
  onAnimate = () => {
    this.props.onAnimate();
    this.refs.camera.update();
    // this.forceUpdate();
    TWEEN.update();
  }

  /**
   * Maps the mousewheel event to the controls zoom function.
   */
  changeZoom = (ev) => {
    this.refs.camera.controls.wheelZoom(ev, this.props.action.changeZoom);
  }

  /**
   * Starts auto-rotation of the camera.
   */
  startAutoRotate = () => {
    this.props.action.setCameraOrbit(true);
    this.props.action.setUIControls(false);
  }

  /**
   * Stops auto-rotation of the camera.
   */
  stopAutoRotate = () => {
    this.props.action.setCameraOrbit(false);
    this.props.action.setUIControls(true);
  }

  /**
   * Sets the renderer DOM element.
   */
  setDomElement = (domElement) => {
    this.domElement = domElement;
  }

  render() {
    const {width, height} = this.props;
    const {camera} = this.refs;

    return (
      <div
        onWheel={this.changeZoom}
        onTouchStart={this.stopAutoRotate}
        onMouseDown={this.stopAutoRotate}>
        <React3
          onAnimate={this.onAnimate}
          mainCamera="camera"
          width={width}
          height={height}
          antialias={true}
          alpha={true}
          canvasRef={this.setDomElement}>
          <scene ref="scene">
            <CameraContainer
              ratio={width / height}
              targetName={this.props.targetName}
              action={this.props.action}
              speed={this.props.speed}
              scale={this.props.scale}
              scene={this.refs.scene}
              zoom={this.props.zoom}
              isAutoOrbitEnabled={this.props.isAutoOrbitEnabled}
              orbitalData={this.props.orbitalData}
              domElement={this.domElement}
              ref="camera" />
            {camera && <Scene
              time={this.props.time}
              camera={camera.refs.camera}
              orbitalData={this.props.orbitalData}
              scale={this.props.scale}
              action={this.props.action}
              highlightedOrbital={this.props.highlightedOrbital}
              cameraMatrix={camera.refs.camera.position.clone()}
              domEvents={DomEvents(camera.refs.camera)}>
              {this.props.children}
            </Scene>}
          </scene>
        </React3>
      </div>
    );
  }
}

export default connect(
  ReduxService.mapStateToProps(
    'uiControls.zoom',
    'uiControls.scale',
    'uiControls.speed',
    'label.targetName',
    'label.highlightedOrbital',
    'tour.isAutoOrbitEnabled',
    'animation.positions',
    'animation.time',
    'data.orbitalData'
  ),
  ReduxService.mapDispatchToProps(
    UIControlsActions,
    TourActions,
    AnimationActions,
    LabelActions
  )
)(SceneContainer);
