/* Lightweight interaction layer: navigation, theme, forms and reveal effects. */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

window.addEventListener('load', () => $('.page-loader').classList.add('done'));

const header = $('.site-header');
const navLinks = $$('.nav-links a:not(.nav-cta)');
const menu = $('.menu-toggle');
const nav = $('.nav-links');
const toTop = $('.to-top');

menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', open);
  menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
$$('.nav-links a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

const sections = $$('main section[id]');
function updatePageState() {
  header.classList.toggle('scrolled', window.scrollY > 28);
  toTop.classList.toggle('visible', window.scrollY > 500);
  let active = 'top';
  sections.forEach(section => { if (window.scrollY >= section.offsetTop - 130) active = section.id; });
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${active}`));
}
window.addEventListener('scroll', updatePageState, { passive: true });
updatePageState();
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const theme = $('.theme-toggle');
if (localStorage.getItem('law-site-theme') === 'light') document.body.classList.add('light');
theme.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('law-site-theme', document.body.classList.contains('light') ? 'light' : 'dark');
});

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: .12 });
$$('.reveal').forEach(item => observer.observe(item));

$$('form').forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  const message = $('.form-message', form);
  message.textContent = form.dataset.success;
  message.classList.add('show');
  form.reset();
}));
