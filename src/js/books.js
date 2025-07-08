import {
  fetchCategories,
  fetchBooksByCategory,
  fetchTopBooks,
  fetchBookById,
} from './api.js';

// Loader control start
function showLoader(target = document.body) {
  const loaderWrap = document.createElement('div');
  loaderWrap.className = 'loader-backdrop';
  loaderWrap.style.cssText = `
    position: fixed;
    z-index: 1200;
    inset: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(252,238,230,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  loaderWrap.innerHTML = `<span class="loader"></span>`;
  loaderWrap.id = 'main-loader';
  target.appendChild(loaderWrap);
}
function hideLoader() {
  const exist = document.getElementById('main-loader');
  if (exist) exist.remove();
}
// Loader control end

const booksList = document.getElementById('books-list');
const booksCount = document.getElementById('books-count');
const showMoreBtn = document.getElementById('show-more-btn');
const categoriesDropdownBtn = document.getElementById('categoriesDropdownBtn');
const categoriesDropdownList = document.getElementById(
  'categoriesDropdownList'
);
const categoriesDropdownSelected = document.getElementById(
  'categoriesDropdownSelected'
);
const sideBarCategoryList = document.querySelector('.sidebar-category-list');

// Буглак: додав функцію перетворення назв так, щоб згідно макету кожне слово з великої літери,
// а не усі слова великими літерами
function capitalizeWords(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

let categoriesArr = [];
let selectedDropdownIdx = 0;
let allBooks = [];
let filteredBooks = [];
let displayedCount = 0;
let totalCount = 0;
let currentCategory = '';

const BREAKPOINT_TABLET = 768;
const BREAKPOINT_DESCTOP = 1440;
const BOOKS_PER_PAGE_MOBILE = 10;
const BOOKS_PER_PAGE_TABLET = 24;
const BOOKS_PER_PAGE_INCREMENT = 4;

function getBooksPerPage() {
  const width = window.innerWidth;
  if (width < BREAKPOINT_TABLET) return BOOKS_PER_PAGE_MOBILE;
  return BOOKS_PER_PAGE_TABLET;
}
let booksPerPage = getBooksPerPage();

// Responsive booksPerPage
window.addEventListener('resize', () => {
  const newPerPage = getBooksPerPage();
  if (newPerPage !== booksPerPage) {
    booksPerPage = newPerPage;
    displayedCount = Math.min(displayedCount, booksPerPage);
    renderBooksList();
  }
});

// Dropdown
async function renderCategoriesDropdown() {
  showLoader();
  try {
    categoriesArr = await fetchCategories();
    categoriesDropdownSelected.textContent = 'Categories';
    categoriesDropdownList.innerHTML = `
    <li role="option" tabindex="0" data-idx="0" class="selected">All categories</li>
    ${categoriesArr
      .map(
        (cat, idx) =>
          `<li role="option" tabindex="0" data-idx="${idx + 1}">${
            cat.list_name
          }</li>`
      )
      .join('')}
  `;
  } finally {
    hideLoader();
  }
}

function openCategoriesDropdown() {
  categoriesDropdownList.classList.add('open');
  categoriesDropdownBtn.setAttribute('aria-expanded', 'true');
  setTimeout(() => categoriesDropdownList.focus(), 0);
}

function closeCategoriesDropdown() {
  categoriesDropdownList.classList.remove('open');
  categoriesDropdownBtn.setAttribute('aria-expanded', 'false');
}

categoriesDropdownBtn.addEventListener('click', e => {
  if (
    e.target.closest('.dropdown-arrow-wrap') ||
    e.target === categoriesDropdownBtn
  ) {
    categoriesDropdownList.classList.contains('open')
      ? closeCategoriesDropdown()
      : openCategoriesDropdown();
  }
});

categoriesDropdownBtn.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
    e.preventDefault();
    openCategoriesDropdown();
    categoriesDropdownList.querySelector('li.selected')?.focus();
  }
});

categoriesDropdownList.addEventListener('click', e => {
  if (e.target.tagName === 'LI') {
    selectCategoryDropdown(Number(e.target.dataset.idx));
    closeCategoriesDropdown();
  }
});

categoriesDropdownList.addEventListener('keydown', e => {
  const items = Array.from(categoriesDropdownList.querySelectorAll('li'));
  let idx = items.findIndex(li => li.classList.contains('selected'));
  if (e.key === 'ArrowDown' && idx < items.length - 1) {
    e.preventDefault();
    items[idx].classList.remove('selected');
    idx++;
    items[idx].classList.add('selected');
    items[idx].focus();
  }
  if (e.key === 'ArrowUp' && idx > 0) {
    e.preventDefault();
    items[idx].classList.remove('selected');
    idx--;
    items[idx].classList.add('selected');
    items[idx].focus();
  }
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    selectCategoryDropdown(idx);
    closeCategoriesDropdown();
    categoriesDropdownBtn.focus();
  }
  if (e.key === 'Escape') {
    closeCategoriesDropdown();
    categoriesDropdownBtn.focus();
  }
});

document.addEventListener('mousedown', e => {
  if (
    !categoriesDropdownBtn.contains(e.target) &&
    !categoriesDropdownList.contains(e.target)
  )
    closeCategoriesDropdown();
});

function selectCategoryDropdown(idx) {
  selectedDropdownIdx = idx;
  const items = Array.from(categoriesDropdownList.querySelectorAll('li'));
  items.forEach(li => li.classList.remove('selected'));
  items[idx].classList.add('selected');
  categoriesDropdownSelected.textContent = 'Categories';
  if (idx === 0) {
    currentCategory = '';
    loadBooks('');
  } else {
    currentCategory = categoriesArr[idx - 1].list_name;
    loadBooks(currentCategory);
  }
}

// Books loading and rendering
async function loadBooks(category = '') {
  showLoader();
  try {
    if (category) {
      allBooks = await fetchBooksByCategory(category);
    } else {
      allBooks = await fetchTopBooks();
    }
    filteredBooks = allBooks;
    totalCount = filteredBooks.length;
    booksPerPage = getBooksPerPage();
    displayedCount = Math.min(booksPerPage, totalCount);
    renderBooksList();
  } finally {
    hideLoader();
  }
}

function renderBook(book) {
  const { book_image, _id, author, price, title } = book;
  const width = window.innerWidth;
  let n;
  if (width >= BREAKPOINT_DESCTOP) {
    n = 15;
  } else if (width < BREAKPOINT_DESCTOP) {
    n = 30;
  }

  return `
    <li class="books-item">
      <img class="books-item__img" src="${book_image}" alt="${title}">
      <div class="books-item__info">
        <h3 class="books-item__title">${getNewTitle(title, n)}</h3>
        <span class="books-item__price">$${price || '—'}</span>
      </div>
      <div class="books-item__author">${getNewTitle(author, 30)}</div>
      <button type="button" class="books-item__btn" data-id="${_id}">Learn More</button>
    </li>
  `;
}

function renderBooksList() {
  booksList.innerHTML = filteredBooks
    .slice(0, displayedCount)
    .map(renderBook)
    .join('');
  booksCount.textContent = `Showing ${Math.min(
    displayedCount,
    totalCount
  )} of ${totalCount}`;
  if (displayedCount >= totalCount) {
    showMoreBtn.style.display = 'none';
  } else {
    showMoreBtn.style.display = 'block';
  }
}

// SideBar
renderCategoriesSidebar();

async function renderCategoriesSidebar() {
  showLoader();
  try {
    categoriesArr = await fetchCategories();
    sideBarCategoryList.innerHTML = `
    <li class="sidebar-category" data-idx="0"">All categories</li>
    ${categoriesArr
      .map(
        (cat, idx) =>
          `<li class="sidebar-category" data-idx="${idx + 1}" data-category="${
            cat.list_name
          }">${cat.list_name}</li>`
      )
      .join('')}
  `;
    sideBarCategoryList.addEventListener('click', onClick);
  } finally {
    hideLoader();
  }
}

function onClick(event) {
  const idx = Number(event.target.dataset.idx);
  if (idx === 0) {
    currentCategory = '';
    loadBooks('');
  } else {
    const currentCategory = event.target.dataset.category;
    loadBooks(currentCategory);
  }
}

// Update title in book card
function getNewTitle(string, n) {
  const arr = string.split(' ');
  let newArr = [];
  arr.forEach(item => {
    newArr.push(item.charAt(0).toUpperCase() + item.slice(1).toLowerCase());
  });
  const res = newArr.join(' ');
  if (res.length >= n) {
    return res.slice(0, n).trim() + '...';
  }
  return res;
}

// Show More
showMoreBtn.addEventListener('click', () => {
  displayedCount = Math.min(
    displayedCount + BOOKS_PER_PAGE_INCREMENT,
    totalCount
  );
  renderBooksList();
});

// Modal open (click on Learn More, imported from modal.js)
booksList.addEventListener('click', async e => {
  if (e.target.classList.contains('books-item__btn')) {
    showLoader();
    try {
      const bookId = e.target.dataset.id;
      const book = await fetchBookById(bookId);
      if (window.openBookModal && typeof window.openBookModal === 'function') {
        window.openBookModal(book);
      }
    } finally {
      hideLoader();
    }
  }
});

(async function initBooksSection() {
  await renderCategoriesDropdown();
  selectCategoryDropdown(0);
})();
