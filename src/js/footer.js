const form = document.querySelector('.footer-form');
const input = document.querySelector('.footer-form-input');

form.addEventListener('submit', function (event) {
  const email = input.value.trim();
  const pattern = /^\w+(\.\w+)?@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

  if (!pattern.test(email)) {
    event.preventDefault();
    alert('Please enter a valid email address.');
    return;
  }

  localStorage.setItem('userEmail', email);
  alert('Thank you for signing up!');
});
