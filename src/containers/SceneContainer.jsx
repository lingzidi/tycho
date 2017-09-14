import * as THREE from 'three';
import TWEEN from 'tween.js';
import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React3 from 'react-three-renderer';
import Controls from '../utils/Controls';
import Scene from '../components/Scene';
import * as Actions from '../actions/UIControlsActions';
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
    if (this.props.zoom !== nextProps.zoom) {
      this.controls.zoom(nextProps.zoom);
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
      <div onWheel={this.changeZoom}>
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
    'label.targetName'
  ),
  ReduxService.mapDispatchToProps(Actions)
)(SceneContainer);
