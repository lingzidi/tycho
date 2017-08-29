import * as THREE from 'three';
import React from 'react';
import PropTypes from 'prop-types';
import React3 from 'react-three-renderer';
import Controls from '../../utils/Controls';
import OrbitalContainer from './containers/OrbitalContainer';

export default class Scene extends React.Component {

  static propTypes = {
    orbitalData: PropTypes.array.isRequired,
    onAnimate: PropTypes.func.isRequired,
    updateScreenPositions: PropTypes.func.isRequired,
    time: PropTypes.number
  }

  componentWillMount = () => {
    this.cameraPosition = new THREE.Vector3(300, 300, 300);
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
        position={this.cameraPosition}
      />
    );
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
    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height
    const camera = this.getCamera(width, height);

    return (
      <React3
        mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
        width={width}
        height={height}
        antialias={true}
        onAnimate={this.props.onAnimate}
        alpha={true}>
        <scene>
          {camera}
          {this.getOrbitalElements(this.props.orbitalData)}
          <axisHelper size={500} />
        </scene>
      </React3>
    );
  }
}
