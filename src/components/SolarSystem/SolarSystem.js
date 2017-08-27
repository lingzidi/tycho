import React from 'react';
import PropTypes from 'prop-types';
import OrbitalContainer from '../../containers/OrbitalContainer';

class SolarSystem extends React.Component {
  
  static propTypes = {
    camera: PropTypes.object,
    time: PropTypes.number,
    onUpdate: PropTypes.func.isRequired,
    orbitals: PropTypes.array.isRequired
  }

  getOrbitals = (orbitals, odd) => {
    return orbitals.map((orbital) => (
      <OrbitalContainer
        {...orbital}
        time={this.props.time}
        camera={this.refs.camera}
        onUpdate={this.props.onUpdate}
        odd={odd}
        key={orbital.id}>
        {orbital.children && this.getOrbitals(orbital.children, !odd)}
      </OrbitalContainer>
    ));
  }

  render() {
    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height

    return (
      <scene>
      <perspectiveCamera
        name="camera"
        ref="camera"
        fov={50}
        aspect={width / height}
        near={1}
        far={10000}
        position={this.cameraPosition}
      />

        {this.getOrbitals(this.props.orbitals)}
        <axisHelper size={500} />
      </scene>
    );
  }
}

export default SolarSystem;
