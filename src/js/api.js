import axios from 'axios';

const API_BASE = 'https://books-backend.p.goit.global/books';

export async function fetchCategories() {
  const res = await axios.get(`${API_BASE}/category-list`);
  return res.data;
}

export async function fetchBooksByCategory(category) {
  const res = await axios.get(`${API_BASE}/category`, {
    params: { category },
  });
  return res.data;
}

export async function fetchTopBooks() {
  const res = await axios.get(`${API_BASE}/top-books`);
  return res.data.flatMap(item => item.books);
}

export async function fetchBookById(id) {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
}
