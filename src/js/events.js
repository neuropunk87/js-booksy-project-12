import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Pagination, Autoplay } from 'swiper/modules';

function initSwiper() {
  const container = document.querySelector('.swiper.events-carousel');
  if (!container) return;

  const prev = document.querySelector('.events-button-prev');
  const next = document.querySelector('.events-button-next');
  const paginationEl = document.querySelector('.swiper-pagination');

  const slidesCount = container.querySelectorAll('.swiper-slide').length;
  const maxSlidesPerView = 3;
  const enableLoop = slidesCount > maxSlidesPerView;

  const swiper = new Swiper(container, {
    modules: [Navigation, Pagination, Autoplay],
    slidesPerView: 1,
    spaceBetween: 24,
    observer: true,
    observeParents: true,
    loop: enableLoop,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    speed: 800,
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

  container.addEventListener('mouseenter', () => swiper.autoplay.stop());
  container.addEventListener('mouseleave', () => swiper.autoplay.start());

  function toggleNav(sw) {
    const total = sw.slides.length;
    const visible = Math.floor(sw.params.slidesPerView) || 1;
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

const registerButtons = document.querySelectorAll('.events-register');
registerButtons.forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();
    const li = event.currentTarget.closest('.events-list-element');
    const eventTitle = li.querySelector('.events-name').textContent.trim();
    document.querySelector('.contact-modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    document.querySelector('.contact-modal-event').textContent = eventTitle;
  });
});
