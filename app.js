import { ANATOMY_DATA } from "./js/AnatomyData.js";

const MODEL_CONFIG = {
  heart: {
    title: "Heart",
    description:
      "Inspect a realistic cardiac model, then launch it into your room in AR for scale and placement.",
    scale: "1 1 1"
  },
  lungs: {
    title: "Lungs",
    description:
      "Study the respiratory system with guided hotspots that explain the major structures and their roles.",
    scale: "1 1 1"
  },
  brain: {
    title: "Brain",
    description:
      "Explore a detailed brain model and use AR to compare its size and shape against the real world.",
    scale: "1 1 1"
  }
};

const HOTSPOT_CONFIG = {
  lungs: [
    { key: "trachea", label: "Trachea", position: "0m 0.22m 0.08m", normal: "0m 1m 0m" },
    { key: "bronchi", label: "Bronchi", position: "0m 0.08m 0.08m", normal: "0m 0.8m 0.2m" },
    { key: "left_lung", label: "Left Lung", position: "-0.11m -0.02m 0.05m", normal: "-0.5m 0.4m 0.8m" },
    { key: "right_lung", label: "Right Lung", position: "0.11m -0.02m 0.05m", normal: "0.5m 0.4m 0.8m" },
    { key: "pleura", label: "Pleura", position: "0.16m -0.02m 0.08m", normal: "0.9m 0.2m 0.4m" },
    { key: "alveoli", label: "Alveoli", position: "-0.05m -0.11m 0.06m", normal: "-0.2m -0.2m 1m" },
    { key: "diaphragm", label: "Diaphragm", position: "0m -0.21m 0.03m", normal: "0m -1m 0.2m" }
  ],
  heart: [
    { key: "left_ventricle", label: "Left Ventricle", position: "-0.01m -0.03m 0.07m", normal: "0m 0m 1m" },
    { key: "right_ventricle", label: "Right Ventricle", position: "0.03m -0.02m 0.06m", normal: "0.2m 0m 1m" },
    { key: "left_atrium", label: "Left Atrium", position: "-0.03m 0.05m 0.03m", normal: "-0.2m 0.4m 0.9m" },
    { key: "aorta", label: "Aorta", position: "0.01m 0.12m 0m", normal: "0m 1m 0.2m" },
    { key: "coronary_artery", label: "Coronary Artery", position: "0m 0.01m 0.09m", normal: "0m 0.1m 1m" }
  ],
  brain: [
    { key: "cerebrum", label: "Cerebrum", position: "0m 0.05m 0.08m", normal: "0m 0.3m 1m" },
    { key: "frontal_lobe", label: "Frontal Lobe", position: "0m 0.06m 0.14m", normal: "0m 0.2m 1m" },
    { key: "parietal_lobe", label: "Parietal Lobe", position: "0.03m 0.08m 0.02m", normal: "0.3m 0.5m 0.8m" },
    { key: "temporal_lobe", label: "Temporal Lobe", position: "0.12m -0.01m 0.03m", normal: "1m 0.2m 0.5m" },
    { key: "occipital_lobe", label: "Occipital Lobe", position: "0m 0.02m -0.1m", normal: "0m 0.2m -1m" },
    { key: "cerebellum", label: "Cerebellum", position: "0m -0.08m -0.06m", normal: "0m -0.3m -1m" },
    { key: "brain_stem", label: "Brain Stem", position: "0m -0.14m 0.01m", normal: "0m -1m 0.2m" }
  ]
};

const state = {
  organ: "heart",
  age: "adult",
  gender: "male",
  selectedPart: null
};

const viewer = document.getElementById("anatomy-viewer");
const viewerTitle = document.getElementById("viewer-title");
const modelName = document.getElementById("model-name");
const modelProfile = document.getElementById("model-profile");
const modelDescription = document.getElementById("model-description");
const supportNote = document.getElementById("support-note");
const arLaunchButton = document.getElementById("ar-launch-btn");
const partDots = document.getElementById("part-dots");
const partTitle = document.getElementById("part-title");
const partText = document.getElementById("part-text");
const partWhy = document.getElementById("part-why");
const partList = document.getElementById("part-list");

document.querySelectorAll("[data-organ]").forEach((button) => {
  button.addEventListener("click", () => {
    state.organ = button.dataset.organ;
    state.selectedPart = null;
    syncSelectionState("organ", state.organ);
    updateViewer();
  });
});

document.querySelectorAll("[data-age]").forEach((button) => {
  button.addEventListener("click", () => {
    state.age = button.dataset.age;
    syncSelectionState("age", state.age);
    updateViewer();
  });
});

document.querySelectorAll("[data-gender]").forEach((button) => {
  button.addEventListener("click", () => {
    state.gender = button.dataset.gender;
    syncSelectionState("gender", state.gender);
    updateViewer();
  });
});

arLaunchButton.addEventListener("click", () => {
  if (typeof viewer.activateAR === "function") {
    viewer.activateAR();
    return;
  }

  supportNote.textContent =
    "AR launch is not available in this browser. Open the page on a supported phone over HTTPS.";
});

viewer.addEventListener("error", () => {
  supportNote.textContent =
    "The selected model could not be loaded. Check that the matching GLB and USDZ files exist.";
});

updateViewer();
updateSupportMessage();

function updateViewer() {
  const config = MODEL_CONFIG[state.organ];
  const glbPath = getGlbPath();
  const usdzPath = getUsdzPath();

  viewer.src = glbPath;
  viewer.setAttribute("ios-src", usdzPath);
  viewer.setAttribute("scale", config.scale);
  viewerTitle.textContent = config.title;
  modelName.textContent = config.title;
  modelProfile.textContent = `${capitalize(state.age)} ${capitalize(state.gender)}`;
  modelDescription.textContent = config.description;

  renderHotspots();
  renderPartList();
  selectDefaultPart();
}

function renderHotspots() {
  viewer.querySelectorAll(".hotspot-dot").forEach((node) => node.remove());

  const hotspots = HOTSPOT_CONFIG[state.organ] ?? [];
  hotspots.forEach((hotspot) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hotspot-dot";
    button.slot = `hotspot-${hotspot.key}`;
    button.dataset.part = hotspot.key;
    button.setAttribute("data-position", hotspot.position);
    button.setAttribute("data-normal", hotspot.normal);
    button.setAttribute("aria-label", hotspot.label);
    button.addEventListener("click", () => selectPart(hotspot.key));
    viewer.appendChild(button);
  });

  syncHotspotState();
}

function renderPartList() {
  partList.innerHTML = "";
  const hotspots = HOTSPOT_CONFIG[state.organ] ?? [];

  hotspots.forEach((hotspot) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "part-pill";
    button.textContent = hotspot.label;
    button.dataset.part = hotspot.key;
    button.addEventListener("click", () => selectPart(hotspot.key));
    partList.appendChild(button);
  });

  syncPartListState();
}

function selectDefaultPart() {
  const firstHotspot = HOTSPOT_CONFIG[state.organ]?.[0]?.key ?? null;
  state.selectedPart = firstHotspot;
  updatePartPanel();
  syncHotspotState();
  syncPartListState();
}

function selectPart(partKey) {
  state.selectedPart = partKey;
  updatePartPanel();
  syncHotspotState();
  syncPartListState();
}

function updatePartPanel() {
  const data = ANATOMY_DATA[state.organ]?.[state.selectedPart];
  if (!data) {
    partTitle.textContent = "Select a highlighted part";
    partText.textContent = "Tap a glowing point on the model to see a short explanation here.";
    partWhy.textContent = "";
    partWhy.hidden = true;
    return;
  }

  partTitle.textContent = data.name;
  partText.textContent = data.description;

  if (data.whyItMatters) {
    partWhy.hidden = false;
    partWhy.textContent = `Why it matters: ${data.whyItMatters}`;
  } else {
    partWhy.hidden = true;
    partWhy.textContent = "";
  }
}

function syncHotspotState() {
  viewer.querySelectorAll(".hotspot-dot").forEach((dot) => {
    dot.classList.toggle("is-active", dot.dataset.part === state.selectedPart);
  });
}

function syncPartListState() {
  partList.querySelectorAll(".part-pill").forEach((pill) => {
    pill.classList.toggle("is-active", pill.dataset.part === state.selectedPart);
  });
}

function updateSupportMessage() {
  const ua = navigator.userAgent || "";
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  if (isIOS) {
    supportNote.textContent =
      "iPhone detected. AR opens in Quick Look with the selected profile-specific USDZ model.";
    return;
  }

  if (isAndroid) {
    supportNote.textContent =
      "Android detected. AR should launch through WebXR or Scene Viewer on supported devices.";
    return;
  }

  supportNote.textContent =
    "Desktop is in study mode. Use the highlighted points to learn the anatomy, then switch to a phone for AR.";
}

function getGlbPath() {
  return `models/${state.organ}/${state.organ}.glb`;
}

function getUsdzPath() {
  return `models/${state.organ}/${state.organ}_${state.age}_${state.gender}.usdz`;
}

function syncSelectionState(key, value) {
  const selector = `[data-${key}]`;
  document.querySelectorAll(selector).forEach((button) => {
    button.classList.toggle("is-active", button.dataset[key] === value);
  });
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
