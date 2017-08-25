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
    odd: PropTypes.bool,
    camera: PropTypes.object,
    onUpdate: PropTypes.func,
    id: PropTypes.string
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
      x: Math.abs(90 - this.props.axialTilt),
      y: Math2.arcSecToDeg(this.props.time, this.props.arcRotate),
    });
  }

  getBodyPosition = () => {
    return this.ellipse.getPosition(this.props.time, this.props.periapses);
  }

  onAnimationFrame = () => {
    const rotation = this.getBodyRotation();
    const position = this.getBodyPosition();

    this.setState({rotation, position});
    this.updateScreenPosition();
  }

  renderBody = () => {
    // TODO: rename Mesh to Body
    return (
      <Mesh
        rotation={this.state.rotation}
        axialTilt={this.props.axialTilt} 
        radius={this.props.radius}
        ref="mesh"
      />
    );
  }

  translate3DTo2D = (position, camera) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const matrix = new THREE.Matrix4();

    if (position) {
      const pos = position.clone();
      
      matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      pos.applyMatrix4(matrix);
      
      const left = (1 + pos.x) * width / 2;
      const top = (1 - pos.y) * height / 2;
      
        return {top, left};
    }
    return null;
  }


  updateScreenPosition = () => {
    if (this.refs.mesh) {
      const vect = new THREE.Vector3();
      const matrix = this.refs.mesh
        ._reactInternalInstance
        ._threeObject
        .matrixWorld;

      vect.setFromMatrixPosition(matrix);

      this.props.onUpdate(
        this.translate3DTo2D(vect, this.props.camera),
        this.props.id
      );
    }
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
