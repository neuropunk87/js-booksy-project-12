import {
  fetchCategories,
  fetchBooksByCategory,
  fetchTopBooks,
  fetchBookById,
} from './api.js';

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

// Буглак: додав функцію перетворення назв так, щоб згідно макету кожне слово з великої літери,
// а не усі слова великими літерами
function capitalizeWords(str) {
    return str.split(' ')
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
const BOOKS_PER_PAGE_MOBILE = 10;
const BOOKS_PER_PAGE_TABLET = 24;
const BOOKS_PER_PAGE_INCREMENT = 4;

function getBooksPerPage() {
  const width = window.innerWidth;
  if (width < BREAKPOINT_TABLET) return BOOKS_PER_PAGE_MOBILE;
  return BOOKS_PER_PAGE_TABLET;
}
let booksPerPage = getBooksPerPage();

// // Responsive booksPerPage
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
}

function renderBook(book) {
  return `
    <li class="books-item">
      <img class="books-item__img" src="${book.book_image}" alt="${book.title}">
      <div class="books-item__info">
        <h3 class="books-item__title">${capitalizeWords(book.title)}</h3>
        <span class="books-item__price">$${book.price || '—'}</span>
      </div>
      <div class="books-item__author">${book.author}</div>
      <button type="button" class="books-item__btn" data-id="${
        book._id
      }">Learn More</button>
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
    const bookId = e.target.dataset.id;
    const book = await fetchBookById(bookId);
    if (window.openBookModal && typeof window.openBookModal === 'function') {
      window.openBookModal(book);
    }
  }
});

(async function initBooksSection() {
  await renderCategoriesDropdown();
  selectCategoryDropdown(0);
})();
