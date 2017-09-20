import React from 'react';
import TextureContainer from '../../containers/TextureContainer';
import Constants from '../../constants';

export default class Skybox extends React.Component {
  render() {
    return (
      <mesh>
        <TextureContainer
          textures={[{
            url: 'milkyway.jpg'
          }]}
        />
        <sphereGeometry
          widthSegments={Constants.WebGL.SPHERE_SEGMENTS}
          heightSegments={Constants.WebGL.SPHERE_SEGMENTS}
          radius={Constants.WebGL.SKYBOX_RADIUS}
        />
      </mesh>
    );
  }
}
