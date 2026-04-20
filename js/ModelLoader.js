import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const SIZE_PROFILE = {
  heart: {
    adult: { male: 0.12, female: 0.11 },
    child: { male: 0.084, female: 0.077 }
  },
  lungs: {
    adult: { male: 0.28, female: 0.26 },
    child: { male: 0.196, female: 0.182 }
  },
  brain: {
    adult: { male: 0.155, female: 0.145 },
    child: { male: 0.109, female: 0.102 }
  }
};

export class ModelLoader {
  constructor(scene, state) {
    this.scene = scene;
    this.state = state;
    this.loader = new GLTFLoader();
  }

  getModelCandidates() {
    const { selectedOrgan, selectedAge, selectedGender } = this.state;
    return [
      `models/${selectedOrgan}/${selectedOrgan}_${selectedAge}_${selectedGender}.glb`,
      `models/${selectedOrgan}/${selectedOrgan}.glb`
    ];
  }

  getQuickLookCandidates() {
    const { selectedOrgan, selectedAge, selectedGender } = this.state;
    return [
      `models/${selectedOrgan}/${selectedOrgan}_${selectedAge}_${selectedGender}.usdz`,
      `models/${selectedOrgan}/${selectedOrgan}.usdz`
    ];
  }

  place(position, onPlaced) {
    document.getElementById("ar-status").textContent = "Loading model...";
    this.loadFirstAvailable(this.getModelCandidates(), position, onPlaced);
  }

  loadFirstAvailable(candidates, position, onPlaced) {
    const [path, ...rest] = candidates;

    if (!path) {
      const placeholder = this.createPlaceholderModel(this.state.selectedOrgan);
      this.prepareModel(placeholder, position);
      document.getElementById("ar-status").textContent = "Using placeholder anatomy model.";
      onPlaced?.();
      return;
    }

    this.loader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
        this.prepareModel(model, position);
        onPlaced?.();
      },
      (progress) => {
        if (!progress.total) return;
        const pct = Math.round((progress.loaded / progress.total) * 100);
        document.getElementById("ar-status").textContent = `Loading... ${pct}%`;
      },
      () => {
        this.loadFirstAvailable(rest, position, onPlaced);
      }
    );
  }

  prepareModel(model, position) {
    const targetSize = this.getTargetSize();

    this.fitModelToSize(model, targetSize);
    this.groundModel(model);
    model.position.copy(position);

    model.traverse((child) => {
      if (!child.isMesh) return;
      child.userData.isAnatomyPart = true;
      child.userData.partName = child.name || `${this.state.selectedOrgan}_part`;
      child.castShadow = false;
      child.receiveShadow = false;
    });

    this.scene.add(model);
    this.state.currentModel = model;
    this.state.modelPlaced = true;
  }

  getTargetSize() {
    const { selectedOrgan, selectedAge, selectedGender } = this.state;
    return SIZE_PROFILE[selectedOrgan]?.[selectedAge]?.[selectedGender] ?? 0.15;
  }

  fitModelToSize(model, targetSize) {
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);

    const maxDimension = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(maxDimension) || maxDimension <= 0) return;

    const scaleFactor = targetSize / maxDimension;
    model.scale.multiplyScalar(scaleFactor);
  }

  groundModel(model) {
    const box = new THREE.Box3().setFromObject(model);
    if (!Number.isFinite(box.min.y)) return;

    model.position.y -= box.min.y;
  }

  createPlaceholderModel(organ) {
    const group = new THREE.Group();
    group.name = `${organ}_placeholder`;

    if (organ === "heart") {
      group.add(this.makeMesh(new THREE.SphereGeometry(0.4, 32, 24), 0xcc2233, "left_ventricle", -0.12, -0.05, 0));
      group.add(this.makeMesh(new THREE.SphereGeometry(0.34, 32, 24), 0xdd4455, "right_ventricle", 0.18, -0.02, 0.02));
      group.add(this.makeMesh(new THREE.SphereGeometry(0.2, 24, 20), 0xff8899, "left_atrium", -0.1, 0.38, 0));
      group.add(this.makeMesh(new THREE.SphereGeometry(0.18, 24, 20), 0xffaabb, "right_atrium", 0.18, 0.34, 0));
      group.add(this.makeMesh(new THREE.CylinderGeometry(0.09, 0.11, 0.85, 18), 0xf5c542, "aorta", -0.02, 0.82, 0.03, Math.PI / 10));
    } else if (organ === "lungs") {
      group.add(this.makeMesh(new THREE.SphereGeometry(0.42, 28, 24), 0x5aa9ff, "left_lung", -0.42, 0, 0));
      group.add(this.makeMesh(new THREE.SphereGeometry(0.5, 28, 24), 0x7fc0ff, "right_lung", 0.42, 0, 0));
      group.add(this.makeMesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 18), 0xd3e8ff, "trachea", 0, 0.62, 0));
      group.add(this.makeMesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 18), 0xa6d6ff, "bronchi", -0.18, 0.2, 0, Math.PI / 3, 0, Math.PI / 2));
      group.add(this.makeMesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 18), 0xa6d6ff, "bronchi", 0.18, 0.2, 0, Math.PI / 3, 0, -Math.PI / 2));
      group.add(this.makeMesh(new THREE.TorusGeometry(0.75, 0.05, 16, 60, Math.PI), 0x7cd3ff, "diaphragm", 0, -0.48, 0, Math.PI / 2));
    } else if (organ === "brain") {
      group.add(this.makeMesh(new THREE.SphereGeometry(0.68, 32, 28), 0xd49cff, "cerebrum", 0, 0.1, 0));
      group.add(this.makeMesh(new THREE.SphereGeometry(0.28, 24, 20), 0xbf7cff, "cerebellum", 0, -0.52, -0.26));
      group.add(this.makeMesh(new THREE.CapsuleGeometry(0.12, 0.45, 6, 12), 0x8f59e6, "brain_stem", 0, -0.62, 0.08));
      group.add(this.makeMesh(new THREE.BoxGeometry(0.4, 0.22, 0.22), 0xe7b9ff, "frontal_lobe", 0, 0.18, 0.52));
      group.add(this.makeMesh(new THREE.BoxGeometry(0.26, 0.18, 0.3), 0xc590ff, "occipital_lobe", 0, 0.02, -0.58));
    }

    return group;
  }

  makeMesh(geometry, color, name, x, y, z, rx = 0, ry = 0, rz = 0) {
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({
        color,
        metalness: 0.05,
        roughness: 0.45
      })
    );
    mesh.name = name;
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.userData.isAnatomyPart = true;
    mesh.userData.partName = name;
    return mesh;
  }
}
