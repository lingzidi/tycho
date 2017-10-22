import React from 'react';
import PropTypes from 'prop-types';
import Body from '../Body';

export default class Orbital extends React.Component {

  static propTypes = {
    eclipticGroupRotation: PropTypes.object.isRequired,
    orbitalGroupRotation: PropTypes.object.isRequired,
    pathVertices: PropTypes.array.isRequired,
    bodyPosition: PropTypes.object.isRequired,
    bodyRotation: PropTypes.object.isRequired,
    bodyRadius: PropTypes.number.isRequired,
    atmosphere: PropTypes.number,
    pathOpacity: PropTypes.number,
    label: PropTypes.object,
    id: PropTypes.string.isRequired
  }

  render() {
    return (
      <group rotation={this.props.eclipticGroupRotation}>
        <group
          rotation={this.props.orbitalGroupRotation}
          position={this.props.bodyPosition}
          name={this.props.id}>
          <Body
            rotation={this.props.bodyRotation}
            radius={this.props.bodyRadius}
            label={this.props.label}
          />
          {this.props.children}
        </group>
        <line>
          <lineBasicMaterial
            transparent={true}
            color={this.props.atmosphere}
            opacity={this.props.pathOpacity}
          />
          <geometry
            vertices={this.props.pathVertices}
          />
        </line>
      </group>
    );
  }
}
