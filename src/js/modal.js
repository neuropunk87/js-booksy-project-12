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


