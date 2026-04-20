export class SelectionUI {
  constructor(state, onStartCallback) {
    this.state = state;
    this.onStart = onStartCallback;
  }

  init() {
    document.querySelectorAll(".sel-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const group = btn.dataset.group;
        const value = btn.dataset.value;

        document
          .querySelectorAll(`.sel-btn[data-group="${group}"]`)
          .forEach((sibling) => sibling.classList.remove("selected"));

        btn.classList.add("selected");

        if (group === "organ") this.state.selectedOrgan = value;
        if (group === "age") this.state.selectedAge = value;
        if (group === "gender") this.state.selectedGender = value;

        this.checkReady();
      });
    });

    document.getElementById("start-ar-btn").addEventListener("click", () => {
      if (this.isReady()) this.onStart();
    });
  }

  isReady() {
    return Boolean(
      this.state.selectedOrgan &&
      this.state.selectedAge &&
      this.state.selectedGender
    );
  }

  checkReady() {
    document.getElementById("start-ar-btn").disabled = !this.isReady();
  }
}
