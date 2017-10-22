import * as THREE from 'three';

export default class Label extends THREE.Sprite {

  constructor(text, domEvents, isSatellite) {
    super();

    this.text = text;
    this.domEvents = domEvents;
    this.isSatellite = isSatellite;

    this.render();
  }

  getCanvas = (text) => {
    const canvas = document.createElement('canvas');
    const size = 128; // TODO

    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');

    context.font = "16pt Georgia"; // TODO
    context.fillStyle = "#fff"; // TODO
    context.textAlign = "center"; // TODO
    context.fillText(this.text, size / 2, size / 3);
    
    return canvas;
  }

  getTexture = (canvas) => {
    return new THREE.Texture(canvas);
  }

  getMaterial = (map) => {
    return new THREE.SpriteMaterial({map});
  }

  onHover = (callback) => {
    this.domEvents.addEventListener(this, 'mouseover', callback);
  }

  onMouseOut = (callback) => {
    this.domEvents.addEventListener(this, 'mouseout', callback);
  }

  onClick = (callback) => {
    this.domEvents.addEventListener(this, 'click', callback);
  }

  render = () => {
    const canvas = this.getCanvas(this.text);
    const texture = this.getTexture(canvas);
    const material = this.getMaterial(texture);

    texture.needsUpdate = true;
    this.material = material;
  }
}