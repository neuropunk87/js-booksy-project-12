const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.querySelector('.close-menu');
const backdrop = document.getElementById('backdrop');
const navLinks = document.querySelectorAll('.mobile-nav-links a');

function openMenu() {
  mobileMenu.classList.add('active');
  backdrop.classList.add('active');
  document.body.classList.add('menu-open');
}

function closeMobileMenu() {
  mobileMenu.classList.remove('active');
  backdrop.classList.remove('active');
  document.body.classList.remove('menu-open');
}

menuToggle?.addEventListener('click', openMenu);
closeMenu?.addEventListener('click', closeMobileMenu);
backdrop?.addEventListener('click', closeMobileMenu);
navLinks?.forEach(link => link.addEventListener('click', closeMobileMenu));