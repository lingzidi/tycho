import DayNightMaterial from '../DayNightMaterial';
import {FaceColors} from 'three';

describe('Day/Night Material', () => {
  let material;

  beforeEach(() => {
    material = DayNightMaterial();
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

  it('should set the side of the textures to THREE.FaceColors', () => {
    expect(material).toHaveProperty('vertexColors');
    expect(typeof material.vertexColors).toBe('number');
    expect(material.vertexColors).toEqual(FaceColors);
  });
});
