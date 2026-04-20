export class ModelInteraction {
  constructor(state, renderer) {
    this.state = state;
    this.renderer = renderer;
    this.isDragging = false;
    this.isMouseDragging = false;
    this.lastX = 0;
    this.lastMouseX = 0;
    this.lastPinchDist = 0;
    this.touchStartTime = 0;
    this.minScale = 0.02;
    this.maxScale = 0.8;

    this.attachListeners();
  }

  attachListeners() {
    const canvas = this.renderer.domElement;
    canvas.addEventListener("touchstart", (event) => this.onTouchStart(event), { passive: false });
    canvas.addEventListener("touchmove", (event) => this.onTouchMove(event), { passive: false });
    canvas.addEventListener("touchend", (event) => this.onTouchEnd(event));
    canvas.addEventListener("mousedown", (event) => this.onMouseDown(event));
    window.addEventListener("mousemove", (event) => this.onMouseMove(event));
    window.addEventListener("mouseup", () => this.onMouseUp());
    canvas.addEventListener("wheel", (event) => this.onWheel(event), { passive: false });
  }

  onTouchStart(event) {
    if (!this.state.modelPlaced) return;

    this.touchStartTime = performance.now();

    if (event.touches.length === 1) {
      this.isDragging = true;
      this.lastX = event.touches[0].clientX;
    }

    if (event.touches.length === 2) {
      this.isDragging = false;
      this.lastPinchDist = this.getPinchDist(event.touches);
    }
  }

  onTouchMove(event) {
    if (!this.state.currentModel) return;

    event.preventDefault();

    if (event.touches.length === 1 && this.isDragging) {
      const dx = event.touches[0].clientX - this.lastX;
      this.state.currentModel.rotation.y += dx * 0.01;
      this.lastX = event.touches[0].clientX;
    }

    if (event.touches.length === 2) {
      const dist = this.getPinchDist(event.touches);
      const delta = dist - this.lastPinchDist;
      const model = this.state.currentModel;
      const nextScale = Math.max(
        this.minScale,
        Math.min(this.maxScale, model.scale.x + delta * 0.001)
      );

      model.scale.setScalar(nextScale);
      this.lastPinchDist = dist;
    }
  }

  onTouchEnd() {
    this.isDragging = false;
  }

  onMouseDown(event) {
    if (!this.state.modelPlaced) return;
    this.isMouseDragging = true;
    this.lastMouseX = event.clientX;
  }

  onMouseMove(event) {
    if (!this.isMouseDragging || !this.state.currentModel) return;

    const dx = event.clientX - this.lastMouseX;
    this.state.currentModel.rotation.y += dx * 0.01;
    this.lastMouseX = event.clientX;
  }

  onMouseUp() {
    this.isMouseDragging = false;
  }

  onWheel(event) {
    if (!this.state.currentModel) return;

    event.preventDefault();
    const model = this.state.currentModel;
    const nextScale = Math.max(
      this.minScale,
      Math.min(this.maxScale, model.scale.x - event.deltaY * 0.0006)
    );
    model.scale.setScalar(nextScale);
  }

  wasTap() {
    return performance.now() - this.touchStartTime < 200;
  }

  getPinchDist(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt((dx * dx) + (dy * dy));
  }
}
