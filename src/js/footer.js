import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.footer-form');
const input = document.querySelector('.footer-form-input');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const email = input.value.trim();
  const pattern = /^\w+(\.\w+)?@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

  if (!pattern.test(email)) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a valid email address.',
      closeOnClick: true,
      position: 'topRight',
      backgroundColor: 'var(--color-invalid)',
      messageColor: 'white',
    });
    return;
  }

  localStorage.setItem('userEmail', email);
  iziToast.success({
    title: 'Success',
    message: 'Thank you for signing up!',
    closeOnClick: true,
    position: 'topRight',
    backgroundColor: 'var(--color-primary)',
    messageColor: 'white',
  });
});
