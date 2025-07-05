//#region BV book modal

import Accordion from 'accordion-js';
import 'accordion-js/dist/accordion.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Modal elems
const bookModalOverlay = document.getElementById('bookModalOverlay');
const bookModalClose = document.getElementById('modalCloseBtn');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalAuthor = document.getElementById('modalAuthor');
const modalPrice = document.getElementById('modalPrice');
const modalCounter = document.getElementById('modalCounter');
const modalMinusBtn = document.getElementById('modalMinusBtn');
const modalPlusBtn = document.getElementById('modalPlusBtn');
const modalAddBtn = document.getElementById('modalAddBtn');
const modalBuyBtn = document.getElementById('modalBuyBtn');
const modalAccordion = document.getElementById('modalAccordion');

let modalCount = 0;

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Global func to open modal from books.js
window.openBookModal = function (book) {
  if (!bookModalOverlay) return;

  // Filling with data
  modalImg.src = book.book_image;
  modalImg.alt = book.title;
  modalTitle.textContent = capitalizeFirst(book.title);
  modalAuthor.textContent = book.author;
  modalPrice.textContent = `$${book.price || '—'}`;
  modalCounter.textContent = '0';
  modalCount = 0;
  buildAccordion(book);

  // Open the modal
  bookModalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  bookModalClose && bookModalClose.focus();
};

// Closing the modal (cross, click on the bg, esc)
function closeModal() {
  bookModalOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}
if (bookModalClose) {
  bookModalClose.addEventListener('click', closeModal);
}
if (bookModalOverlay) {
  bookModalOverlay.addEventListener('click', e => {
    if (e.target === bookModalOverlay) closeModal();
  });
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && bookModalOverlay?.classList.contains('open')) {
    closeModal();
  }
});

// Counter
if (modalMinusBtn && modalCounter) {
  modalMinusBtn.addEventListener('click', () => {
    if (modalCount > 0) modalCount--;
    modalCounter.textContent = modalCount;
  });
}
if (modalPlusBtn && modalCounter) {
  modalPlusBtn.addEventListener('click', () => {
    modalCount++;
    modalCounter.textContent = modalCount;
  });
}

// Add to cart
if (modalAddBtn) {
  modalAddBtn.addEventListener('click', () => {
    if(modalCount === 0 || modalCounter.textContent === 0) {
        iziToast.error({
            message: 'Спочатку візьміть товар',
            position: 'bottomCenter',
            backgroundColor: '#ad0000',
            messageColor: "white",
            closeOnClick: true,
        });
        return;
    }
    iziToast.success({
      message: `Добавлено в корзину: ${modalCount}`,
      position: 'bottomCenter',
      backgroundColor: 'var(--color-primary)',
      messageColor: 'white',
      closeOnClick: true,
    });
  });
}


// Buy now
if (modalBuyBtn) {
  modalBuyBtn.addEventListener('click', () => {
    iziToast.success({
      message: 'Дякуємо за покупку',
      position: 'bottomCenter',
      backgroundColor: 'var(--color-primary)',
      messageColor: 'white',
      closeOnClick: true,
    });
  });
}

// Accordion (details/shipping/returns)
function buildAccordion(book) {
  if (!modalAccordion) return;
  modalAccordion.innerHTML = '';
  const data = [
    { title: 'Details', content: book.description || 'No info' },
    {
      title: 'Shipping',
      content:
        'We ship across the United States within 2–5 business days. All orders are processed through USPS or a reliable courier service. Enjoy free standard shipping on orders over $50.',
    },
    {
      title: 'Returns',
      content:
        'You can return an item within 14 days of receiving your order, provided it hasn’t been used and is in its original condition. To start a return, please contact our support team — we’ll guide you through the process quickly and hassle-free.',
    },
  ];
  data.forEach((item, idx) => {
    const section = document.createElement('div');
    section.className = 'ac' + (idx === 0 ? ' is-active' : '');
    section.innerHTML = `
        <h2 class="ac-header">
          <button type="button" class="ac-trigger">${item.title}
            <div class="icon-box">
              <svg class="trigger-icon" width="12" height="12"><use href="sprite.svg#smooth-arrow-down"></use></svg>
            </div>
          </button>
        </h2>
        <div class="ac-panel">
          <p class="ac-text">${item.content}</p>
        </div>
      `;
    modalAccordion.appendChild(section);
  });
  new Accordion('.accordion-container', {
    duration: 200,
    showMultiple: true,
    openOnInit: [0],
  });
}

// const bookModal = document.querySelector('.book-modal-overlay');
// const bookModalClose = document.querySelector('.book-modal-close');
// const counterAdd = document.querySelector('#btn-add');
// const counterReduce = document.querySelector('#btn-reduce');
// const counter = document.querySelector('.counter');
// const addToCart = document.querySelector('.add-btn');
// const buyNow = document.querySelector('.book-modal-buy-btn');

// counterAdd.addEventListener('click', () => {
//   counter.textContent++;
// });

// counterReduce.addEventListener('click', () => {
//   if (counter.textContent === '0') {
//     return;
//   }
//   counter.textContent--;
// });

// bookModalClose.addEventListener('click', () => {
//   bookModal.classList.remove('open');
// });

// document.addEventListener('keydown', event => {
//   if (event.key !== 'Escape') {
//     return;
//   }
//   bookModal.classList.remove('open');
// });

// bookModal.addEventListener('click', event => {
//   if (event.currentTarget !== event.target) {
//     return;
//   }
//   bookModal.classList.remove('open');
// });

// addToCart.addEventListener('click', () => {
//   console.log(counter.textContent);
// });

// buyNow.addEventListener('click', () => {
//   if (counter.textContent === '0') {
//     iziToast.error({
//       message: 'Спочатку візьміть продукт',
//       closeOnClick: true,
//       position: 'bottomCenter',
//       backgroundColor: '#ad0000',
//       messageColor: 'white',
//     });
//     return;
//   }
//   iziToast.success({
//     message: 'Дякуємо за покупку!',
//     closeOnClick: true,
//     position: 'bottomCenter',
//     timeout: 100000,
//     backgroundColor: 'var(--color-primary)',
//     messageColor: 'white',
//   });
// });

// new Accordion('.accordion-container');
