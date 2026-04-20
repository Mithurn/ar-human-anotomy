import * as THREE from "three";

export class Reticle {
  constructor(scene) {
    const geometry = new THREE.RingGeometry(0.08, 0.1, 32).rotateX(-Math.PI / 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.matrixAutoUpdate = false;
    this.mesh.visible = false;
    scene.add(this.mesh);
  }

  update(matrix) {
    this.mesh.visible = true;
    this.mesh.matrix.fromArray(matrix);
  }

  show() {
    this.mesh.visible = true;
  }

  hide() {
    this.mesh.visible = false;
  }

  get visible() {
    return this.mesh.visible;
  }

  getPosition() {
    const pos = new THREE.Vector3();
    pos.setFromMatrixPosition(this.mesh.matrix);
    return pos;
  }
}
