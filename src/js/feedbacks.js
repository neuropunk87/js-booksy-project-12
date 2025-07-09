import Swiper from 'swiper';
import { Navigation, Pagination, Keyboard, Mousewheel } from 'swiper/modules';

const pagEl = document.querySelector('.swiper-pagination-feedback');
const prevBtn = document.querySelector('.feedback-button-prev');
const nextBtn = document.querySelector('.feedback-button-next');

const swiper = new Swiper('.swiper.feedback-content', {
  modules: [Navigation, Pagination, Keyboard, Mousewheel],
  slidesPerView: 1,
  spaceBetween: 16,
  observer: true,
  observeParents: true,
  speed: 800,
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
    el: '.swiper-pagination-feedback',
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
    init() {
      toggleNav(this)
    },
    resize() {
      toggleNav(this)
    },
    slideChange() {
      toggleNav(this)
    }
  },
});

function toggleNav(sw) {
    const total = sw.slides.length;
    const visible = Math.floor(sw.params.slidesPerView) || 1;
    const hideAll = total <= visible;

    if (prevBtn && nextBtn) {
      if (hideAll) {
        prevBtn.classList.add('is-hidden');
        nextBtn.classList.add('is-hidden');
      } else {
        prevBtn.classList.remove('is-hidden');
        nextBtn.classList.remove('is-hidden');
        prevBtn.classList.toggle('swiper-button-disabled', sw.isBeginning);
        nextBtn.classList.toggle('swiper-button-disabled', sw.isEnd);
      }
    }

    if (pagEl) {
      pagEl.style.display = hideAll ? 'none' : 'flex';
    }
  }

// slideChange: function () {

//       if (this.isBeginning) {
//         prevBtn.classList.add('is-disabled');
//       } else {
//         prevBtn.classList.remove('is-disabled');
//       }

//       if (this.isEnd) {
//         nextBtn.classList.add('is-disabled');
//       } else {
//         nextBtn.classList.remove('is-disabled');
//       }
//       if (pagEl) {
//       pagEl.style.display = hideAll ? 'none' : 'flex';
//     }
//     },

//     afterInit: function () {
//       const prevBtn = document.querySelector('.feedback-button-prev');
//       const nextBtn = document.querySelector('.feedback-button-next');

//       if (this.isBeginning) {
//         prevBtn.classList.add('is-disabled');
//       }
//       if (this.isEnd) {
//         nextBtn.classList.add('is-disabled');
//       }
//       if (pagEl) {
//       pagEl.style.display = hideAll ? 'none' : 'flex';
//     }
//     },