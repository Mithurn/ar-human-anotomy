import * as THREE from "three";
import { ANATOMY_DATA, GUIDED_LEARNING } from "./AnatomyData.js";

export class LabelSystem {
  constructor(state, camera, interaction) {
    this.state = state;
    this.camera = camera;
    this.interaction = interaction;
    this.raycaster = new THREE.Raycaster();
    this.tapPoint = new THREE.Vector2();
    this.visible = false;
    this.hotspotLayer = document.getElementById("hotspot-layer");
    this.hotspotButtons = new Map();
    this.activePartKey = null;
    this.currentTourIndex = 0;
    this.tmpVector = new THREE.Vector3();
    this.tmpBox = new THREE.Box3();
    this.tmpCenter = new THREE.Vector3();
    this.tmpSize = new THREE.Vector3();

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
    document.getElementById("label-prev").addEventListener("click", () => this.stepTour(-1));
    document.getElementById("label-next").addEventListener("click", () => this.stepTour(1));
  }

  onTap() {
    if (this.shouldUseGuidedLearning()) return;
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

  show(name, desc, whyItMatters = "", tourState = null) {
    document.getElementById("label-kicker").textContent = this.shouldUseGuidedLearning()
      ? "Selected Part"
      : "Anatomy Detail";
    document.getElementById("label-name").textContent = name;
    document.getElementById("label-desc").textContent = desc;
    const why = document.getElementById("label-why");
    if (whyItMatters) {
      why.textContent = `Why it matters: ${whyItMatters}`;
      why.classList.remove("hidden");
    } else {
      why.classList.add("hidden");
    }

    const tour = document.getElementById("label-tour");
    if (tourState) {
      document.getElementById("label-progress").textContent = `${tourState.index + 1} / ${tourState.total}`;
      tour.classList.remove("hidden");
    } else {
      tour.classList.add("hidden");
    }

    document.getElementById("label-popup").classList.remove("hidden");
    this.visible = true;
  }

  hide() {
    document.getElementById("label-popup").classList.add("hidden");
    this.visible = false;
    this.activePartKey = null;
    this.updateHotspotState();
  }

  update() {
    if (this.shouldUseGuidedLearning()) {
      this.renderGuidedHotspots();
      return;
    }

    this.clearHotspots();
  }

  shouldUseGuidedLearning() {
    return this.state.selectedOrgan === "lungs" && this.state.currentModel && !this.state.xrSession;
  }

  renderGuidedHotspots() {
    const steps = GUIDED_LEARNING.lungs;
    this.tmpBox.setFromObject(this.state.currentModel);
    this.tmpBox.getCenter(this.tmpCenter);
    this.tmpBox.getSize(this.tmpSize);

    steps.forEach((step, index) => {
      const button = this.getOrCreateHotspot(step, index);

      this.tmpVector.set(
        this.tmpCenter.x + (this.tmpSize.x * step.anchor.x),
        this.tmpCenter.y + (this.tmpSize.y * step.anchor.y),
        this.tmpCenter.z + (this.tmpSize.z * step.anchor.z)
      );

      this.tmpVector.project(this.camera);
      const visible = this.tmpVector.z > -1 && this.tmpVector.z < 1;
      const x = ((this.tmpVector.x + 1) * 0.5) * window.innerWidth;
      const y = ((1 - this.tmpVector.y) * 0.5) * window.innerHeight;

      button.style.left = `${x}px`;
      button.style.top = `${y}px`;
      button.classList.toggle("hidden", !visible);
    });

    this.updateHotspotState();
  }

  getOrCreateHotspot(step, index) {
    if (this.hotspotButtons.has(step.key)) {
      return this.hotspotButtons.get(step.key);
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "hotspot-btn";
    button.dataset.label = step.label;
    button.setAttribute("aria-label", step.label);
    button.addEventListener("click", () => this.showGuidedPart(index));
    this.hotspotLayer.appendChild(button);
    this.hotspotButtons.set(step.key, button);
    return button;
  }

  clearHotspots() {
    this.hotspotButtons.forEach((button) => button.remove());
    this.hotspotButtons.clear();
  }

  showGuidedPart(index) {
    const steps = GUIDED_LEARNING.lungs;
    const step = steps[index];
    const data = ANATOMY_DATA.lungs[step.key];
    if (!data) return;

    this.currentTourIndex = index;
    this.activePartKey = step.key;
    this.show(data.name, data.description, data.whyItMatters, {
      index,
      total: steps.length
    });
    this.updateHotspotState();
  }

  stepTour(direction) {
    if (!this.shouldUseGuidedLearning()) return;

    const steps = GUIDED_LEARNING.lungs;
    const nextIndex = (this.currentTourIndex + direction + steps.length) % steps.length;
    this.showGuidedPart(nextIndex);
  }

  startGuidedLearning() {
    if (!this.shouldUseGuidedLearning()) return;
    this.activePartKey = null;
    this.updateHotspotState();
    this.hide();
  }

  updateHotspotState() {
    this.hotspotButtons.forEach((button, key) => {
      button.classList.toggle("active", key === this.activePartKey);
    });
  }

  formatName(rawName) {
    return rawName.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
