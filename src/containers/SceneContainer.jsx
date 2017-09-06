import * as THREE from 'three';
import React from 'react';
import PropTypes from 'prop-types';
import React3 from 'react-three-renderer';
import Controls from '../utils/Controls';
import Scene from '../components/Scene';

const cameraPosition = new THREE.Vector3(300, 300, 300);//move to const

export default class SceneContainer extends React.Component {

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

  onAnimate = () => {
    this.updateCameraVectors();
    this.props.onAnimate();
  }

  updatePosition = (positions, id, log) => {
    this.props.updateScreenPosition(positions.position2d, id);
    this.setState({
      positions: Object.assign({}, this.state.positions, {
        [id]: positions
      })
    });
  }

  getTargetPosition = () => {
    if (this.state) {
      const {positions} = this.state;
      const {perspective, targetName} = this.props;

      if (positions[targetName] && !perspective) {
        return positions[targetName].position3d;
      }
    }
    return new THREE.Vector3(0, 0, 0);
  }

  updateCameraVectors = () => {
    const {positions} = this.state;
    const {camera} = this.refs;
    const {
      perspective,
      targetName,
      lookAtName
    } = this.props;

    if(positions[targetName] && positions[lookAtName] && perspective) {
      camera.position.copy(positions[targetName].position3d);
      camera.lookAt(positions[lookAtName].position3d);
    }
  }

  setDomElement = (domElement) => {
    this.domElement = domElement;
  }

  render() {
    const {width, height} = this.props;

    return (
      <React3
        onAnimate={this.onAnimate}
        mainCamera="camera"
        width={width}
        height={height}
        antialias={true}
        alpha={true}
        canvasRef={this.setDomElement}>
        <scene>
          <group position={this.getTargetPosition()}>
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
            orbitalData={this.props.orbitalData}>
            {this.props.children}
          </Scene>
        </scene>
      </React3>
    );
  }
}
