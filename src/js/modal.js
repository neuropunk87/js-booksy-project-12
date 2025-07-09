//#region BV book modal

import Accordion from 'accordion-js';
import 'accordion-js/dist/accordion.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Ініціалізація елементів модалки
const bookModal = document.querySelector('.book-modal-overlay');
const bookModalClose = document.querySelector('.book-modal-close');
// Можлива ініціалізація інформації про вміст товару в корзині
const productAmount = document.querySelector('.prod-count');
const counterAdd = document.querySelector('#btn-add');
const counterReduce = document.querySelector('#btn-reduce');
const counter = document.querySelector('.counter');
const addToCart = document.querySelector('.add-btn');
const buyNow = document.querySelector('.book-modal-buy-btn');
const bookImg = document.querySelector('.book-modal-img');
const bookInfo = document.querySelector('#book-modal-info');
const bookName = document.querySelector('.book-modal-name');
const bookAuthor = document.querySelector('.book-modal-author');
const bookPrice = document.querySelector('.book-modal-price');

let modalCount = 0;

// Нормування назви товару з бази даних (Перша літера лише велика)
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Відкриття модалки (з використанням books.js)
window.openBookModal = function (book) {
  if (!bookModal) return;
  
  // Оновлення даних модалки
  bookImg.src = book.book_image;
  bookImg.alt = book.title;
  bookName.textContent = capitalizeFirst(book.title);
  bookAuthor.textContent = book.author;
  bookPrice.textContent = `$${book.price || '—'}`;
  bookInfo.textContent = book.description || 'No info';
  counter.textContent = '0';
  modalCount = 0;
  // Відкриття самої модалки
  bookModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  bookModalClose && bookModalClose.focus();
  const itemCount = localStorage.getItem(bookName.textContent) || 0;
  // Перевірка на наявність продукту у корзині
  if (!itemCount) {
    productAmount.innerHTML = ''; 
  } else
  {productAmount.innerHTML = `Загальна кількість товару в корзині: ${localStorage.getItem(bookName.textContent)}`}
};

// Додавання та віднімання кількості товару
counterAdd.addEventListener('click', () => {
  modalCount++;
  counter.textContent = modalCount;
});

counterReduce.addEventListener('click', () => {
  if (modalCount === 0) {
    return;
  }
  modalCount--
  counter.textContent = modalCount;
});

// Функціонал закриття модалки (кліком по іконці, за межами модалки та натисканням Esc)
const modalClose = () => {
  bookModal.classList.remove('open');
  document.body.style.overflow = ''
}
bookModalClose.addEventListener('click', () => {
  modalClose();
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') {
    return;
  }
  modalClose();
});

bookModal.addEventListener('click', event => {
  if (event.currentTarget !== event.target) {
    return;
  }
  modalClose();
});

// Функціонал додавання товару до корзини (незалежно від кількості товару на лічильнику (якщо не 0))
addToCart.addEventListener('click', () => {
  if(counter.textContent === '0' || modalCount === 0) {
    iziToast.error({
      message: 'Спочатку візьміть товар',
      position: 'bottomCenter',
      backgroundColor: '#ad0000',
      messageColor: "white",
      closeOnClick: true,
    });
    return;
  }
  const itemCount = localStorage.getItem(bookName.textContent) || 0;
  const updatedCount = parseInt(itemCount) + modalCount;
  localStorage.setItem(bookName.textContent, updatedCount);
  // Функціонал отримання інформації про вміст товару в корзині
  productAmount.innerHTML = `Загальна кількість товару в корзині: ${updatedCount}`;
  iziToast.success({
    message: `Додано в корзину: ${modalCount} (Цього товару в корзині: ${updatedCount})`,
    position: 'bottomCenter',
    backgroundColor: 'var(--color-primary)',
    messageColor: 'white',
    closeOnClick: true,
  });
  
});

// Купівля товару (якщо в корзині є цей товар (тобто кількість !== 0))
buyNow.addEventListener('click', () => {
  const storedCount = parseInt(localStorage.getItem(bookName.textContent)) || 0;
  if (storedCount === 0) {
    iziToast.error({
      message: 'Спочатку візьміть товар',
      closeOnClick: true,
      position: 'bottomCenter',
      backgroundColor: '#ad0000',
      messageColor: 'white',
    });
    return;
  }
  iziToast.success({
    message: 'Дякуємо за покупку!',
    closeOnClick: true,
    position: 'bottomCenter',
    backgroundColor: 'var(--color-primary)',
    messageColor: 'white',
  });
});

// Функціонал відкриття вкладок з інформацією про товар, доставку та повернення
new Accordion('.accordion-container', {
  duration: 300,
  showMultiple: true,
  onOpen: (currentElement) => {   
    // Функціонал скроллу після відкриття кожної вкладки на його висоту
    // (задля зручності користувачу дістатись іншої вкладки без зусиль)
    const height = currentElement.getBoundingClientRect().height;     
    bookModal.scrollBy({
      top: height,
      behavior: "smooth",
    }); 
  },
  onClose: () => {
    // Функціонал скроллу до початку сторінки (саме вікна модалки, тобто bookModal.clientHeight)
    // у випадку, коли ВСІ вкладки закриті
    const accordions = document.querySelectorAll('.ac');
    const anyOpen = Array.from(accordions).some(ac => ac.classList.contains('is-active'));
    if (!anyOpen) {
      bookModal.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  },
});

// #endregion BV book modal

// Modal elems
// const bookModalOverlay = document.getElementById('bookModalOverlay');
// const bookModalClose = document.getElementById('modalCloseBtn');
// const modalImg = document.getElementById('modalImg');
// const modalTitle = document.getElementById('modalTitle');
// const modalAuthor = document.getElementById('modalAuthor');
// const modalPrice = document.getElementById('modalPrice');
// const modalCounter = document.getElementById('modalCounter');
// const modalMinusBtn = document.getElementById('modalMinusBtn');
// const modalPlusBtn = document.getElementById('modalPlusBtn');
// const modalAddBtn = document.getElementById('modalAddBtn');
// const modalBuyBtn = document.getElementById('modalBuyBtn');
// const modalAccordion = document.getElementById('modalAccordion');

// let modalCount = 0;

// Closing the modal (cross, click on the bg, esc)
// function closeModal() {
//   bookModalOverlay?.classList.remove('open');
//   document.body.style.overflow = '';
// }
// if (bookModalClose) {
//   bookModalClose.addEventListener('click', closeModal);
// }
// if (bookModalOverlay) {
//   bookModalOverlay.addEventListener('click', e => {
//     if (e.target === bookModalOverlay) closeModal();
//   });
// }
// document.addEventListener('keydown', e => {
//   if (e.key === 'Escape' && bookModalOverlay?.classList.contains('open')) {
//     closeModal();
//   }
// });

// Counter
// if (modalMinusBtn && modalCounter) {
//   modalMinusBtn.addEventListener('click', () => {
//     if (modalCount > 0) modalCount--;
//     modalCounter.textContent = modalCount;
//   });
// }
// if (modalPlusBtn && modalCounter) {
//   modalPlusBtn.addEventListener('click', () => {
//     modalCount++;
//     modalCounter.textContent = modalCount;
//   });
// }

// Add to cart
// if (modalAddBtn) {
//   modalAddBtn.addEventListener('click', () => {
//     if(modalCount === 0 || modalCounter.textContent === 0) {
//         iziToast.error({
//             message: 'Спочатку візьміть товар',
//             position: 'bottomCenter',
//             backgroundColor: '#ad0000',
//             messageColor: "white",
//             closeOnClick: true,
//         });
//         return;
//     }
//     iziToast.success({
//       message: `Добавлено в корзину: ${modalCount}`,
//       position: 'bottomCenter',
//       backgroundColor: 'var(--color-primary)',
//       messageColor: 'white',
//       closeOnClick: true,
//     });
//   });
// }


// Buy now
// if (modalBuyBtn) {
//   modalBuyBtn.addEventListener('click', () => {
//     iziToast.success({
//       message: 'Дякуємо за покупку',
//       position: 'bottomCenter',
//       backgroundColor: 'var(--color-primary)',
//       messageColor: 'white',
//       closeOnClick: true,
//     });
//   });
// }

// Accordion (details/shipping/returns)
// function buildAccordion(book) {
//   if (!modalAccordion) return;
//   modalAccordion.innerHTML = '';
//   const data = [
//     { title: 'Details', content: book.description || 'No info' },
//     {
//       title: 'Shipping',
//       content:
//         'We ship across the United States within 2–5 business days. All orders are processed through USPS or a reliable courier service. Enjoy free standard shipping on orders over $50.',
//     },
//     {
//       title: 'Returns',
//       content:
//         'You can return an item within 14 days of receiving your order, provided it hasn’t been used and is in its original condition. To start a return, please contact our support team — we’ll guide you through the process quickly and hassle-free.',
//     },
//   ];
//   data.forEach((item, idx) => {
//     const section = document.createElement('div');
//     section.className = 'ac' + (idx === 0 ? ' is-active' : '');
//     section.innerHTML = `
//         <h2 class="ac-header">
//           <button type="button" class="ac-trigger">${item.title}
//             <div class="icon-box">
//               <svg class="trigger-icon" width="12" height="12"><use href="sprite.svg#smooth-arrow-down"></use></svg>
//             </div>
//           </button>
//         </h2>
//         <div class="ac-panel">
//           <p class="ac-text">${item.content}</p>
//         </div>
//       `;
//     modalAccordion.appendChild(section);
//   });
//   new Accordion('.accordion-container', {
//     duration: 200,
//     showMultiple: true,
//     openOnInit: [0],
//   });
// }


// contact modal

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
                position: 'bottomCenter',
                closeOnClick: true,
            });
        } else {
            input.classList.remove("invalid");
        }
    });

    if (isValid) {
        iziToast.success({
            title: 'Valid Input',
            message: `Registered successfully.`,
            position: 'bottomCenter',
            closeOnClick: true,
        });
        contactForm.reset();
    }
});

function closeContactModal() {
    document.querySelector('.contact-modal-overlay').classList.remove('open');
    document.body.style.overflow = ''; 
}

