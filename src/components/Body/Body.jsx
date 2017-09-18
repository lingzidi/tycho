import React from 'react';
import PropTypes from 'prop-types';

export default class Body extends React.Component {

  static propTypes = {
    radius: PropTypes.number.isRequired,
    rotation: PropTypes.object
  };
  
  render() {
    return (
      <group>
        <mesh rotation={this.props.rotation}>
          <meshPhongMaterial specular={0x000000} />
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
