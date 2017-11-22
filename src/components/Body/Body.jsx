import React from 'react';
import PropTypes from 'prop-types';
import Constants from '../../constants';
import TextureContainer from '../../containers/TextureContainer';

export default class Body extends React.Component {

  static propTypes = {
    radius: PropTypes.number.isRequired,
    rotation: PropTypes.object,
    label: PropTypes.object
  };

  componentDidMount = () => {
    this.refs.group.add(this.props.label);
  }

  render() {
    return (
      <group ref="group">
        <mesh rotation={this.props.rotation}>
          <TextureContainer textures={this.props.maps} />
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
