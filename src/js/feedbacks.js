import Swiper from 'swiper';
import {
  Navigation,
  Pagination,
  Keyboard,
  Mousewheel,
  A11y,
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const swiper = new Swiper('.feedback-content', {
  modules: [Navigation, Pagination, Keyboard, Mousewheel, A11y],
  slidesPerView: 1,
  spaceBetween: 24,
  loop: false,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },
  mousewheel: {
    forceToAxis: true,
  },
  a11y: {
    enabled: true,
  },
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
});

swiper.on('slideChange', () => {
  const prevBtn = document.querySelector('.swiper-button-prev');
  const nextBtn = document.querySelector('.swiper-button-next');

  if (swiper.isBeginning) {
    prevBtn.classList.add('is-disabled');
  } else {
    prevBtn.classList.remove('is-disabled');
  }

  if (swiper.isEnd) {
    nextBtn.classList.add('is-disabled');
  } else {
    nextBtn.classList.remove('is-disabled');
  }
});

swiper.emit('slideChange');
