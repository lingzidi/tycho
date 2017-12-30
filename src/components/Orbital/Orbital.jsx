import React from 'react';
import PropTypes from 'prop-types';
import Body from '../Body';
import Label from './Label';

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
    scaleLastUpdate: PropTypes.number,
    maps: PropTypes.array,
    targetId: PropTypes.string,
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    action: PropTypes.object.isRequired
  }

  render() {
    return (
      <group ref="ecliptic" rotation={this.props.eclipticGroupRotation}>
        <group ref="orbital" rotation={this.props.orbitalGroupRotation}>
          
          <group 
            position={this.props.bodyPosition}
            name={this.props.id}>
            <Body
              rotation={this.props.bodyRotation}
              radius={this.props.bodyRadius}
              maps={this.props.maps}
            />
            <Label {...this.props} />
            {this.props.children}
          </group>

          <line key={`path-${this.props.id}-${this.props.scaleLastUpdate}`}>
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
      </group>
    );
  }
}
