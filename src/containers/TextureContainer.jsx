import React from 'react';
import {TextureLoader} from 'three';
import PropTypes from 'prop-types';

export default class TextureContainer extends React.Component {

  static propTypes = {
    side: PropTypes.object,
    textures: PropTypes.array
  }

  componentDidMount = () => {
    this.enqueueTextures(this.props.textures);
  }

  /**
   * Applies the given texture onto the material element.
   *
   * @param {Texture} texture - instance of THREE.Texture
   */
  renderTexture = (texture) => {
    this.refs.material.map = texture;
    this.refs.material.needsUpdate = true;
  }

  /**
   * Enqueues the given texture set into the default THREE loader.
   *
   * @param {Object} prop
   * @param {String} prop.url - url of the texture to load
   */
  loadTexture = ({url}) => {
    let loader = new TextureLoader();
    loader.load(url, this.renderTexture);
  }

  /**
   * Calls loadTexture() on each texture set.
   *
   * @param {Object[]} textures - list of texture sets
   */
  enqueueTextures = (textures) => {
    textures.forEach(this.loadTexture);
  }

  render() {
    return (
      <meshBasicMaterial
        color={0x808080}
        side={this.props.side}
        ref="material"
      />
    );
  }
}
