import THREE from 'three';
import Scale from 'engine/scale';

export default class Rings extends THREE.Mesh {
  constructor(data) {
    super();

    this.data = data;
    this.render();
  }

  render = () => {
    this.setGeometry();
    this.setMaterial();
  }

  setGeometry = () => {
    const size = Scale(this.data.outerRadius);
    this.geometry = new THREE.PlaneGeometry(size, size, 32);
  }

  setMaterial = () => {
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide
    });
  }
}
