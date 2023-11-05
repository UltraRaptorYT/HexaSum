const openModalButton = document.getElementById("openModal");
const closeModalButton = document.getElementById("closeModal");
const modal = document.getElementById("modal");

openModalButton.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

closeModalButton.addEventListener("click", () => {
  modal.classList.add("hidden");
});

const openSettingModalButton = document.getElementById("openSettingModal");
const closeSettingModalButton = document.getElementById("closeSettingModal");
const settingModal = document.getElementById("settingModal");

openSettingModalButton.addEventListener("click", () => {
  settingModal.classList.remove("hidden");
});

closeSettingModalButton.addEventListener("click", () => {
  settingModal.classList.add("hidden");
});
