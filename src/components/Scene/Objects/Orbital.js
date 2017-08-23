import React from 'react';
import ReactAnimationFrame from 'react-animation-frame';
import PropTypes from 'prop-types';
import * as THREE from 'three';

import Ellipse from '../Utils/Ellipse';
import Mesh from '../Utils/Mesh';
import Math2 from '../../../engine/math2';

class Orbital extends React.Component {

  static propTypes = {
    inclination: PropTypes.number.isRequired,
    longAscNode: PropTypes.number.isRequired,
    argPeriapsis: PropTypes.number.isRequired,
    arcRotate: PropTypes.number.isRequired,
    radius: PropTypes.number.isRequired,
    axialTilt: PropTypes.number.isRequired,
    time: PropTypes.number,
    odd: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context);

    this.state = {};
    this.ellipse = new Ellipse(this.props);
  }

  toEuler = ({x, y, z}) => { // TODO: move to math lib
    const toRad = (val) => val ? Math2.toRadians(val) : 0;
    return new THREE.Euler(toRad(x), toRad(y), toRad(z));
  }

  getEclipticGroupRotation = ({inclination, longitudeOfAscendingNode}) => {
    return this.toEuler({
      x: inclination - (this.props.odd ? 0 : 90),
      z: longitudeOfAscendingNode
    });
  }

  getOrbitalGroupRotation = ({argumentOfPeriapsis}) => {
    return this.toEuler({
      z: argumentOfPeriapsis
    });
  }

  getBodyRotation = () => {
    return this.toEuler({
      x: 90,
      y: Math2.arcSecToDeg(this.props.time, this.props.arcRotate)*2
    });
  }

  getBodyPosition = () => {
    return this.ellipse.getPosition(this.props.time, this.props.periapses);
  }

  onAnimationFrame = () => {
    this.setState({
      rotation: this.getBodyRotation(),
      position: this.getBodyPosition()
    });
  }

  renderBody = () => {
    // TODO: rename Mesh to Body
    return (
      <Mesh
        rotation={this.state.rotation}
        axialTilt={this.props.axialTilt} 
        radius={this.props.radius}
      />
    );
  }

  renderLine = () => {
    return (
      <line>
        <lineBasicMaterial color={0x0000ff} />
        <geometry vertices={this.ellipse.geometry.vertices} />
      </line>
    );
  }

  render() {
    return (
      <group rotation={this.getEclipticGroupRotation(this.props)}>
        <group rotation={this.getOrbitalGroupRotation(this.props)} position={this.state.position}>
          {this.renderBody()}
          {this.props.children}
        </group>
        {this.renderLine()}
      </group>
    );
  }
}

export default ReactAnimationFrame(Orbital);
