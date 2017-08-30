import React from 'react';
import PropTypes from 'prop-types';
import Body from './Body';
import ReactAnimationFrame from 'react-animation-frame';

export class Orbital extends React.Component {

  static propTypes = {
    updateScreenPosition: PropTypes.func.isRequired,
    eclipticGroupRotation: PropTypes.object.isRequired,
    orbitalGroupRotation: PropTypes.object.isRequired,
    pathVertices: PropTypes.array.isRequired,
    bodyPosition: PropTypes.object.isRequired,
    bodyRotation: PropTypes.object.isRequired,
    bodyRadius: PropTypes.number.isRequired,
    pathOpacity: PropTypes.number,
    id: PropTypes.string.isRequired
  }

  onAnimationFrame = () => {
    this.props.updateScreenPosition(this.refs.body);
  }

  render() {
    return (
      <group rotation={this.props.eclipticGroupRotation}>
        <group rotation={this.props.orbitalGroupRotation} position={this.props.bodyPosition}>
          <Body
            rotation={this.props.bodyRotation}
            radius={this.props.bodyRadius}
            ref="body"
          />
          {this.props.children}
        </group>
        <line>
          <lineBasicMaterial color={0x0000ff} opacity={this.props.pathOpacity} />
          <geometry vertices={this.props.pathVertices} />
        </line>
      </group>
    );
  }
}

export default ReactAnimationFrame(Orbital);
