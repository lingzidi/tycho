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

const cameraPosition = new THREE.Vector3(300, 300, 300);//move to const

export class SceneContainer extends React.Component {

  static propTypes = {
    orbitalData: PropTypes.array.isRequired,
    onAnimate: PropTypes.func.isRequired,
    updateScreenPosition: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    time: PropTypes.number
  }

  componentDidMount = () => {
    this.controls = new Controls(this.refs.camera, this.domElement);
    this.state = {positions: {}};
  }

  componentWillUnmount = () => {
    this.controls.dispose();
    delete this.controls;
  }

  componentWillReceiveProps = (nextProps) => {
    const {zoom, targetName} = this.props;

    if (zoom !== nextProps.zoom) {
      this.controls.zoom(nextProps.zoom);
    }

    if (targetName !== nextProps.targetName) {
      this.startTween(nextProps.targetName);
    }
  }

  onAnimate = () => {
    this.updateCameraVectors();
    this.updateCameraPosition();
    this.props.onAnimate();
    TWEEN.update();
  }

  updatePosition = (positions, id, log) => {
    this.props.updateScreenPosition(positions.position2d, id);
    this.setState({
      positions: Object.assign({}, this.state.positions, {
        [id]: positions
      })
    });
  }

  endTween = () => {
    delete this.tweenData;
    delete this.tweenBase;

    this.setState({
      targetName: this.props.targetName
    });
  }

  cancelTween = () => {
    if (this.tweenBase) {
      this.tweenBase.stop();
      this.endTween();
    }
  }

  startTween = (targetName) => {
    const target = this.state.positions[targetName];

    if (target) {
      this.cancelTween();
      this.controls.tweenZoom(1, this.props.action.changeZoom);

      this.tweenData = SceneService.vectorToObject(this.refs.cameraBase.position);
      this.tweenBase = new TWEEN.Tween(this.tweenData);

      SceneService.startTween(this.tweenBase, target.position3d, this.endTween);
    }
  }

  getTargetPosition = () => {
    if (this.tweenData) {
      return SceneService.objectToVector(this.tweenData);
    }
    return SceneService.getTargetPosition(this.state, this.props);
  }

  updateCameraVectors = () => {
    SceneService.updateCameraVectors(
      this.state,
      this.props,
      this.refs.camera
    );
  }

  updateCameraPosition = () => {
    const {camera} = this.refs;

    if (camera) {
      this.setState({
        cameraMatrix: camera.position.clone()
      });
    }
  }

  setDomElement = (domElement) => {
    this.domElement = domElement;
  }

  changeZoom = (event) => {
    SceneService.mapZoom(
      event,
      this.controls,
      this.props.action.changeZoom
    );
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
            <group position={this.getTargetPosition()} ref="cameraBase">
              <perspectiveCamera
                name="camera"
                ref="camera"
                fov={50}
                aspect={width / height}
                near={1}
                far={10000}
                position={cameraPosition}
              />
            </group>
            <Scene
              time={this.props.time}
              camera={this.refs.camera}
              updatePosition={this.updatePosition}
              orbitalData={this.props.orbitalData}
              scale={this.props.scale}
              cameraMatrix={this.state && this.state.cameraMatrix}>
              {this.props.children}
            </Scene>
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
