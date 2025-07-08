
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let current = 0;

// Показує потрібний слайд
function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    slide.setAttribute('aria-hidden', 'true');
    if (i === index) {
      slide.classList.add('active');
      slide.setAttribute('aria-hidden', 'false');
    }
  });
}

// Підсвічує кнопку на мить (ефект "active")
function flashButton(button) {
  button.classList.add('is-active');

  // Знімаємо фокус, щоб уникнути залипання стилів
  button.blur();

  // Прибираємо клас через 150 мс
  setTimeout(() => {
    button.classList.remove('is-active');
  }, 350);
}

// Ініціалізація слайдера
if (slides.length > 0) {
  prevBtn.addEventListener('click', () => {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
    flashButton(prevBtn);
  });

  nextBtn.addEventListener('click', () => {
    current = (current + 1) % slides.length;
    showSlide(current);
    flashButton(nextBtn);
  });

  // Автоперемикання слайдів
  setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, 7000);
}