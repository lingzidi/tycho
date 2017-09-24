import React from 'react';
import PropTypes from 'prop-types';
import Constants from '../../constants';

export default class Body extends React.Component {

  static propTypes = {
    radius: PropTypes.number.isRequired,
    atmosphereColor: PropTypes.number.isRequired,
    rotation: PropTypes.object
  };

  render() {
    return (
      <group>
        <mesh rotation={this.props.rotation}>
          <meshPhongMaterial
            specular={Constants.WebGL.SPECULAR_COLOR}
          />
          <sphereGeometry
            widthSegments={Constants.WebGL.SPHERE_SEGMENTS}
            heightSegments={Constants.WebGL.SPHERE_SEGMENTS}
            radius={this.props.radius}
          />
        </mesh>
        <axisHelper size={200} rotation={this.props.rotation} />
      </group>
    );
  }
}
