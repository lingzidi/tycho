import TWEEN from 'tween.js';
import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React3 from 'react-three-renderer';
import Controls from '../utils/Controls';
import Scene from '../components/Scene';
import * as UIControlsActions from '../actions/UIControlsActions';
import * as TourActions from '../actions/TourActions';
import ReduxService from '../services/ReduxService';
import SceneService from '../services/SceneService';
import CameraContainer from './CameraContainer';

export class SceneContainer extends React.Component {

  static propTypes = {
    orbitalData: PropTypes.array.isRequired,
    onAnimate: PropTypes.func.isRequired,
    updateScreenPosition: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    time: PropTypes.number
  }

  componentWillMount = () => {
    this.state = {positions: {}};
  }

  componentDidMount = () => {
    this.controls = new Controls(this.camera, this.domElement);
  }

  componentWillUnmount = () => {
    this.controls.dispose();
    delete this.controls;
  }

  componentWillReceiveProps = (nextProps) => {
    this.maybeUpdateControlsZoom(nextProps.zoom);
    this.maybeUpdateAutoOrbit(nextProps.isAutoOrbitEnabled);
  }

  /**
   * Updates zoom level if the zoom prop has changed.
   *
   * @param {Number} zoom - new zoom prop value
   */
  maybeUpdateControlsZoom = (zoom) => {
    if (this.props.zoom !== zoom) {
      this.controls.zoom(zoom);
    }
  }

  /**
   * Updates the auto orbit state if the isAutoOrbitEnabled has changed.
   *
   * @param {Boolean} isAutoOrbitEnabled - new isAutoOrbitEnabled prop value
   */
  maybeUpdateAutoOrbit = (isAutoOrbitEnabled) => {
    if (this.props.isAutoOrbitEnabled !== isAutoOrbitEnabled) {
      this.controls.autoRotate = isAutoOrbitEnabled;
    }
  }

  /**
   * Animation frame update method.
   */
  onAnimate = () => {
    this.updateCameraPosition();
    this.props.onAnimate();
    this.controls.update();
    TWEEN.update();
  }

  /**
   * Updates the local state of all positions.
   * Each Scene-bound object position changes on each animation frame.
   * The SceneContainer holds the object positions in its local state and not the Redux store,
   * since updating the Redux store with new info on each animation frame would be impractical.
   */
  updatePosition = (positions, id, log) => {
    this.props.updateScreenPosition(positions.position2d, id);
    this.setState({
      positions: Object.assign({}, this.state.positions, {
        [id]: positions
      })
    });
  }

  /**
   * Updates the active camera position, if any.
   */
  updateCameraPosition = () => {
    if (this.camera) {
      this.setState({
        cameraMatrix: this.camera.position.clone()
      });
    }
  }

  /**
   * Maps the mousewheel event to the controls zoom function.
   */
  changeZoom = (event) => {
    SceneService.mapZoom(
      event,
      this.controls,
      this.props.action.changeZoom
    );
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
              positions={this.state.positions}
              targetName={this.props.targetName}
              zoomIn={this.zoomIn}
              controls={this.controls}
              ref="cameraBase" />
            {this.camera ?
              <Scene
                time={this.props.time}
                camera={this.camera}
                updatePosition={this.updatePosition}
                orbitalData={this.props.orbitalData}
                scale={this.props.scale}
                cameraMatrix={this.state.cameraMatrix}>
                {this.props.children}
              </Scene>
            : null}
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
    'label.targetName',
    'tour.isAutoOrbitEnabled'
  ),
  ReduxService.mapDispatchToProps(
    UIControlsActions,
    TourActions
  )
)(SceneContainer);
