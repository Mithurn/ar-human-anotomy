import { ANATOMY_DATA } from "./js/AnatomyData.js";

const ORGAN_CONFIG = {
  heart: {
    title: "Heart",
    tagline: "Cardiac structure",
    description:
      "Inspect a realistic cardiac model, then launch it into your room in AR for scale and placement.",
    organScale: 1,
    arReady: true
  },
  lungs: {
    title: "Lungs",
    tagline: "Respiratory system",
    description:
      "Study the respiratory system with guided hotspots that explain the major structures and their roles.",
    organScale: 1.02,
    arReady: true
  },
  brain: {
    title: "Brain",
    tagline: "Neural anatomy",
    description:
      "Explore a detailed brain model and use AR to compare its size and shape against the real world.",
    organScale: 0.96,
    arReady: true
  },
  liver: {
    title: "Liver",
    tagline: "Metabolic organ",
    description:
      "Review the liver’s major regions and how it supports digestion, detoxification, and energy storage.",
    organScale: 1.08,
    arReady: false
  },
  kidney: {
    title: "Kidney",
    tagline: "Urinary organ",
    description:
      "Inspect the kidney and the structures that filter blood, regulate fluids, and produce urine.",
    organScale: 0.92,
    arReady: false
  },
  stomach: {
    title: "Stomach",
    tagline: "Digestive organ",
    description:
      "Explore the stomach and the regions that mix food, acids, and enzymes before digestion continues.",
    organScale: 1.02,
    arReady: false
  },
  eye: {
    title: "Eye",
    tagline: "Visual system",
    description:
      "Use the study view to identify the structures that focus light and send visual signals to the brain.",
    organScale: 0.78,
    arReady: false
  },
  pancreas: {
    title: "Pancreas",
    tagline: "Endocrine and digestive organ",
    description:
      "Inspect the pancreas and learn how it supports digestion while also regulating blood sugar.",
    organScale: 0.88,
    arReady: false
  },
  intestines: {
    title: "Intestines",
    tagline: "Digestive tract",
    description:
      "Study the intestinal tract where nutrient absorption, water recovery, and waste formation take place.",
    organScale: 1.06,
    arReady: false
  },
  uterus: {
    title: "Uterus",
    tagline: "Reproductive organ",
    description:
      "Explore the uterus and the surrounding structures involved in the menstrual cycle and pregnancy.",
    organScale: 0.94,
    arReady: false
  },
  bladder: {
    title: "Bladder",
    tagline: "Urinary storage organ",
    description:
      "Review the bladder and nearby urinary structures that temporarily store and route urine.",
    organScale: 0.92,
    arReady: false
  }
};

const HOTSPOT_CONFIG = {
  heart: [
    { key: "left_ventricle", label: "Left Ventricle", position: "-0.01m -0.03m 0.07m", normal: "0m 0m 1m" },
    { key: "right_ventricle", label: "Right Ventricle", position: "0.03m -0.02m 0.06m", normal: "0.2m 0m 1m" },
    { key: "left_atrium", label: "Left Atrium", position: "-0.03m 0.05m 0.03m", normal: "-0.2m 0.4m 0.9m" },
    { key: "aorta", label: "Aorta", position: "0.01m 0.12m 0m", normal: "0m 1m 0.2m" },
    { key: "coronary_artery", label: "Coronary Artery", position: "0m 0.01m 0.09m", normal: "0m 0.1m 1m" }
  ],
  lungs: [
    { key: "trachea", label: "Trachea", position: "0m 0.22m 0.08m", normal: "0m 1m 0m" },
    { key: "bronchi", label: "Bronchi", position: "0m 0.08m 0.08m", normal: "0m 0.8m 0.2m" },
    { key: "left_lung", label: "Left Lung", position: "-0.11m -0.02m 0.05m", normal: "-0.5m 0.4m 0.8m" },
    { key: "right_lung", label: "Right Lung", position: "0.11m -0.02m 0.05m", normal: "0.5m 0.4m 0.8m" },
    { key: "alveoli", label: "Alveoli", position: "-0.05m -0.11m 0.06m", normal: "-0.2m -0.2m 1m" }
  ],
  brain: [
    { key: "cerebrum", label: "Cerebrum", position: "0m 0.05m 0.08m", normal: "0m 0.3m 1m" },
    { key: "frontal_lobe", label: "Frontal Lobe", position: "0m 0.06m 0.14m", normal: "0m 0.2m 1m" },
    { key: "temporal_lobe", label: "Temporal Lobe", position: "0.12m -0.01m 0.03m", normal: "1m 0.2m 0.5m" },
    { key: "cerebellum", label: "Cerebellum", position: "0m -0.08m -0.06m", normal: "0m -0.3m -1m" },
    { key: "brain_stem", label: "Brain Stem", position: "0m -0.14m 0.01m", normal: "0m -1m 0.2m" }
  ],
  liver: [
    { key: "right_lobe", label: "Right Lobe", position: "0.13m 0.03m 0.08m", normal: "0.5m 0.1m 1m" },
    { key: "left_lobe", label: "Left Lobe", position: "-0.12m 0.04m 0.08m", normal: "-0.5m 0.2m 1m" },
    { key: "gallbladder", label: "Gallbladder", position: "0.03m -0.06m 0.1m", normal: "0m -0.2m 1m" },
    { key: "hepatic_artery", label: "Hepatic Artery", position: "0m -0.01m 0.06m", normal: "0m 0m 1m" }
  ],
  kidney: [
    { key: "cortex", label: "Cortex", position: "0m 0.05m 0.08m", normal: "0m 0.2m 1m" },
    { key: "medulla", label: "Medulla", position: "0m -0.01m 0.04m", normal: "0m 0m 1m" },
    { key: "renal_pelvis", label: "Renal Pelvis", position: "0.05m -0.06m 0.06m", normal: "0.5m -0.1m 1m" },
    { key: "ureter", label: "Ureter", position: "0.06m -0.15m 0.03m", normal: "0.4m -0.8m 0.4m" }
  ],
  stomach: [
    { key: "esophagus", label: "Esophagus", position: "-0.02m 0.16m 0.03m", normal: "-0.1m 0.9m 0.4m" },
    { key: "fundus", label: "Fundus", position: "-0.08m 0.11m 0.08m", normal: "-0.5m 0.3m 1m" },
    { key: "body", label: "Body", position: "0.03m 0.01m 0.1m", normal: "0.2m 0.1m 1m" },
    { key: "pylorus", label: "Pylorus", position: "0.12m -0.11m 0.05m", normal: "0.6m -0.3m 0.8m" }
  ],
  eye: [
    { key: "cornea", label: "Cornea", position: "0m 0m 0.15m", normal: "0m 0m 1m" },
    { key: "iris", label: "Iris", position: "0m 0m 0.12m", normal: "0m 0m 1m" },
    { key: "lens", label: "Lens", position: "0m 0m 0.05m", normal: "0m 0m 1m" },
    { key: "optic_nerve", label: "Optic Nerve", position: "0m -0.01m -0.12m", normal: "0m 0m -1m" }
  ],
  pancreas: [
    { key: "head", label: "Head", position: "0.14m -0.03m 0.06m", normal: "0.6m -0.1m 0.8m" },
    { key: "body", label: "Body", position: "0.02m 0m 0.07m", normal: "0.1m 0m 1m" },
    { key: "tail", label: "Tail", position: "-0.15m 0.03m 0.07m", normal: "-0.6m 0.1m 0.8m" },
    { key: "pancreatic_duct", label: "Pancreatic Duct", position: "0m -0.03m 0.03m", normal: "0m -0.1m 1m" }
  ],
  intestines: [
    { key: "duodenum", label: "Duodenum", position: "0.11m 0.12m 0.06m", normal: "0.4m 0.3m 0.8m" },
    { key: "small_intestine", label: "Small Intestine", position: "0m -0.01m 0.1m", normal: "0m 0m 1m" },
    { key: "large_intestine", label: "Large Intestine", position: "0.18m 0.05m 0.08m", normal: "0.8m 0.1m 0.5m" },
    { key: "rectum", label: "Rectum", position: "0m -0.21m 0.04m", normal: "0m -1m 0.3m" }
  ],
  uterus: [
    { key: "fundus", label: "Fundus", position: "0m 0.12m 0.07m", normal: "0m 0.5m 0.8m" },
    { key: "body", label: "Body", position: "0m 0.03m 0.08m", normal: "0m 0.1m 1m" },
    { key: "cervix", label: "Cervix", position: "0m -0.11m 0.05m", normal: "0m -0.7m 0.6m" },
    { key: "fallopian_tube", label: "Fallopian Tube", position: "0.14m 0.1m 0.03m", normal: "0.7m 0.3m 0.5m" }
  ],
  bladder: [
    { key: "bladder_body", label: "Bladder Body", position: "0m 0.01m 0.08m", normal: "0m 0m 1m" },
    { key: "detrusor_muscle", label: "Detrusor Muscle", position: "0.07m -0.02m 0.07m", normal: "0.5m -0.1m 0.8m" },
    { key: "ureter_opening", label: "Ureter Opening", position: "0.05m 0.08m 0.03m", normal: "0.3m 0.5m 0.8m" },
    { key: "urethra", label: "Urethra", position: "0m -0.14m 0.03m", normal: "0m -1m 0.2m" }
  ]
};

const AGE_SCALE = {
  adult: 1,
  child: 0.78
};

const GENDER_SCALE = {
  male: 1,
  female: 0.94
};

const STEP_ORDER = ["organ", "age", "gender"];

const state = {
  step: "landing",
  organ: null,
  age: "adult",
  gender: "male",
  selectedPart: null
};

const landingScreen = document.getElementById("landing-screen");
const setupScreen = document.getElementById("setup-screen");
const viewerScreen = document.getElementById("viewer-screen");
const getStartedButton = document.getElementById("get-started-btn");
const backStepButton = document.getElementById("back-step-btn");
const skipStepButton = document.getElementById("skip-step-btn");
const continueStepButton = document.getElementById("continue-step-btn");
const changeSelectionButton = document.getElementById("change-selection-btn");
const restartButton = document.getElementById("restart-btn");
const stepEyebrow = document.getElementById("step-eyebrow");
const stepTitle = document.getElementById("step-title");
const progressFill = document.getElementById("progress-fill");
const stepTrack = document.getElementById("step-track");
const organStep = document.getElementById("organ-step");
const ageStep = document.getElementById("age-step");
const genderStep = document.getElementById("gender-step");

const viewer = document.getElementById("anatomy-viewer");
const viewerTitle = document.getElementById("viewer-title");
const modelName = document.getElementById("model-name");
const modelProfile = document.getElementById("model-profile");
const modelDescription = document.getElementById("model-description");
const supportNote = document.getElementById("support-note");
const arLaunchButton = document.getElementById("ar-launch-btn");
const partTitle = document.getElementById("part-title");
const partText = document.getElementById("part-text");
const partWhy = document.getElementById("part-why");
const partList = document.getElementById("part-list");

bootstrap();

function bootstrap() {
  renderSetupOptions();
  attachEvents();
  showScreen("landing");
  updateSupportMessage();
}

function attachEvents() {
  getStartedButton.addEventListener("click", () => {
    state.step = "organ";
    revealSetup();
    renderStep();
    scrollToSection(setupScreen);
  });

  backStepButton.addEventListener("click", handleBackStep);
  skipStepButton.addEventListener("click", handleSkipStep);
  continueStepButton.addEventListener("click", handleContinueStep);

  changeSelectionButton.addEventListener("click", () => {
    state.step = "organ";
    revealSetup();
    renderStep();
    scrollToSection(setupScreen);
  });

  restartButton.addEventListener("click", () => {
    state.organ = null;
    state.age = "adult";
    state.gender = "male";
    state.selectedPart = null;
    state.step = "landing";
    showScreen("landing");
    scrollToSection(landingScreen);
  });

  arLaunchButton.addEventListener("click", () => {
    if (viewer.canActivateAR && typeof viewer.activateAR === "function" && ORGAN_CONFIG[state.organ]?.arReady) {
      viewer.activateAR();
      return;
    }

    supportNote.textContent =
      ORGAN_CONFIG[state.organ]?.arReady
        ? "AR is not available on this device or browser. Open this demo on your iPhone in Safari."
        : `${ORGAN_CONFIG[state.organ]?.title} is currently available in study mode only. Add a matching USDZ file to enable iPhone AR.`;
  });

  viewer.addEventListener("error", () => {
    supportNote.textContent =
      "The selected model could not be loaded. Check that the matching GLB and USDZ files exist.";
  });

  viewer.addEventListener("load", () => {
    updateArAvailability();
  });
}

function renderSetupOptions() {
  organStep.innerHTML = Object.entries(ORGAN_CONFIG)
    .map(([key, config]) => {
      return `
        <button class="choice-card" type="button" data-choice-group="organ" data-value="${key}">
          <span class="choice-title">${config.title}</span>
          <span class="choice-meta">${config.tagline}</span>
        </button>
      `;
    })
    .join("");

  ageStep.innerHTML = `
    <div class="option-stack">
      <button class="choice-card wide" type="button" data-choice-group="age" data-value="adult">
        <span class="choice-title">Adult</span>
        <span class="choice-meta">Use full-size reference scaling for the selected organ.</span>
      </button>
      <button class="choice-card wide" type="button" data-choice-group="age" data-value="child">
        <span class="choice-title">Child</span>
        <span class="choice-meta">Use a smaller study scale for the selected organ.</span>
      </button>
    </div>
  `;

  genderStep.innerHTML = `
    <div class="option-stack">
      <button class="choice-card wide" type="button" data-choice-group="gender" data-value="male">
        <span class="choice-title">Male</span>
        <span class="choice-meta">Use the default male scale for the selected organ.</span>
      </button>
      <button class="choice-card wide" type="button" data-choice-group="gender" data-value="female">
        <span class="choice-title">Female</span>
        <span class="choice-meta">Use a slightly reduced female scale for the selected organ.</span>
      </button>
    </div>
  `;

  document.querySelectorAll("[data-choice-group]").forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.dataset.choiceGroup;
      const value = button.dataset.value;
      state[group] = value;
      syncChoiceState(group, value);
      updateContinueState();
    });
  });
}

function handleBackStep() {
  const index = STEP_ORDER.indexOf(state.step);
  if (index <= 0) {
    state.step = "landing";
    scrollToSection(landingScreen);
    return;
  }

  state.step = STEP_ORDER[index - 1];
  renderStep();
}

function handleSkipStep() {
  if (state.step === "age") {
    state.age = "adult";
  }

  if (state.step === "gender") {
    state.gender = "male";
  }

  syncChoiceState(state.step, state[state.step]);
  handleContinueStep();
}

function handleContinueStep() {
  if (state.step === "organ" && !state.organ) {
    return;
  }

  const index = STEP_ORDER.indexOf(state.step);
  if (index === STEP_ORDER.length - 1) {
    enterViewer();
    return;
  }

  state.step = STEP_ORDER[index + 1];
  renderStep();
}

function enterViewer() {
  if (!state.organ) {
    return;
  }

  showScreen("viewer");
  updateViewer();
  scrollToSection(viewerScreen);
}

function renderStep() {
  const stepIndex = STEP_ORDER.indexOf(state.step);
  stepEyebrow.textContent = `Step ${stepIndex + 1} of ${STEP_ORDER.length}`;
  progressFill.style.width = `${((stepIndex + 1) / STEP_ORDER.length) * 100}%`;
  stepTrack.style.transform = `translateX(-${stepIndex * 100}%)`;

  backStepButton.hidden = stepIndex < 1;
  skipStepButton.hidden = state.step === "organ";

  if (state.step === "organ") {
    stepTitle.textContent = "Choose an organ";
  } else if (state.step === "age") {
    stepTitle.textContent = "Choose an age group";
  } else {
    stepTitle.textContent = "Choose a gender";
  }

  updateContinueState();
}

function updateContinueState() {
  continueStepButton.textContent = state.step === "gender" ? "Open Model" : "Continue";
  continueStepButton.disabled = state.step === "organ" && !state.organ;
}

function updateViewer() {
  const config = ORGAN_CONFIG[state.organ];
  const glbPath = getGlbPath();
  const usdzPath = getUsdzPath();
  const scale = getPreviewScale();

  viewer.src = glbPath;
  if (usdzPath) {
    viewer.setAttribute("ios-src", usdzPath);
  } else {
    viewer.removeAttribute("ios-src");
  }
  viewer.setAttribute("scale", `${scale} ${scale} ${scale}`);

  viewerTitle.textContent = config.title;
  modelName.textContent = config.title;
  modelProfile.textContent = `${capitalize(state.age)} ${capitalize(state.gender)}`;
  modelDescription.textContent = config.description;

  renderHotspots();
  renderPartList();
  selectDefaultPart();
  updateSupportMessage();
  updateArAvailability();
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

function showScreen(screen) {
  landingScreen.hidden = false;
  landingScreen.classList.add("screen-active");

  if (screen === "landing") {
    setupScreen.hidden = true;
    setupScreen.classList.remove("screen-active");
    viewerScreen.hidden = true;
    viewerScreen.classList.remove("screen-active");
    return;
  }

  if (screen === "viewer") {
    setupScreen.hidden = false;
    setupScreen.classList.add("screen-active");
    viewerScreen.hidden = false;
    viewerScreen.classList.add("screen-active");
    return;
  }

  setupScreen.hidden = false;
  setupScreen.classList.add("screen-active");
  viewerScreen.hidden = true;
  viewerScreen.classList.remove("screen-active");
}

function revealSetup() {
  setupScreen.hidden = false;
  setupScreen.classList.add("screen-active");
  viewerScreen.hidden = true;
  viewerScreen.classList.remove("screen-active");
}

function scrollToSection(element) {
  element.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function updateSupportMessage() {
  const ua = navigator.userAgent || "";
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const config = ORGAN_CONFIG[state.organ];

  if (!config) {
    supportNote.textContent = "";
    return;
  }

  if (!config.arReady) {
    supportNote.textContent =
      `${config.title} is ready in study mode. Add a matching USDZ file later if you want iPhone AR for this organ.`;
    return;
  }

  if (isIOS && isSafari) {
    supportNote.textContent =
      "This organ is ready for iPhone Safari. Use View In AR to open Apple Quick Look.";
    return;
  }

  if (isIOS) {
    supportNote.textContent =
      "Open this demo in Safari for the most reliable Quick Look AR launch on iPhone.";
    return;
  }

  supportNote.textContent =
    "Desktop stays in study mode. Switch to iPhone Safari if you want to test Quick Look AR.";
}

function updateArAvailability() {
  const config = ORGAN_CONFIG[state.organ];
  const canLaunchAr = Boolean(config?.arReady && viewer.canActivateAR);
  arLaunchButton.disabled = !canLaunchAr;
  arLaunchButton.setAttribute("aria-disabled", String(!canLaunchAr));
}

function getGlbPath() {
  return `models/${state.organ}/${state.organ}.glb`;
}

function getUsdzPath() {
  const config = ORGAN_CONFIG[state.organ];
  if (!config?.arReady) {
    return "";
  }

  return `models/${state.organ}/${state.organ}_${state.age}_${state.gender}.usdz`;
}

function syncChoiceState(group, value) {
  document.querySelectorAll(`[data-choice-group="${group}"]`).forEach((button) => {
    button.classList.toggle("is-active", button.dataset.value === value);
  });
}

function getPreviewScale() {
  const organScale = ORGAN_CONFIG[state.organ]?.organScale ?? 1;
  const ageScale = AGE_SCALE[state.age] ?? 1;
  const genderScale = GENDER_SCALE[state.gender] ?? 1;
  return (organScale * ageScale * genderScale).toFixed(3);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
