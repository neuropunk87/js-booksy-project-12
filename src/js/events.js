import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Pagination } from 'swiper/modules';

function initSwiper() {
  const container = document.querySelector('.swiper.events-carousel');
  if (!container) return;

  const prev = document.querySelector('.events-button-prev');
  const next = document.querySelector('.events-button-next');
  const paginationEl = document.querySelector('.swiper-pagination');

  const swiper = new Swiper(container, {
    modules: [Navigation, Pagination],
    slidesPerView: 1,
    spaceBetween: 24,
    observer: true,
    observeParents: true,
    pagination: { el: paginationEl, clickable: true },
    navigation: { nextEl: next, prevEl: prev }, 
    breakpoints: {
      768: { slidesPerView: 2, spaceBetween: 24 },
      1440: { slidesPerView: 3, spaceBetween: 24 },
    },
    on: {
      init() {
        toggleNav(this);
      },
      resize() {
        toggleNav(this);
      },
      slideChange() {
        toggleNav(this);
      },
    },
  });

  function toggleNav(sw) {
    const total = sw.slides.length;
    const visible = Math.floor(sw.slidesPerView);
    const hideAll = total <= visible;

    if (prev && next) {
      if (hideAll) {
        prev.classList.add('is-hidden');
        next.classList.add('is-hidden');
      } else {
        prev.classList.remove('is-hidden');
        next.classList.remove('is-hidden');
        prev.classList.toggle('swiper-button-disabled', sw.isBeginning);
        next.classList.toggle('swiper-button-disabled', sw.isEnd);
      }
    }

    if (paginationEl) {
      paginationEl.style.display = hideAll ? 'none' : 'flex';
    }
  }
}

document.addEventListener('DOMContentLoaded', initSwiper);
