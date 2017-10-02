import TWEEN from 'tween.js';
import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React3 from 'react-three-renderer';
import Controls from '../utils/Controls';
import Scene from '../components/Scene';
import * as AnimationActions from '../actions/AnimationActions';
import * as UIControlsActions from '../actions/UIControlsActions';
import * as TourActions from '../actions/TourActions';
import ReduxService from '../services/ReduxService';
import CameraService from '../services/CameraService';
import CameraContainer from './CameraContainer';

export class SceneContainer extends React.Component {

  static propTypes = {
    orbitalData: PropTypes.array.isRequired,
    onAnimate: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    time: PropTypes.number
  }

  componentDidMount = () => {
    this.controls = new Controls(this.camera, this.domElement);
  }

  componentWillUnmount = () => {
    this.controls.dispose();
    delete this.controls;
  }

  componentWillReceiveProps = (nextProps) => {
    this.maybeTweenCameraPosition(nextProps);
    this.maybeUpdateControlsZoom(nextProps);
    this.maybeUpdateAutoOrbit(nextProps);
    this.maybePreventCameraCollision(nextProps);
  }

  /**
   * Starts tweening the camera to the new target if targetName has changed.
   * This resets the speed back to 1x until the camera has finished tweening.
   *
   * @param {Object} props
   * @param {String} props.targetName
   */
  maybeTweenCameraPosition = ({targetName}) => {
    const {positions, speed} = this.props;

    if (positions && this.props.targetName !== targetName) {
      this.props.action.changeSpeed(1);
      this.refs.cameraBase.startTween(targetName, this.endCameraTween.bind(this, speed));
    }
  }

  /**
   * Sets the min distance to the radius of the target, if the scale or target updated.
   * This prevents the camera from colliding with the target, should the zoom change.
   *
   * @param {Object} props
   * @param {String} props.targetName - id of active target
   * @param {Number} props.scale - user-defined planet scale
   */
  maybePreventCameraCollision = ({targetName, scale}) => {
    if (this.props.targetName !== targetName || this.props.scale !== scale) {
      this.controls.minDistance = CameraService
        .getMinDistance(this.props.orbitalData, targetName, scale);
    }
  }

  /**
   * Updates zoom level if the zoom prop has changed.
   *
   * @param {Object} props
   * @param {Number} props.zoom - new zoom prop value
   */
  maybeUpdateControlsZoom = ({zoom}) => {
    if (this.props.zoom !== zoom) {
      this.controls.zoom(zoom);
    }
  }

  /**
   * Updates the auto orbit state if the isAutoOrbitEnabled has changed.
   *
   * @param {Object} props
   * @param {Boolean} props.isAutoOrbitEnabled - new isAutoOrbitEnabled prop value
   */
  maybeUpdateAutoOrbit = ({isAutoOrbitEnabled}) => {
    if (this.props.isAutoOrbitEnabled !== isAutoOrbitEnabled) {
      this.controls.autoRotate = isAutoOrbitEnabled;
    }
  }

  /**
   * Animation frame update method.
   */
  onAnimate = () => {
    this.props.onAnimate();
    this.controls.update();
    this.forceUpdate();
    TWEEN.update();
  }

  /**
   * Maps the mousewheel event to the controls zoom function.
   */
  changeZoom = (ev) => {
    this.controls.wheelZoom(ev, this.props.action.changeZoom);
  }

  /**
   * Tweens zoom to 1%.
   */
  zoomIn = () => {
    this.controls.tweenZoom(1, this.props.action.changeZoom);
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
   * Sets the camera.
   */
  setCamera = (camera) => {
    this.camera = camera;
  }

  /**
   * Ends camera tween and restores the user-defined speed.
   *
   * @param {Number} speed - user-defined speed
   */
  endCameraTween = (speed) => {
    this.refs.cameraBase.endTween();
    this.props.action.changeSpeed(speed);
  }

  /**
   * Sets the renderer DOM element.
   */
  setDomElement = (domElement) => {
    this.domElement = domElement;
  }

  render() {
    const {width, height} = this.props;
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
          <scene>
            <CameraContainer 
              cameraRef={this.setCamera}
              positions={this.props.positions}
              targetName={this.props.targetName}
              zoomIn={this.zoomIn}
              controls={this.controls}
              ref="cameraBase" />
            {this.camera && <Scene
              time={this.props.time}
              camera={this.camera}
              updatePosition={this.props.action.setPosition}
              orbitalData={this.props.orbitalData}
              scale={this.props.scale}
              highlightedOrbital={this.props.highlightedOrbital}
              cameraMatrix={this.camera.position.clone()}>
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
    AnimationActions
  )
)(SceneContainer);
