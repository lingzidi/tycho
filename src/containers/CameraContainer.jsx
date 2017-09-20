import React from 'react';
import TWEEN from 'tween.js';
import PropTypes from 'prop-types';
import CameraService from '../services/CameraService';
import Constants from '../constants';

export default class CameraContainer extends React.Component {

  static propTypes= {
    cameraRef: PropTypes.func,
    positions: PropTypes.object,
    targetName: PropTypes.string,
    zoomIn: PropTypes.func,
    controls: PropTypes.object
  }

  componentDidMount = () => {
    if (this.props.cameraRef) {
      this.props.cameraRef(this.refs.camera);
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.targetName !== nextProps.targetName) {
      this.startTween(nextProps.targetName);
    }
  }

  /**
   * Removes any active Tween.
   */
  endTween = () => {
    delete this.tweenData;
    delete this.tweenBase;
  }

  /**
   * Cancels any Tween in progress.
   */
  cancelTween = () => {
    if (this.tweenBase) {
      this.tweenBase.stop();
      this.endTween();
    }
  }

  /**
   * Starts Tween to the position having a key of targetName.
   */
  startTween = (targetName) => {
    const target = this.props.positions[targetName];

    if (target) {
      this.cancelTween();
      this.assignTween();
      this.props.zoomIn();

      CameraService.startTween(this.tweenBase, target.position3d, this.endTween);
    }
  }

  /**
   * Assigns a new Tween to the active target position.
   */
  assignTween = () => {
    this.tweenData = CameraService.vectorToObject(this.getTargetPosition());
    this.tweenBase = new TWEEN.Tween(this.tweenData);
  }
  
  /**
   * Returns the calculated active target position.
   * If a Tween is in progress, it will return that current position.
   */
  getTargetPosition = () => {
    const {positions, targetName} = this.props;

    if (this.tweenData) {
      return CameraService.objectToVector(this.tweenData);
    }
    return CameraService.getTargetPosition(positions, targetName);
  }

  render() {
    return (
      <group position={this.getTargetPosition()}>
        <perspectiveCamera
          name="camera"
          ref="camera"
          fov={Constants.WebGL.Camera.FOV}
          aspect={window.innerWidth / window.innerHeight}
          near={Constants.WebGL.Camera.NEAR}
          far={Constants.WebGL.Camera.FAR}
          position={CameraService.CAMERA_INITIAL_POSITION}
        />
      </group>
    );
  }
}

