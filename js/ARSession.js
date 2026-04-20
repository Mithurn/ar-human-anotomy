import { ARButton } from "three/addons/webxr/ARButton.js";

export class ARSession {
  constructor(renderer, state, reticle, modelLoader, labelSystem) {
    this.renderer = renderer;
    this.state = state;
    this.reticle = reticle;
    this.modelLoader = modelLoader;
    this.labelSystem = labelSystem;
    this.hitTestSource = null;
    this.hitTestSourceRequested = false;
    this.controller = null;
    this.arButton = null;
    this.quickLookAnchor = null;
  }

  async startObjectMode() {
    document.getElementById("hint-text").textContent = "Rotate, zoom, and tap blue points to explore";
    document.getElementById("ar-status").textContent = "";
    this.placePreviewModel();
  }

  async enterAR() {
    const arSupported = navigator.xr && await navigator.xr.isSessionSupported?.("immersive-ar");
    const quickLookSupported = this.isQuickLookCapable();

    if (quickLookSupported) {
      this.openQuickLook();
      return;
    }

    if (!arSupported) {
      document.getElementById("hint-text").textContent = "AR is not available on this device/browser";
      return;
    }

    if (this.state.currentModel) {
      this.state.currentModel.visible = false;
    }
    this.labelSystem.hide();

    this.controller = this.renderer.xr.getController(0);
    this.controller.addEventListener("select", () => this.onSelect());

    if (!this.arButton) {
      this.arButton = ARButton.createButton(this.renderer, {
        requiredFeatures: ["hit-test"],
        optionalFeatures: ["dom-overlay"],
        domOverlay: { root: document.getElementById("ar-overlay") }
      });
      this.arButton.style.display = "none";
      document.body.appendChild(this.arButton);
    }

    document.getElementById("ar-status").textContent = "Searching for surface...";
    this.arButton.click();
  }

  stop() {
    if (this.state.xrSession) {
      this.state.xrSession.end();
      this.state.xrSession = null;
    }

    this.hitTestSource = null;
    this.hitTestSourceRequested = false;
    this.reticle.hide();
    if (this.state.currentModel) {
      this.state.currentModel.visible = true;
    }
  }

  onSelect() {
    if (!this.state.modelPlaced && this.reticle.visible) {
      const position = this.reticle.getPosition();
      this.modelLoader.place(position, () => {
        this.reticle.hide();
        document.getElementById("hint-text").textContent = "Tap parts to explore";
        document.getElementById("ar-status").textContent = "Model placed - tap any part";
      });
      return;
    }

    if (this.state.modelPlaced) {
      this.labelSystem.onTap();
    }
  }

  onFrame(frame) {
    const session = this.renderer.xr.getSession();

    if (!this.hitTestSourceRequested && session) {
      session.requestReferenceSpace("viewer").then((referenceSpace) => {
        session.requestHitTestSource({ space: referenceSpace }).then((source) => {
          this.hitTestSource = source;
        });
      });
      this.hitTestSourceRequested = true;
      this.state.xrSession = session;
    }

    if (this.hitTestSource && !this.state.modelPlaced) {
      const referenceSpace = this.renderer.xr.getReferenceSpace();
      const hitTestResults = frame.getHitTestResults(this.hitTestSource);

      if (hitTestResults.length > 0) {
        const hit = hitTestResults[0];
        const pose = hit.getPose(referenceSpace);
        this.reticle.update(pose.transform.matrix);
        document.getElementById("ar-status").textContent = "Surface found - tap to place";
      } else {
        this.reticle.hide();
        document.getElementById("ar-status").textContent = "Searching for surface...";
      }
    }
  }

  placePreviewModel() {
    if (this.state.modelPlaced) return;

    this.modelLoader.place({ x: 0, y: 0, z: -1.2, copy(vector) { this.x = vector.x; this.y = vector.y; this.z = vector.z; } }, () => {
      if (this.state.currentModel) {
        this.state.currentModel.position.set(0, -0.12, -1.45);
      }
      document.getElementById("hint-text").textContent = "Rotate, zoom, and tap blue points to explore";
      document.getElementById("ar-status").textContent = "";
      this.labelSystem.startGuidedLearning();
    });
  }

  isQuickLookCapable() {
    const ua = navigator.userAgent || "";
    const isIOSDevice = /iPhone|iPad|iPod/i.test(ua);
    const isSafariLike = /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);
    return isIOSDevice && isSafariLike;
  }

  async openQuickLook() {
    const quickLookUrl = await this.findQuickLookUrl();
    if (!quickLookUrl) {
      document.getElementById("hint-text").textContent = "USDZ file missing for this selection";
      return;
    }

    if (!this.quickLookAnchor) {
      this.quickLookAnchor = document.createElement("a");
      this.quickLookAnchor.rel = "ar";
      this.quickLookAnchor.className = "hidden";
      const img = document.createElement("img");
      img.alt = "";
      this.quickLookAnchor.appendChild(img);
      document.body.appendChild(this.quickLookAnchor);
    }

    this.quickLookAnchor.href = `${quickLookUrl}#allowsContentScaling=0`;
    this.quickLookAnchor.click();
  }

  async findQuickLookUrl() {
    for (const path of this.modelLoader.getQuickLookCandidates()) {
      try {
        const response = await fetch(path, { method: "HEAD" });
        if (response.ok) return path;
      } catch (error) {
        continue;
      }
    }

    return null;
  }
}
