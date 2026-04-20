import * as THREE from "three";
import { SelectionUI } from "./js/SelectionUI.js";
import { ARSession } from "./js/ARSession.js";
import { ModelLoader } from "./js/ModelLoader.js";
import { ModelInteraction } from "./js/ModelInteraction.js";
import { LabelSystem } from "./js/LabelSystem.js";
import { Reticle } from "./js/Reticle.js";

const state = {
  selectedOrgan: null,
  selectedAge: null,
  selectedGender: null,
  modelPlaced: false,
  currentModel: null,
  xrSession: null
};

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("ar-canvas"),
  antialias: true,
  alpha: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  20
);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
directionalLight.position.set(1, 3, 2);
scene.add(directionalLight);

const selectionUI = new SelectionUI(state, onStartAR);
const reticle = new Reticle(scene);
const modelLoader = new ModelLoader(scene, state);
const interaction = new ModelInteraction(state, renderer);
const labelSystem = new LabelSystem(state, camera, interaction);
const arSession = new ARSession(renderer, state, reticle, modelLoader, labelSystem);

selectionUI.init();
updateSupportNote();

function onStartAR() {
  document.getElementById("selection-screen").classList.add("hidden");
  document.getElementById("ar-screen").classList.remove("hidden");
  document.getElementById("ar-title").textContent = capitalize(state.selectedOrgan);
  document.getElementById("hint-text").textContent = "Rotate, zoom, and tap blue points to explore";
  document.getElementById("ar-status").textContent = "";
  arSession.startObjectMode();
}

document.getElementById("enter-ar-btn").addEventListener("click", () => {
  arSession.enterAR();
});

document.getElementById("back-btn").addEventListener("click", () => {
  arSession.stop();
  clearModel();
  document.getElementById("ar-screen").classList.add("hidden");
  document.getElementById("selection-screen").classList.remove("hidden");
  document.getElementById("hint-text").textContent = "Rotate, zoom, and tap blue points to explore";
  document.getElementById("ar-status").textContent = "";
  labelSystem.hide();
});

document.getElementById("reset-btn").addEventListener("click", () => {
  clearModel();
  reticle.show();
  document.getElementById("hint-text").textContent = "Rotate, zoom, and tap blue points to explore";
  labelSystem.hide();
  document.getElementById("ar-status").textContent = "";
  arSession.startObjectMode();
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.setAnimationLoop((timestamp, frame) => {
  if (frame) {
    arSession.onFrame(frame);
  }

  labelSystem.update();
  renderer.render(scene, camera);
});

function clearModel() {
  if (!state.currentModel) {
    state.modelPlaced = false;
    return;
  }

  scene.remove(state.currentModel);
  state.currentModel.traverse?.((child) => {
    if (child.geometry) child.geometry.dispose?.();
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material.dispose?.());
      } else {
        child.material.dispose?.();
      }
    }
  });
  state.currentModel = null;
  state.modelPlaced = false;
}

async function updateSupportNote() {
  const supportNote = document.getElementById("support-note");
  const arSupported = navigator.xr && await navigator.xr.isSessionSupported?.("immersive-ar");
  const quickLookReady = /iPhone|iPad|iPod/i.test(navigator.userAgent || "");

  if (arSupported) {
    supportNote.textContent = "Immersive AR detected. This should launch on a supported mobile browser over HTTPS or localhost.";
    return;
  }

  if (quickLookReady) {
    supportNote.textContent = "iPhone detected. Browser preview works now, and native AR Quick Look will work after matching USDZ files are added.";
    return;
  }

  supportNote.textContent = "Immersive AR is not available here. The app still runs in preview mode, but markerless AR requires a supported mobile browser.";
}

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
}
