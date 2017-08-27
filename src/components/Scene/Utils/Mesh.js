import React from 'react';
import PropTypes from 'prop-types';

export default class Mesh extends React.Component {

  static propTypes = {
    radius: PropTypes.number.isRequired,
    color: PropTypes.number,
    rotation: PropTypes.object
  };
  
  render() {
    return (
      <group>
        <mesh rotation={this.props.rotation}>
          <meshBasicMaterial color={0x000000} />
          <sphereGeometry
            widthSegments={32}
            heightSegments={32}
            radius={this.props.radius}/>
        </mesh>
        <axisHelper size={200} rotation={this.props.rotation} />
      </group>
    );
  }
}
