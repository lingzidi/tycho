import React from 'react';
import TextureContainer from '../containers/TextureContainer';

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
          widthSegments={32}
          heightSegments={32}
          radius={700}
        />
      </mesh>
    );
  }
}
