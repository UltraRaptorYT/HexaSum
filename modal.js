const openModalButton = document.getElementById("openModal");
const closeModalButton = document.getElementById("closeModal");
const modal = document.getElementById("modal");

openModalButton.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

closeModalButton.addEventListener("click", () => {
  modal.classList.add("hidden");
});
