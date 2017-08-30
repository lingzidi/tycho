import * as THREE from 'three';
import React from 'react';
import PropTypes from 'prop-types';
import React3 from 'react-three-renderer';
import Controls from '../utils/Controls';
import OrbitalContainer from '../containers/OrbitalContainer';

const cameraPosition = new THREE.Vector3(300, 300, 300);//move to const

export default class Scene extends React.Component {

  static propTypes = {
    orbitalData: PropTypes.array.isRequired,
    onAnimate: PropTypes.func.isRequired,
    updateScreenPositions: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    time: PropTypes.number
  }

  componentDidMount = () => {
    this.controls = new Controls(this.refs.camera);
  }

  componentWillUnmount = () => {
    this.controls.dispose();
    delete this.controls;
  }

  getCamera = (width, height) => {
    return (
      <perspectiveCamera
        name="camera"
        ref="camera"
        fov={50}
        aspect={width / height}
        near={1}
        far={10000}
        position={cameraPosition}
      />
    );
  }

  getCameraPosition = (camera) => {
    if(camera) {
      return camera.position.clone();
    }
    return null;
  }

  getOrbitalElements = (orbitals, odd) => {
    return orbitals.map((orbital) => (
      <OrbitalContainer
        {...orbital}
        time={this.props.time}
        camera={this.refs.camera}
        onUpdate={this.props.updateScreenPositions}
        odd={odd}
        key={orbital.id}>
        {orbital.children && this.getOrbitalElements(orbital.children, !odd)}
      </OrbitalContainer>
    ));
  }

  render() {
    const {width, height} = this.props;
    const camera = this.getCamera(width, height);

    return (
      <React3
        onAnimate={this.props.onAnimate}
        mainCamera="camera"
        width={width}
        height={height}
        antialias={true}
        alpha={true}>
        <scene>
          {camera}
          {this.getOrbitalElements(this.props.orbitalData)}
          <axisHelper size={500} />
          <mesh lookAt={this.getCameraPosition(this.refs.camera)}>
            <planeGeometry width={100} height={100} />
            <meshBasicMaterial color={0x00ff00} />
          </mesh>
        </scene>
      </React3>
    );
  }
}
