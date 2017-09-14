import React from 'react';
import TWEEN from 'tween.js';
import SceneService from '../services/SceneService';
import {Vector3} from 'three';

const cameraPosition = new Vector3(300, 300, 300);//move to const

export default class CameraContainer extends React.Component {

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

      SceneService.startTween(this.tweenBase, target.position3d, this.endTween);
    }
  }

  /**
   * Assigns a new Tween to the active target position.
   */
  assignTween = () => {
    this.tweenData = SceneService.vectorToObject(this.getTargetPosition());
    this.tweenBase = new TWEEN.Tween(this.tweenData);
  }
  
  /**
   * Returns the calculated active target position.
   * If a Tween is in progress, it will return that current position.
   */
  getTargetPosition = () => {
    const {positions, targetName} = this.props;

    if (this.tweenData) {
      return SceneService.objectToVector(this.tweenData);
    }
    return SceneService.getTargetPosition(positions, targetName);
  }

  render() {
    return (
      <group position={this.getTargetPosition()}>
        <perspectiveCamera
          name="camera"
          ref="camera"
          fov={50}
          aspect={window.innerWidth / window.innerHeight}
          near={1}
          far={10000}
          position={cameraPosition}
        />
      </group>
    );
  }
}

