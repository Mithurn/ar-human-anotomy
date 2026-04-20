import * as THREE from "three";
import { ANATOMY_DATA } from "./AnatomyData.js";

export class LabelSystem {
  constructor(state, camera, interaction) {
    this.state = state;
    this.camera = camera;
    this.interaction = interaction;
    this.raycaster = new THREE.Raycaster();
    this.tapPoint = new THREE.Vector2();
    this.visible = false;

    document.getElementById("ar-canvas").addEventListener("touchend", (event) => {
      if (!this.state.modelPlaced || event.changedTouches.length === 0) return;

      const touch = event.changedTouches[0];
      this.tapPoint.set(
        (touch.clientX / window.innerWidth) * 2 - 1,
        (touch.clientY / window.innerHeight) * -2 + 1
      );

      if (!navigator.xr) {
        this.onTap();
      }
    });

    document.getElementById("ar-canvas").addEventListener("click", (event) => {
      if (!this.state.modelPlaced) return;

      this.tapPoint.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        (event.clientY / window.innerHeight) * -2 + 1
      );

      if (!navigator.xr) {
        this.onTap();
      }
    });

    document.getElementById("label-close").addEventListener("click", () => this.hide());
  }

  onTap() {
    if (!this.state.currentModel) return;
    if (navigator.xr && !this.interaction.wasTap()) return;

    this.raycaster.setFromCamera(this.tapPoint, this.camera);

    const meshes = [];
    this.state.currentModel.traverse((child) => {
      if (child.isMesh && child.userData.isAnatomyPart) meshes.push(child);
    });

    const hits = this.raycaster.intersectObjects(meshes, false);

    if (hits.length === 0) {
      this.hide();
      return;
    }

    const hit = hits[0];
    const rawName = hit.object.userData.partName;
    const organ = this.state.selectedOrgan;
    const data = ANATOMY_DATA[organ]?.[rawName];

    if (data) {
      this.show(data.name, data.description);
      return;
    }

    this.show(this.formatName(rawName), `Part of the ${organ} anatomy.`);
  }

  show(name, desc) {
    document.getElementById("label-name").textContent = name;
    document.getElementById("label-desc").textContent = desc;
    document.getElementById("label-popup").classList.remove("hidden");
    this.visible = true;
  }

  hide() {
    document.getElementById("label-popup").classList.add("hidden");
    this.visible = false;
  }

  update() {}

  formatName(rawName) {
    return rawName.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
