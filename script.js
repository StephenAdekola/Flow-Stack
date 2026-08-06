// --- Hamburger menu ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// --- Pricing calculator ---
const BASE_PRICE = 49;
const PRICE_PER_USER = 8;
const PRICE_PER_10GB = 2;
const PRICE_PER_PROJECT = 2;
const YEARLY_DISCOUNT = 0.2;

const usersSlider = document.getElementById('users');
const storageSlider = document.getElementById('storage');
const projectsSlider = document.getElementById('projects');
const billingToggle = document.getElementById('billingToggle');

const usersValue = document.getElementById('usersValue');
const storageValue = document.getElementById('storageValue');
const projectsValue = document.getElementById('projectsValue');
const totalPrice = document.getElementById('totalPrice');
const priceBreakdown = document.getElementById('priceBreakdown');
const priceLabel = document.getElementById('priceLabel');
const pricePeriod = document.getElementById('pricePeriod');
const billingNote = document.getElementById('billingNote');
const monthlyLabel = document.getElementById('monthlyLabel');
const yearlyLabel = document.getElementById('yearlyLabel');

function calculatePrice() {
  const users = Number(usersSlider.value);
  const storage = Number(storageSlider.value);
  const projects = Number(projectsSlider.value);
  const isYearly = billingToggle.checked;

  const userCost = users * PRICE_PER_USER;
  const storageCost = (storage / 10) * PRICE_PER_10GB;
  const projectCost = projects * PRICE_PER_PROJECT;
  const monthlyTotal = BASE_PRICE + userCost + storageCost + projectCost;
  const discount = Math.round(monthlyTotal * YEARLY_DISCOUNT);
  const yearlyMonthly = monthlyTotal - discount;
  const displayTotal = isYearly ? yearlyMonthly : monthlyTotal;

  usersValue.textContent = users;
  storageValue.textContent = storage;
  projectsValue.textContent = projects;

  monthlyLabel.classList.toggle('active', !isYearly);
  yearlyLabel.classList.toggle('active', isYearly);

  priceLabel.textContent = isYearly
    ? 'Estimated monthly cost (billed yearly)'
    : 'Estimated monthly cost';
  pricePeriod.textContent = '/mo';

  if (isYearly) {
    billingNote.className = 'billing-note';
    billingNote.innerHTML = `If paid monthly: <strong>$${monthlyTotal}/mo</strong> · Billed <strong>$${yearlyMonthly * 12}/yr</strong>`;
  } else {
    billingNote.className = 'billing-note savings';
    billingNote.innerHTML = `If paid annually: <strong>$${yearlyMonthly}/mo</strong> · Save $${discount}/mo (20%)`;
  }

  totalPrice.textContent = displayTotal;
  totalPrice.classList.remove('bump');
  void totalPrice.offsetWidth;
  totalPrice.classList.add('bump');

  let breakdown = `
    <li><span>Base plan</span><span>$${BASE_PRICE}</span></li>
    <li><span>${users} user${users !== 1 ? 's' : ''} × $${PRICE_PER_USER}</span><span>$${userCost}</span></li>
    <li><span>${storage} GB storage</span><span>$${storageCost}</span></li>
    <li><span>${projects} project${projects !== 1 ? 's' : ''}</span><span>$${projectCost}</span></li>
  `;

  if (isYearly) {
    breakdown += `<li class="discount-line"><span>Yearly discount (20%)</span><span>−$${discount}</span></li>`;
  }

  priceBreakdown.innerHTML = breakdown;
}

[usersSlider, storageSlider, projectsSlider].forEach(slider => {
  slider.addEventListener('input', calculatePrice);
});

billingToggle.addEventListener('change', calculatePrice);

calculatePrice();

// --- Scroll reveal for cards ---
const cards = document.querySelectorAll('.feature-card, .testimonial-card');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

cards.forEach(card => observer.observe(card));
