import React from 'react';
import PropTypes from 'prop-types';
import OrbitalContainer from '../../containers/OrbitalContainer';
import Skybox from '../Skybox';

export default class Scene extends React.Component {

  static propTypes = {
    orbitalData: PropTypes.array.isRequired,
    time: PropTypes.number,
    camera: PropTypes.object,
    scale: PropTypes.number,
    domEvents: PropTypes.object,
    highlightedOrbitals: PropTypes.array
  }

  getOrbitalElements = (orbitals, isSatellite) => {
    return orbitals.map((orbital) => (
      <OrbitalContainer
        {...orbital}
        key={orbital.id}
        action={this.props.action}
        scale={this.props.scale}
        time={this.props.time}
        camera={this.props.camera}
        domEvents={this.props.domEvents}
        highlightedOrbitals={this.props.highlightedOrbitals}
        isSatellite={isSatellite}>
        {orbital.satellites && this.getOrbitalElements(
          orbital.satellites, !isSatellite
        )}
      </OrbitalContainer>
    ));
  }

  render() {
    return (
      <group>
        {this.getOrbitalElements(this.props.orbitalData)}
        <axisHelper size={500} />
        <pointLight
          color={0xffffff}
          intensity={0.95}
          distance={500}
        />
        <Skybox />
        <mesh lookAt={this.props.cameraMatrix} ref="sun">
          <planeGeometry width={100} height={100} />
          <meshBasicMaterial color={0x00ff00} />
        </mesh>
      </group>
    );
  }
}
