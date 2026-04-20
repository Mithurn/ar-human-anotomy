# AR Human Anatomy Visualization System
## Full Project Blueprint — Three.js + WebXR
### For AI Coding Agents (Codex, Cursor, Claude, GPT-4)

---

> **READ THIS FIRST (For the AI Agent)**
> This document is the single source of truth for building an Augmented Reality Human Anatomy
> Visualization web app. Read every section before writing a single line of code.
> The app runs entirely in the browser — no Unity, no native app, no app store.
> The user opens a URL on their phone, grants camera permission, and sees 3D anatomy
> models placed on real-world surfaces like a table. Built with Three.js + WebXR Device API.

---

## 1. PROJECT SUMMARY

| Field | Value |
|---|---|
| App Name | AR Anatomy Visualizer |
| Type | Progressive Web App (PWA) |
| Runtime | Browser (Chrome on Android, Safari on iOS) |
| Core Tech | Three.js r158, WebXR Device API, GLTFLoader |
| Language | Vanilla JavaScript (ES Modules), HTML5, CSS3 |
| AR Type | Markerless — detects flat surfaces (tables, floors) via WebXR hit-test |
| 3D Models | GLTF/GLB format |
| No frameworks | No React, No Vue, No build tools needed. Just files. |
| Entry point | index.html |
| Works on | Android Chrome 81+, iOS 15+ Safari (limited), desktop for preview |

---

## 2. WHAT THE APP DOES (Feature Specification)

### Screen 1 — Selection UI
- Full-screen landing page with app title
- User picks ONE option from each group:
  - **Body System:** Heart | Lungs | Brain
  - **Age Group:** Child | Adult
  - **Gender:** Male | Female
- Selected buttons highlight visually
- "View in AR" button activates only when all 3 are selected
- Smooth transition animation into AR mode

### Screen 2 — AR Mode
- Phone camera opens fullscreen
- WebXR scans the environment for flat surfaces
- A glowing reticle (ring) appears on detected surfaces showing where the model will land
- Instructional text: "Point at a flat surface and tap to place"
- On tap → 3D anatomy model appears anchored to the real surface
- Model is correctly scaled:
  - Adult = life-size (heart ~12cm, lungs ~30cm, brain ~15cm)
  - Child = 70% of adult scale

### Screen 3 — Interaction Mode (after placement)
- **Rotate:** Single finger drag → rotates model on Y axis
- **Zoom:** Pinch two fingers → scales model up/down
- **Tap a part:** Ray is cast from camera through tap point → if it hits a named mesh:
  - A floating label card appears near that part
  - Shows: part name + 2-line description
  - Label always faces the camera (billboard)
  - Tap elsewhere or tap X → label dismisses
- **Reset button:** Removes placed model, returns to surface scanning
- **Back button:** Returns to Selection Screen

---

## 3. COMPLETE FILE & FOLDER STRUCTURE

```
ar-anatomy/
│
├── index.html                  ← Single HTML file, app shell
├── style.css                   ← All styles
├── app.js                      ← Main entry point, scene setup
│
├── js/
│   ├── SelectionUI.js          ← Manages selection screen logic
│   ├── ARSession.js            ← WebXR session start/stop, hit-test
│   ├── ModelLoader.js          ← Loads correct GLTF model based on selection
│   ├── ModelInteraction.js     ← Rotate, zoom, tap gesture handling
│   ├── LabelSystem.js          ← Tap-to-label, billboard labels, dismiss
│   ├── Reticle.js              ← AR placement reticle (glowing ring)
│   └── AnatomyData.js          ← All organ part names + descriptions
│
├── models/
│   ├── heart/
│   │   ├── heart_adult_male.glb
│   │   ├── heart_adult_female.glb
│   │   ├── heart_child_male.glb
│   │   └── heart_child_female.glb
│   ├── lungs/
│   │   ├── lungs_adult_male.glb
│   │   ├── lungs_adult_female.glb
│   │   ├── lungs_child_male.glb
│   │   └── lungs_child_female.glb
│   └── brain/
│       ├── brain_adult_male.glb
│       ├── brain_adult_female.glb
│       ├── brain_child_male.glb
│       └── brain_child_female.glb
│
├── assets/
│   ├── reticle.png             ← Optional reticle texture
│   └── icon-192.png            ← PWA icon
│
└── manifest.json               ← PWA manifest (installable on phone)
```

---

## 4. index.html — COMPLETE SPECIFICATION

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
  <meta name="theme-color" content="#0a0a0f" />
  <link rel="manifest" href="manifest.json" />
  <link rel="stylesheet" href="style.css" />
  <title>AR Anatomy Visualizer</title>
</head>
<body>

  <!-- ═══════════════════════════════════════════ -->
  <!-- SCREEN 1: SELECTION UI                      -->
  <!-- ═══════════════════════════════════════════ -->
  <div id="selection-screen">

    <div class="app-header">
      <h1>AR Anatomy</h1>
      <p class="subtitle">Visualizer</p>
    </div>

    <div class="selection-group">
      <label class="group-label">Body System</label>
      <div class="btn-group" id="organ-group">
        <button class="sel-btn" data-group="organ" data-value="heart">
          <span class="btn-icon">♥</span> Heart
        </button>
        <button class="sel-btn" data-group="organ" data-value="lungs">
          <span class="btn-icon">◎</span> Lungs
        </button>
        <button class="sel-btn" data-group="organ" data-value="brain">
          <span class="btn-icon">◉</span> Brain
        </button>
      </div>
    </div>

    <div class="selection-group">
      <label class="group-label">Age Group</label>
      <div class="btn-group" id="age-group">
        <button class="sel-btn" data-group="age" data-value="child">Child</button>
        <button class="sel-btn" data-group="age" data-value="adult">Adult</button>
      </div>
    </div>

    <div class="selection-group">
      <label class="group-label">Gender</label>
      <div class="btn-group" id="gender-group">
        <button class="sel-btn" data-group="gender" data-value="male">Male</button>
        <button class="sel-btn" data-group="gender" data-value="female">Female</button>
      </div>
    </div>

    <button id="start-ar-btn" class="primary-btn" disabled>
      View in AR →
    </button>

    <p class="ar-note">Requires Chrome on Android or Safari on iOS 15+</p>
  </div>

  <!-- ═══════════════════════════════════════════ -->
  <!-- SCREEN 2 & 3: AR VIEW                       -->
  <!-- ═══════════════════════════════════════════ -->
  <div id="ar-screen" class="hidden">

    <!-- Three.js renders into this canvas -->
    <canvas id="ar-canvas"></canvas>

    <!-- AR Overlay UI -->
    <div id="ar-overlay">

      <!-- Top bar -->
      <div id="ar-topbar">
        <button id="back-btn" class="icon-btn">← Back</button>
        <span id="ar-title">Heart — Adult Male</span>
        <button id="reset-btn" class="icon-btn">↺ Reset</button>
      </div>

      <!-- Instruction hint -->
      <div id="ar-hint">
        <span id="hint-text">Point at a flat surface and tap to place</span>
      </div>

      <!-- Label popup (hidden until tap) -->
      <div id="label-popup" class="hidden">
        <button id="label-close">✕</button>
        <h3 id="label-name">Left Ventricle</h3>
        <p id="label-desc">Description text here.</p>
      </div>

      <!-- Bottom bar -->
      <div id="ar-bottombar">
        <span id="ar-status">Searching for surface...</span>
      </div>

    </div>
  </div>

  <!-- Three.js via CDN -->
  <script type="importmap">
    {
      "imports": {
        "three": "https://unpkg.com/three@0.158.0/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.158.0/examples/jsm/"
      }
    }
  </script>

  <script type="module" src="app.js"></script>

</body>
</html>
```

---

## 5. style.css — COMPLETE SPECIFICATION

```css
/* ─── Reset & Base ─── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --accent: #00e5ff;
  --accent2: #7c4dff;
  --bg: #0a0a0f;
  --surface: #14141e;
  --surface2: #1e1e2e;
  --text: #f0f0ff;
  --text-muted: #8888aa;
  --border: rgba(255,255,255,0.08);
  --btn-active: rgba(0,229,255,0.15);
  --btn-active-border: #00e5ff;
  --radius: 14px;
  --radius-sm: 8px;
}

html, body {
  width: 100%; height: 100%;
  overflow: hidden;
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.hidden { display: none !important; }

/* ─── Selection Screen ─── */
#selection-screen {
  position: fixed; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 2rem 1.5rem;
  gap: 1.5rem;
  background: linear-gradient(160deg, #0a0a0f 0%, #0f0f1e 100%);
  overflow-y: auto;
}

.app-header { text-align: center; }
.app-header h1 {
  font-size: 2.2rem; font-weight: 700;
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}
.app-header .subtitle {
  font-size: 0.9rem; color: var(--text-muted); letter-spacing: 3px;
  text-transform: uppercase; margin-top: 2px;
}

.selection-group { width: 100%; max-width: 380px; }
.group-label {
  display: block; font-size: 0.75rem; font-weight: 500;
  color: var(--text-muted); text-transform: uppercase;
  letter-spacing: 0.1em; margin-bottom: 10px;
}

.btn-group { display: flex; gap: 10px; flex-wrap: wrap; }

.sel-btn {
  flex: 1; min-width: 80px;
  padding: 12px 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  font-size: 0.9rem; font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex; flex-direction: column;
  align-items: center; gap: 4px;
}
.sel-btn .btn-icon { font-size: 1.2rem; }
.sel-btn:hover { background: var(--surface2); color: var(--text); }
.sel-btn.selected {
  background: var(--btn-active);
  border-color: var(--btn-active-border);
  color: var(--accent);
  box-shadow: 0 0 20px rgba(0,229,255,0.15);
}

.primary-btn {
  width: 100%; max-width: 380px;
  padding: 16px;
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  border: none; border-radius: var(--radius);
  color: #000; font-size: 1rem; font-weight: 700;
  cursor: pointer; letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 24px rgba(0,229,255,0.3);
}
.primary-btn:disabled {
  opacity: 0.3; cursor: not-allowed;
  box-shadow: none;
  background: var(--surface2);
  color: var(--text-muted);
}
.primary-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0,229,255,0.4);
}

.ar-note { font-size: 0.75rem; color: var(--text-muted); text-align: center; }

/* ─── AR Screen ─── */
#ar-screen {
  position: fixed; inset: 0;
  background: #000;
}

#ar-canvas {
  position: absolute; inset: 0;
  width: 100% !important; height: 100% !important;
}

#ar-overlay {
  position: absolute; inset: 0;
  pointer-events: none;
  display: flex; flex-direction: column;
  justify-content: space-between;
}

/* Top bar */
#ar-topbar {
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem 0.75rem;
  background: linear-gradient(to bottom, rgba(0,0,0,0.6), transparent);
  pointer-events: all;
}
#ar-title {
  font-size: 0.85rem; font-weight: 600;
  color: #fff; letter-spacing: 0.5px;
}

.icon-btn {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  color: #fff; font-size: 0.8rem;
  padding: 6px 14px; cursor: pointer;
  pointer-events: all;
  transition: background 0.2s;
}
.icon-btn:hover { background: rgba(255,255,255,0.2); }

/* Hint text */
#ar-hint {
  text-align: center;
  padding: 0.5rem 1rem;
  pointer-events: none;
}
#hint-text {
  display: inline-block;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 0.8rem; color: rgba(255,255,255,0.8);
}

/* Label popup */
#label-popup {
  position: absolute;
  bottom: 100px; left: 1rem; right: 1rem;
  background: rgba(10,10,20,0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(0,229,255,0.3);
  border-radius: var(--radius);
  padding: 1.2rem 1.2rem 1.2rem 1.4rem;
  pointer-events: all;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,229,255,0.1);
  animation: slideUp 0.25s ease;
}
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
#label-close {
  position: absolute; top: 10px; right: 12px;
  background: none; border: none;
  color: var(--text-muted); font-size: 1rem;
  cursor: pointer; padding: 4px;
}
#label-name {
  font-size: 1rem; font-weight: 600;
  color: var(--accent); margin-bottom: 6px;
}
#label-desc {
  font-size: 0.85rem; color: rgba(255,255,255,0.7);
  line-height: 1.5;
}

/* Bottom bar */
#ar-bottombar {
  padding: 1rem;
  text-align: center;
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
}
#ar-status {
  font-size: 0.78rem; color: rgba(255,255,255,0.5);
}
```

---

## 6. app.js — COMPLETE SPECIFICATION

```javascript
import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { SelectionUI } from './js/SelectionUI.js';
import { ARSession } from './js/ARSession.js';
import { ModelLoader } from './js/ModelLoader.js';
import { ModelInteraction } from './js/ModelInteraction.js';
import { LabelSystem } from './js/LabelSystem.js';
import { Reticle } from './js/Reticle.js';

// ─── App State ───────────────────────────────────────
const state = {
  selectedOrgan: null,    // 'heart' | 'lungs' | 'brain'
  selectedAge: null,      // 'child' | 'adult'
  selectedGender: null,   // 'male' | 'female'
  modelPlaced: false,
  currentModel: null,
  xrSession: null,
  hitTestSource: null,
};

// ─── Three.js Core ───────────────────────────────────
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('ar-canvas'),
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
directionalLight.position.set(1, 3, 2);
scene.add(directionalLight);

// ─── Module Instances ─────────────────────────────────
const selectionUI  = new SelectionUI(state, onStartAR);
const reticle      = new Reticle(scene);
const modelLoader  = new ModelLoader(scene, state);
const interaction  = new ModelInteraction(state, renderer, camera, scene);
const labelSystem  = new LabelSystem(state, camera);
const arSession    = new ARSession(renderer, state, reticle, modelLoader, labelSystem, interaction);

// ─── Entry Point ──────────────────────────────────────
selectionUI.init();

function onStartAR() {
  document.getElementById('selection-screen').classList.add('hidden');
  document.getElementById('ar-screen').classList.remove('hidden');
  arSession.start(state);

  // Update title bar
  document.getElementById('ar-title').textContent =
    `${capitalize(state.selectedOrgan)} — ${capitalize(state.selectedAge)} ${capitalize(state.selectedGender)}`;
}

// ─── Back & Reset Buttons ────────────────────────────
document.getElementById('back-btn').addEventListener('click', () => {
  arSession.stop();
  state.modelPlaced = false;
  state.currentModel = null;
  document.getElementById('ar-screen').classList.add('hidden');
  document.getElementById('selection-screen').classList.remove('hidden');
  labelSystem.hide();
});

document.getElementById('reset-btn').addEventListener('click', () => {
  if (state.currentModel) {
    scene.remove(state.currentModel);
    state.currentModel = null;
    state.modelPlaced = false;
    reticle.show();
    document.getElementById('hint-text').textContent = 'Point at a flat surface and tap to place';
    document.getElementById('ar-status').textContent = 'Searching for surface...';
    labelSystem.hide();
  }
});

// ─── Window Resize ────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ─── Render Loop ──────────────────────────────────────
renderer.setAnimationLoop((timestamp, frame) => {
  if (frame) {
    arSession.onFrame(frame, scene, camera);
  }
  if (state.currentModel) {
    labelSystem.update(); // keep labels facing camera
  }
  renderer.render(scene, camera);
});

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}
```

---

## 7. js/SelectionUI.js — COMPLETE SPECIFICATION

```javascript
export class SelectionUI {
  constructor(state, onStartCallback) {
    this.state = state;
    this.onStart = onStartCallback;
  }

  init() {
    // Wire all selection buttons
    document.querySelectorAll('.sel-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.dataset.group;
        const value = btn.dataset.value;

        // Deselect siblings
        document.querySelectorAll(`.sel-btn[data-group="${group}"]`)
          .forEach(b => b.classList.remove('selected'));

        // Select this one
        btn.classList.add('selected');

        // Update state
        if (group === 'organ')  this.state.selectedOrgan  = value;
        if (group === 'age')    this.state.selectedAge    = value;
        if (group === 'gender') this.state.selectedGender = value;

        this.checkReady();
      });
    });

    // Start AR button
    document.getElementById('start-ar-btn').addEventListener('click', () => {
      if (this.isReady()) this.onStart();
    });
  }

  isReady() {
    return this.state.selectedOrgan &&
           this.state.selectedAge &&
           this.state.selectedGender;
  }

  checkReady() {
    const btn = document.getElementById('start-ar-btn');
    btn.disabled = !this.isReady();
  }
}
```

---

## 8. js/ARSession.js — COMPLETE SPECIFICATION

```javascript
import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';

export class ARSession {
  constructor(renderer, state, reticle, modelLoader, labelSystem, interaction) {
    this.renderer    = renderer;
    this.state       = state;
    this.reticle     = reticle;
    this.modelLoader = modelLoader;
    this.labelSystem = labelSystem;
    this.interaction = interaction;
    this.hitTestSource = null;
    this.hitTestSourceRequested = false;
    this.controller  = null;
  }

  start(state) {
    // Create XR controller (handles tap events in AR)
    this.controller = this.renderer.xr.getController(0);
    this.controller.addEventListener('select', () => this.onSelect());

    // Append the ARButton (this triggers the XR session)
    const arButton = ARButton.createButton(this.renderer, {
      requiredFeatures: ['hit-test'],
      optionalFeatures: ['dom-overlay'],
      domOverlay: { root: document.getElementById('ar-overlay') }
    });
    arButton.style.display = 'none'; // hide default button
    document.body.appendChild(arButton);
    arButton.click(); // auto-start AR

    document.getElementById('ar-status').textContent = 'Searching for surface...';
  }

  stop() {
    if (this.state.xrSession) {
      this.state.xrSession.end();
      this.state.xrSession = null;
    }
    this.hitTestSource = null;
    this.hitTestSourceRequested = false;
  }

  onSelect() {
    // First tap = place model
    if (!this.state.modelPlaced && this.reticle.visible) {
      const position = this.reticle.getPosition();
      this.modelLoader.place(position, () => {
        this.reticle.hide();
        document.getElementById('hint-text').textContent = 'Tap parts to explore';
        document.getElementById('ar-status').textContent = 'Model placed — tap any part';
      });
    }
    // After placement = handle taps on model parts
    else if (this.state.modelPlaced) {
      this.labelSystem.onTap();
    }
  }

  onFrame(frame, scene, camera) {
    const session = this.renderer.xr.getSession();

    // Request hit-test source once
    if (!this.hitTestSourceRequested && session) {
      session.requestReferenceSpace('viewer').then(referenceSpace => {
        session.requestHitTestSource({ space: referenceSpace }).then(source => {
          this.hitTestSource = source;
        });
      });
      this.hitTestSourceRequested = true;
      this.state.xrSession = session;
    }

    // Update reticle position using hit-test results
    if (this.hitTestSource && !this.state.modelPlaced) {
      const referenceSpace = this.renderer.xr.getReferenceSpace();
      const hitTestResults = frame.getHitTestResults(this.hitTestSource);

      if (hitTestResults.length > 0) {
        const hit = hitTestResults[0];
        const pose = hit.getPose(referenceSpace);
        this.reticle.update(pose.transform.matrix);
        document.getElementById('ar-status').textContent = 'Surface found — tap to place';
      } else {
        this.reticle.hide();
        document.getElementById('ar-status').textContent = 'Searching for surface...';
      }
    }
  }
}
```

---

## 9. js/Reticle.js — COMPLETE SPECIFICATION

```javascript
import * as THREE from 'three';

export class Reticle {
  constructor(scene) {
    // Glowing ring reticle
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

  show() { this.mesh.visible = true; }
  hide() { this.mesh.visible = false; }
  get visible() { return this.mesh.visible; }

  getPosition() {
    const pos = new THREE.Vector3();
    pos.setFromMatrixPosition(this.mesh.matrix);
    return pos;
  }
}
```

---

## 10. js/ModelLoader.js — COMPLETE SPECIFICATION

```javascript
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scale map: adult = 1.0, child = 0.7
const SCALE_MAP = { adult: 1.0, child: 0.7 };

// Real-world size reference in meters
const BASE_SIZE = { heart: 0.12, lungs: 0.28, brain: 0.15 };

export class ModelLoader {
  constructor(scene, state) {
    this.scene  = scene;
    this.state  = state;
    this.loader = new GLTFLoader();
  }

  getModelPath() {
    const { selectedOrgan, selectedAge, selectedGender } = this.state;
    return `models/${selectedOrgan}/${selectedOrgan}_${selectedAge}_${selectedGender}.glb`;
  }

  place(position, onPlaced) {
    const path = this.getModelPath();

    // Show loading indicator
    document.getElementById('ar-status').textContent = 'Loading model...';

    this.loader.load(
      path,
      (gltf) => {
        const model = gltf.scene;

        // Position at tap location
        model.position.copy(position);

        // Scale based on age
        const ageScale = SCALE_MAP[this.state.selectedAge];
        const baseSize = BASE_SIZE[this.state.selectedOrgan];
        model.scale.setScalar(baseSize * ageScale);

        // Tag all meshes with their name for tap detection
        model.traverse((child) => {
          if (child.isMesh) {
            child.userData.isAnatomyPart = true;
            child.userData.partName = child.name; // mesh name from GLTF
          }
        });

        this.scene.add(model);
        this.state.currentModel = model;
        this.state.modelPlaced  = true;

        onPlaced && onPlaced();
      },
      (progress) => {
        const pct = Math.round((progress.loaded / progress.total) * 100);
        document.getElementById('ar-status').textContent = `Loading... ${pct}%`;
      },
      (error) => {
        console.error('Model load error:', error);
        document.getElementById('ar-status').textContent = 'Model load failed. Try again.';
      }
    );
  }
}
```

---

## 11. js/ModelInteraction.js — COMPLETE SPECIFICATION

```javascript
export class ModelInteraction {
  constructor(state, renderer, camera, scene) {
    this.state    = state;
    this.renderer = renderer;
    this.camera   = camera;
    this.scene    = scene;

    this.isDragging    = false;
    this.lastX         = 0;
    this.lastPinchDist = 0;
    this.minScale      = 0.02;
    this.maxScale      = 0.8;

    this.attachListeners();
  }

  attachListeners() {
    const canvas = this.renderer.domElement;
    canvas.addEventListener('touchstart',  (e) => this.onTouchStart(e),  { passive: false });
    canvas.addEventListener('touchmove',   (e) => this.onTouchMove(e),   { passive: false });
    canvas.addEventListener('touchend',    (e) => this.onTouchEnd(e));
  }

  onTouchStart(e) {
    if (!this.state.modelPlaced) return;
    if (e.touches.length === 1) {
      this.isDragging = true;
      this.lastX = e.touches[0].clientX;
    }
    if (e.touches.length === 2) {
      this.isDragging = false;
      this.lastPinchDist = this.getPinchDist(e.touches);
    }
  }

  onTouchMove(e) {
    e.preventDefault();
    if (!this.state.currentModel) return;

    if (e.touches.length === 1 && this.isDragging) {
      const dx = e.touches[0].clientX - this.lastX;
      this.state.currentModel.rotation.y += dx * 0.01;
      this.lastX = e.touches[0].clientX;
    }

    if (e.touches.length === 2) {
      const dist  = this.getPinchDist(e.touches);
      const delta = dist - this.lastPinchDist;
      const model = this.state.currentModel;
      const newScale = Math.max(this.minScale,
                       Math.min(this.maxScale, model.scale.x + delta * 0.001));
      model.scale.setScalar(newScale);
      this.lastPinchDist = dist;
    }
  }

  onTouchEnd(e) {
    this.isDragging = false;
  }

  getPinchDist(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
```

---

## 12. js/LabelSystem.js — COMPLETE SPECIFICATION

```javascript
import * as THREE from 'three';
import { ANATOMY_DATA } from './AnatomyData.js';

export class LabelSystem {
  constructor(state, camera) {
    this.state  = state;
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();
    this.tapPoint  = new THREE.Vector2();
    this.visible   = false;

    // Listen for tap position from pointer events
    document.getElementById('ar-canvas').addEventListener('touchend', (e) => {
      if (this.state.modelPlaced && e.changedTouches.length > 0) {
        const t = e.changedTouches[0];
        this.tapPoint.set(
          (t.clientX / window.innerWidth)  *  2 - 1,
          (t.clientY / window.innerHeight) * -2 + 1
        );
      }
    });

    document.getElementById('label-close').addEventListener('click', () => this.hide());
  }

  onTap() {
    if (!this.state.currentModel) return;

    this.raycaster.setFromCamera(this.tapPoint, this.camera);
    const meshes = [];
    this.state.currentModel.traverse(child => {
      if (child.isMesh && child.userData.isAnatomyPart) meshes.push(child);
    });

    const hits = this.raycaster.intersectObjects(meshes, false);

    if (hits.length > 0) {
      const hit  = hits[0];
      const name = hit.object.userData.partName;
      const organ = this.state.selectedOrgan;
      const data = ANATOMY_DATA[organ]?.[name];

      if (data) {
        this.show(data.name, data.description);
      } else {
        // Fallback: show mesh name formatted nicely
        this.show(this.formatName(name), 'Part of the ' + organ + ' anatomy.');
      }
    }
  }

  show(name, desc) {
    document.getElementById('label-name').textContent = name;
    document.getElementById('label-desc').textContent = desc;
    document.getElementById('label-popup').classList.remove('hidden');
    this.visible = true;
  }

  hide() {
    document.getElementById('label-popup').classList.add('hidden');
    this.visible = false;
  }

  update() {
    // Billboard effect is handled via CSS overlay — no 3D label needed
  }

  formatName(rawName) {
    // Convert 'left_ventricle' → 'Left Ventricle'
    return rawName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}
```

---

## 13. js/AnatomyData.js — COMPLETE DATA FILE

```javascript
export const ANATOMY_DATA = {

  heart: {
    left_ventricle: {
      name: 'Left Ventricle',
      description: 'The main pumping chamber. Sends oxygenated blood out to the entire body through the aorta.'
    },
    right_ventricle: {
      name: 'Right Ventricle',
      description: 'Pumps deoxygenated blood from the heart to the lungs to pick up oxygen.'
    },
    left_atrium: {
      name: 'Left Atrium',
      description: 'Receives oxygen-rich blood returning from the lungs via the pulmonary veins.'
    },
    right_atrium: {
      name: 'Right Atrium',
      description: 'Receives oxygen-depleted blood from the body through the superior and inferior vena cava.'
    },
    aorta: {
      name: 'Aorta',
      description: 'The largest artery in the body. Carries oxygenated blood from the left ventricle to the rest of the body.'
    },
    pulmonary_artery: {
      name: 'Pulmonary Artery',
      description: 'Carries deoxygenated blood from the right ventricle to the lungs. Unique — an artery carrying deoxygenated blood.'
    },
    mitral_valve: {
      name: 'Mitral Valve',
      description: 'Controls blood flow between the left atrium and left ventricle. Has two leaflets.'
    },
    tricuspid_valve: {
      name: 'Tricuspid Valve',
      description: 'Controls blood flow between the right atrium and right ventricle. Has three leaflets.'
    },
    coronary_artery: {
      name: 'Coronary Artery',
      description: 'Supplies blood to the heart muscle itself. Blockage here causes a heart attack.'
    }
  },

  lungs: {
    left_lung: {
      name: 'Left Lung',
      description: 'Has two lobes (upper and lower). Slightly smaller than the right lung to accommodate the heart.'
    },
    right_lung: {
      name: 'Right Lung',
      description: 'Has three lobes (upper, middle, lower). Larger than the left lung.'
    },
    trachea: {
      name: 'Trachea',
      description: 'The windpipe. A tube about 12cm long that connects the throat to the bronchi, carrying air in and out.'
    },
    bronchi: {
      name: 'Bronchi',
      description: 'Two main branches from the trachea, one entering each lung. They divide further into bronchioles.'
    },
    diaphragm: {
      name: 'Diaphragm',
      description: 'The dome-shaped muscle below the lungs. When it contracts, it pulls air into the lungs.'
    },
    pleura: {
      name: 'Pleura',
      description: 'Two-layered membrane surrounding each lung. Reduces friction during breathing.'
    },
    alveoli: {
      name: 'Alveoli',
      description: 'Tiny air sacs at the end of bronchioles where oxygen enters the blood and CO₂ is removed.'
    }
  },

  brain: {
    cerebrum: {
      name: 'Cerebrum',
      description: 'The largest brain region. Controls thought, memory, language, and voluntary movement.'
    },
    cerebellum: {
      name: 'Cerebellum',
      description: 'The "little brain" at the back. Controls balance, coordination, and fine motor skills.'
    },
    brain_stem: {
      name: 'Brain Stem',
      description: 'Controls vital automatic functions — breathing, heart rate, blood pressure, and sleep cycles.'
    },
    frontal_lobe: {
      name: 'Frontal Lobe',
      description: 'Controls personality, decision-making, planning, and voluntary movement.'
    },
    temporal_lobe: {
      name: 'Temporal Lobe',
      description: 'Processes sound and language. Also plays a key role in memory formation.'
    },
    parietal_lobe: {
      name: 'Parietal Lobe',
      description: 'Processes sensory information — touch, temperature, pain, and spatial awareness.'
    },
    occipital_lobe: {
      name: 'Occipital Lobe',
      description: 'The visual processing center. Interprets everything we see.'
    },
    corpus_callosum: {
      name: 'Corpus Callosum',
      description: 'Bundle of nerve fibers connecting the left and right hemispheres of the brain.'
    },
    hippocampus: {
      name: 'Hippocampus',
      description: 'Critical for forming new memories and spatial navigation. First affected in Alzheimer\'s.'
    }
  }
};
```

---

## 14. manifest.json — PWA MANIFEST

```json
{
  "name": "AR Anatomy Visualizer",
  "short_name": "AR Anatomy",
  "start_url": "./index.html",
  "display": "fullscreen",
  "background_color": "#0a0a0f",
  "theme_color": "#00e5ff",
  "orientation": "portrait",
  "icons": [
    { "src": "assets/icon-192.png", "sizes": "192x192", "type": "image/png" }
  ]
}
```

---

## 15. HOW TO GET FREE 3D MODELS

### Option A — Sketchfab (Recommended)
1. Go to sketchfab.com
2. Search: `"human heart anatomy"` → filter: Free + Downloadable
3. Download as **GLB** format
4. Rename to match file naming convention:
   - `heart_adult_male.glb`
   - Copy same file for all 4 variants initially
5. Repeat for lungs and brain

### Option B — Use Placeholder Geometry (For Testing)
If no models are available, use this in ModelLoader.js to create a placeholder:

```javascript
// Placeholder heart = red sphere
const geometry = new THREE.SphereGeometry(0.05, 16, 16);
const material = new THREE.MeshStandardMaterial({ color: 0xcc2222 });
const mesh = new THREE.Mesh(geometry, material);
mesh.userData.isAnatomyPart = true;
mesh.userData.partName = 'left_ventricle';
mesh.name = 'left_ventricle';
const model = new THREE.Group();
model.add(mesh);
```

### Naming Convention for GLTF Mesh Parts
When importing models, ensure each part mesh is named exactly matching keys in AnatomyData.js:
- Use underscores: `left_ventricle`, `right_atrium`, etc.
- Or update AnatomyData.js keys to match whatever names the model uses

---

## 16. HOW TO RUN LOCALLY

```bash
# Option 1 — Python (simplest)
cd ar-anatomy
python3 -m http.server 8080

# Option 2 — Node.js
npx serve .

# Option 3 — VS Code Live Server
# Install "Live Server" extension → right click index.html → Open with Live Server

# Then on your phone:
# 1. Connect phone to same WiFi as laptop
# 2. Find your laptop's local IP: ifconfig | grep inet (Mac) or ipconfig (Windows)
# 3. Open Chrome on phone → http://192.168.x.x:8080
# 4. Allow camera permission → AR starts
```

---

## 17. BUILD ORDER FOR CODEX

Tell Codex to build in this exact order:

```
Step 1: Create index.html with the full structure above
Step 2: Create style.css with all styles
Step 3: Create js/AnatomyData.js with all organ data
Step 4: Create js/SelectionUI.js
Step 5: Create js/Reticle.js
Step 6: Create js/ModelLoader.js (use placeholder geometry first)
Step 7: Create js/ModelInteraction.js
Step 8: Create js/LabelSystem.js
Step 9: Create js/ARSession.js
Step 10: Create app.js tying everything together
Step 11: Create manifest.json
Step 12: Test in browser, fix any import errors
Step 13: Replace placeholder geometry with real GLB models
```

---

## 18. KNOWN ISSUES & SOLUTIONS

| Issue | Solution |
|---|---|
| WebXR not available in browser | Must use HTTPS or localhost. Use `python3 -m http.server` |
| Hit-test doesn't work | Add `requiredFeatures: ['hit-test']` to ARButton.createButton |
| Model doesn't appear | Check GLB path, use placeholder geometry first to verify scene works |
| Touch events conflict (rotate vs tap) | Distinguish by touch duration: <200ms = tap, >200ms = drag |
| iOS limited WebXR | iOS 15+ supports basic WebXR in Safari. For full hit-test on iOS, consider 8th Wall |
| CORS error loading models | Must serve from HTTP server, NOT file:// protocol |
| Label shows wrong part | Ensure mesh names in GLTF match keys in AnatomyData.js exactly |

---

## 19. IMPRESSIVE EXTRAS (Add after core works)

- **Loading screen** with animated pulse while model loads
- **Particle effect** when model first appears (burst of particles)
- **Organ-specific accent color**: Heart=red, Lungs=blue, Brain=purple
- **Haptic feedback** on tap: `navigator.vibrate(50)`
- **Screenshot button**: `canvas.toDataURL()` → download
- **Animated heart beat**: pulse `scale` on a sine curve in render loop
- **Audio descriptions**: `SpeechSynthesisUtterance` reads part descriptions aloud

---

## 20. SHARING THE DEMO

Once working:
1. Upload to **GitHub Pages** (free): push to repo → Settings → Pages → Deploy
2. Or use **Netlify Drop**: drag folder to netlify.com/drop → instant URL
3. Share link with teacher — they open it on any Android phone in Chrome

No app store. No installation. Just a link. 🚀

---

*Blueprint v2.0 — Three.js + WebXR | Vanilla JS | No build tools required*
*Compatible with: Codex, Cursor, Claude, GPT-4, Gemini*
*Last updated: April 2026*
