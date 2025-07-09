import Swiper from 'swiper';
import { Navigation, Pagination, Keyboard, Mousewheel } from 'swiper/modules';

const swiper = new Swiper('.swiper', {
  modules: [Navigation, Pagination, Keyboard, Mousewheel],

  slidesPerView: 1,
  spaceBetween: 16,

  breakpoints: {
    768: { 
      slidesPerView: 2,
      spaceBetween: 24,
    },
    1440: { 
      slidesPerView: 3,
      spaceBetween: 24,
    },
  },

  navigation: {
    nextEl: '.feedback-button-next',
    prevEl: '.feedback-button-prev',
  },

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },

  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },

  mousewheel: {
    forceToAxis: true,
  },

  on: {
    slideChange: function () {
      const prevBtn = document.querySelector('.feedback-button-prev');
      const nextBtn = document.querySelector('.feedback-button-next');

      if (this.isBeginning) {
        prevBtn.classList.add('is-disabled');
      } else {
        prevBtn.classList.remove('is-disabled');
      }

      if (this.isEnd) {
        nextBtn.classList.add('is-disabled');
      } else {
        nextBtn.classList.remove('is-disabled');
      }
    },
    afterInit: function () {
      const prevBtn = document.querySelector('.feedback-button-prev');
      const nextBtn = document.querySelector('.feedback-button-next');

      if (this.isBeginning) {
        prevBtn.classList.add('is-disabled');
      }
      if (this.isEnd) {
        nextBtn.classList.add('is-disabled');
      }
    },
  },
});

