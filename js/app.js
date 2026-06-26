/**
 * EMS – The E-Millenial Store
 * Main application logic
 */

// ─── Configuration ──────────────────────────────────────────────────────────
// Change STORE_CURRENCY to match the currency supported by your Paystack merchant account.
// - 'NGN': Nigerian Naira (₦)
// - 'GHS': Ghanaian Cedi (GH₵)
// - 'ZAR': South African Rand (R)
// - 'KES': Kenyan Shilling (KSh)
// - 'USD': US Dollar ($)
const STORE_CURRENCY = 'GHS'; // Defaulting to GHS to resolve 'Currency not supported' for non-NGN accounts. Change as needed.

const CURRENCY_SYMBOLS = {
  NGN: '₦',
  GHS: 'GH₵',
  ZAR: 'R',
  KES: 'KSh',
  USD: '$'
};

// ─── State ─────────────────────────────────────────────────────────────────
let cart = []; // Array of { ...product, quantity }

// ─── DOM Refs ───────────────────────────────────────────────────────────────
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartOverlay = document.getElementById('cartOverlay');
const cartModal = document.getElementById('cartModal');
const cartClose = document.getElementById('cartClose');
const continueShopBtn = document.getElementById('continueShoppingBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const cartTableBody = document.getElementById('cartTableBody');
const cartEmpty = document.getElementById('cartEmpty');
const cartTotal = document.getElementById('cartTotal');
const summaryOverlay = document.getElementById('summaryOverlay');
const summaryOkBtn = document.getElementById('summaryOkBtn');
const summaryTableBody = document.getElementById('summaryTableBody');
const summaryName = document.getElementById('summaryName');

// Form fields
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userPhone = document.getElementById('userPhone');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const phoneError = document.getElementById('phoneError');

// ─── Render Products ────────────────────────────────────────────────────────
function renderProducts() {
  productsGrid.innerHTML = '';
  productsList.forEach(product => {
    const inCart = cart.some(item => item.id === product.id);
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.innerHTML = `
      <div class="product-img-wrap">
        <img
          src="${product.image}"
          alt="${product.alt}"
          class="product-img"
          loading="lazy"
        />
        <div class="product-price-overlay">
          <span class="price-label">Price</span>
          <span class="price-value">${formatCurrency(product.price)}</span>
        </div>
      </div>
      <h3 class="product-name">${product.name}</h3>
      <button
        class="btn ${inCart ? 'btn-remove' : 'btn-primary'} add-to-cart-btn"
        data-id="${product.id}"
        aria-pressed="${inCart}"
      >
        ${inCart ? 'REMOVE FROM CART' : 'ADD TO CART'}
      </button>
    `;
    productsGrid.appendChild(card);
  });

  // Attach button listeners
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', handleCartToggle);
  });
}

// ─── Cart Toggle ────────────────────────────────────────────────────────────
function handleCartToggle(e) {
  const id = parseInt(e.currentTarget.dataset.id);
  const product = productsList.find(p => p.id === id);
  if (!product) return;

  const existingIndex = cart.findIndex(item => item.id === id);

  if (existingIndex === -1) {
    // Add to cart
    cart.push({ ...product, quantity: 1 });
  } else {
    // Remove from cart
    cart.splice(existingIndex, 1);
  }

  updateCartCount();
  renderProducts();
  renderCartTable();
}

// ─── Cart Count ─────────────────────────────────────────────────────────────
function updateCartCount() {
  cartCount.textContent = cart.length;
  cartCount.classList.toggle('pulse', cart.length > 0);
}

// ─── Cart Table ─────────────────────────────────────────────────────────────
function renderCartTable() {
  cartTableBody.innerHTML = '';

  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartTotal.textContent = formatCurrency(0);
    return;
  }

  cartEmpty.style.display = 'none';

  cart.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td class="item-price" data-id="${item.id}">${formatCurrency(item.price * item.quantity)}</td>
      <td class="qty-cell">
        <button class="qty-btn qty-dec" data-id="${item.id}" aria-label="Decrease quantity">−</button>
        <span class="qty-value" id="qty-${item.id}">${item.quantity}</span>
        <button class="qty-btn qty-inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
      </td>
      <td>
        <button class="remove-btn" data-id="${item.id}" aria-label="Remove ${item.name}">Remove</button>
      </td>
    `;
    cartTableBody.appendChild(row);
  });

  // Quantity buttons
  document.querySelectorAll('.qty-inc').forEach(btn => {
    btn.addEventListener('click', () => changeQuantity(parseInt(btn.dataset.id), 1));
  });
  document.querySelectorAll('.qty-dec').forEach(btn => {
    btn.addEventListener('click', () => changeQuantity(parseInt(btn.dataset.id), -1));
  });
  // Remove buttons inside cart
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
  });

  updateTotal();
}

// ─── Quantity Change ────────────────────────────────────────────────────────
function changeQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity < 1) item.quantity = 1;

  renderCartTable();
}

// ─── Remove from Cart (inside modal) ────────────────────────────────────────
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartCount();
  renderCartTable();
  renderProducts(); // sync product buttons
}

// ─── Total ───────────────────────────────────────────────────────────────────
function updateTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = formatCurrency(total);
}

// ─── Format Currency ─────────────────────────────────────────────────────────
function formatCurrency(amount) {
  const symbol = CURRENCY_SYMBOLS[STORE_CURRENCY] || '₦';
  return symbol + amount.toLocaleString('en-US');
}

// ─── Open / Close Cart ───────────────────────────────────────────────────────
function openCart() {
  renderCartTable();
  cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
continueShopBtn.addEventListener('click', closeCart);

// Close on overlay click (outside modal)
cartOverlay.addEventListener('click', e => {
  if (e.target === cartOverlay) closeCart();
});

// ─── Form Validation ─────────────────────────────────────────────────────────
function clearErrors() {
  nameError.textContent = '';
  emailError.textContent = '';
  phoneError.textContent = '';
  [userName, userEmail, userPhone].forEach(el => el.classList.remove('input-error'));
}

function validateField(field) {
  const val = field.value.trim();
  if (field === userName) {
    if (!val) { nameError.textContent = 'Name is required.'; userName.classList.add('input-error'); return false; }
    if (val.length < 2) { nameError.textContent = 'Name must be at least 2 characters.'; userName.classList.add('input-error'); return false; }
  }
  if (field === userEmail) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) { emailError.textContent = 'Email is required.'; userEmail.classList.add('input-error'); return false; }
    if (!emailRe.test(val)) { emailError.textContent = 'Enter a valid email address.'; userEmail.classList.add('input-error'); return false; }
  }
  if (field === userPhone) {
    const phoneRe = /^[0-9]{10,15}$/;
    if (!val) { phoneError.textContent = 'Phone number is required.'; userPhone.classList.add('input-error'); return false; }
    if (!phoneRe.test(val.replace(/[\s\-\+]/g, ''))) { phoneError.textContent = 'Enter a valid phone number (10–15 digits).'; userPhone.classList.add('input-error'); return false; }
  }
  return true;
}

// Blur-based validation
[userName, userEmail, userPhone].forEach(field => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    field.classList.remove('input-error');
    if (field === userName) nameError.textContent = '';
    if (field === userEmail) emailError.textContent = '';
    if (field === userPhone) phoneError.textContent = '';
  });
});

function validateAll() {
  const n = validateField(userName);
  const e = validateField(userEmail);
  const p = validateField(userPhone);
  return n && e && p;
}

// ─── Checkout ────────────────────────────────────────────────────────────────
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty! Add some gadgets first.');
    return;
  }

  if (!validateAll()) return;

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Close cart modal before Paystack
  closeCart();

  // Paystack popup
  const handler = PaystackPop.setup({
    key: 'pk_test_a7aa0010be31112c71c64f5431f2de454d014b20',
    email: userEmail.value.trim(),
    amount: totalAmount * 100,
    currency: STORE_CURRENCY,
    ref: 'EMS_' + new Date().getTime(),
    metadata: {
      custom_fields: [
        { display_name: 'Customer Name', variable_name: 'customer_name', value: userName.value.trim() },
        { display_name: 'Phone', variable_name: 'phone', value: userPhone.value.trim() }
      ]
    },
    callback: function (response) {
      // Payment successful
      showSummaryModal();
    },
    onClose: function () {
      // User closed Paystack without paying – reopen cart
      openCart();
    }
  });

  handler.openIframe();
});

// ─── Summary Modal ───────────────────────────────────────────────────────────
function showSummaryModal() {
  summaryName.textContent = userName.value.trim();
  summaryTableBody.innerHTML = '';

  cart.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
    `;
    summaryTableBody.appendChild(row);
  });

  summaryOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

summaryOkBtn.addEventListener('click', () => {
  // Clear everything and reload for a clean state
  cart = [];
  summaryOverlay.classList.remove('active');
  document.body.style.overflow = '';
  // Clear form
  userName.value = '';
  userEmail.value = '';
  userPhone.value = '';
  clearErrors();
  updateCartCount();
  renderProducts();
  window.location.reload();
});

// ─── Hamburger Nav ───────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

// Close menu on nav link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ─── Init ────────────────────────────────────────────────────────────────────
renderProducts();
updateCartCount();
