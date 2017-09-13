import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import TextureContainer from '../TextureContainer';

describe('Texture Container', () => {
  const textures = [
    {url: 'myImage.jpg'}
  ];

  let component, textureContainer;

  beforeEach(() => {
    component = shallow(<TextureContainer
      textures={textures}
    />);
    textureContainer = component.instance();
  });

  describe('componentDidMount()', () => {
    it('should enqueue the given textures', () => {
      const spy = jest.spyOn(textureContainer, 'enqueueTextures');

      textureContainer.componentDidMount();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(textures);
    });
  });

  describe('renderTexture()', () => {
    beforeEach(() => {
      textureContainer.refs = {
        material: {
          map: jest.fn()
        }
      };
      textureContainer.renderTexture(textures[0]);
    });

    it('should set the map textures to the given texture', () => {
      expect(textureContainer.refs.material.map).toEqual(textures[0]);
    });

    it('should mark the map to require an update', () => {
      expect(textureContainer.refs.material.needsUpdate).toEqual(true);
    });
  });

  describe('render()', () => {
    it('should render the texture container successfully', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
