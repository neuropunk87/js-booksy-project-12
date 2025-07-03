//BV book modal

import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";

const bookModal = document.querySelector(".book-modal-overlay")
const bookModalClose = document.querySelector(".book-modal-close");


bookModalClose.addEventListener("click", () => {
    bookModal.classList.remove("open");
});



new Accordion(".accordion-container");
