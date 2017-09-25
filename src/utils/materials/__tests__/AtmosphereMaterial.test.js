import AtmosphereMaterial from '../AtmosphereMaterial';
import {Camera, BackSide} from 'three';

describe('Atmosphere Material', () => {
  let material;

  beforeEach(() => {
    material = AtmosphereMaterial(new Camera(), 50, 'map.jpg', 'mapNight.jpg');
  });

  it('should be an object', () => {
    expect(typeof material).toBe('object');
  });
  
  it('should contain the vertexShader', () => {
    expect(material).toHaveProperty('vertexShader');
    expect(typeof material.vertexShader).toBe('string');
  });
  
  it('should contain the fragmentShader', () => {
    expect(material).toHaveProperty('fragmentShader');
    expect(typeof material.fragmentShader).toBe('string');
  });
  
  it('should contain the shader uniforms', () => {
    expect(material).toHaveProperty('uniforms');
    expect(typeof material.uniforms).toBe('object');
  });

  it('should set the side of the textures to THREE.BackSide', () => {
    expect(material).toHaveProperty('side');
    expect(typeof material.side).toBe('number');
    expect(material.side).toEqual(BackSide);
  });

  it('should be transparent', () => {
    expect(material).toHaveProperty('transparent');
    expect(typeof material.transparent).toBe('boolean');
    expect(material.transparent).toEqual(true);
  });

  it('should fallback to mapDay if mapNight is undefined', () => {
    material = AtmosphereMaterial(new Camera(), 50, 'map.jpg');
    expect(typeof material).toBe('object');
  });
});
