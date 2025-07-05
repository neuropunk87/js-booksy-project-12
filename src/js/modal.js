//BV book modal

import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const bookModal = document.querySelector(".book-modal-overlay")
const bookModalClose = document.querySelector(".book-modal-close");
const counterAdd = document.querySelector("#btn-add");
const counterReduce = document.querySelector('#btn-reduce');
const counter = document.querySelector('.counter');
const addToCart =  document.querySelector('.add-btn');
const buyNow = document.querySelector('.book-modal-buy-btn');

counterAdd.addEventListener("click", () => {
    counter.textContent++;
});

counterReduce.addEventListener('click', () => {
    if(counter.textContent === "0") {
        return;
    }
    counter.textContent--;
});

bookModalClose.addEventListener("click", () => {
    bookModal.classList.remove("open");
});

document.addEventListener("keydown", (event)  => {
    if(event.key !== "Escape") {
        return;
    }
    bookModal.classList.remove("open");
});

bookModal.addEventListener('click', (event) => {
    if(event.currentTarget !== event.target) {
        return;
    }
    bookModal.classList.remove("open");
});

addToCart.addEventListener('click', () => {
    console.log(counter.textContent);
});

buyNow.addEventListener('click', () => {
    if(counter.textContent === "0") {
        iziToast.error({
            message: "Спочатку візьміть продукт",
            closeOnClick: true,
            position: "bottomCenter",
            backgroundColor: "#ad0000",
            messageColor: "white",
        });
        return;
    }
    iziToast.success({
        message: 'Дякуємо за покупку!',
        closeOnClick: true,
        position: "bottomCenter",
        timeout: 100000,
        backgroundColor: "var(--color-primary)",
        messageColor: "white",
    });
})

new Accordion(".accordion-container"); 

// contact-modal

const contactModal = document.querySelector(".contact-modal-overlay")
const contactModalClose = document.querySelector(".contact-modal-close");
const contactForm = document.querySelector(".contact-modal-form");

contactModalClose.addEventListener("click", () => {
    contactModal.classList.remove("open");
    closeContactModal();
});

document.addEventListener("keydown", (event)  => {
    if(event.key !== "Escape") {
        return;
    }
    contactModal.classList.remove("open");
    closeContactModal();
});

contactModal.addEventListener('click', (event) => {
    if(event.currentTarget !== event.target) {
        return;
    }
    contactModal.classList.remove("open");
    closeContactModal();
});

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const contactInputs = contactForm.querySelectorAll(".contact-form-input");
    let isValid = true;

    contactInputs.forEach(input => {
        if (!input.checkValidity()) {
            isValid = false;
            input.classList.add("invalid");
            iziToast.error({
                title: 'Invalid Input',
                message: `${input.name} is not valid.`,
                position: 'topRight',
            });
        } else {
            input.classList.remove("invalid");
        }
    });

    if (isValid) {
        iziToast.success({
            title: 'Valid Input',
            message: `Registered successfully.`,
            position: 'topRight',
        });
        contactForm.reset();
    }
});

function closeContactModal() {
  document.querySelector('.contact-modal-overlay').style.display = 'none';
  document.body.style.overflow = ''; 
}

function openContactModal() {
  document.querySelector('.contact-modal-overlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}