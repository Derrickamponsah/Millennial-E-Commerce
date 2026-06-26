# EMS — The E-Millenial Store

> A responsive e-commerce landing page built with vanilla HTML, CSS, and JavaScript, featuring a dynamic shopping cart and Paystack payment integration.

## 🚀 Live Demo

<!-- Add your live link here, e.g. GitHub Pages, Netlify, Vercel -->
[View Live Site](#)

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Paystack Integration](#paystack-integration)
- [Customisation](#customisation)
- [Technologies Used](#technologies-used)

---

## About

EMS (E-Millenial Store) is a hypothetical online gadget store targeted at Millennials and Gen-Z shoppers in Africa. It was built as a frontend development project to demonstrate a complete e-commerce user flow — from browsing products to completing a payment — using only vanilla web technologies, with no frameworks or build tools required.

---

## ✨ Features

- **Responsive layout** — 3-column grid on desktop, 2-column on tablet, single column on mobile
- **Dynamic product cards** — hover to reveal price; toggle between Add to Cart and Remove from Cart
- **Live cart counter** — header cart button updates in real time as items are added or removed
- **Shopping cart modal** with:
  - Full items table showing name, price, and quantity
  - Increment and decrement quantity controls per item
  - Remove individual items directly from the cart
  - Running total that updates instantly
- **User details form** — collects name, email, and phone number with real-time field validation
- **Paystack checkout** — fires only after form validation passes; fully functional in Test Mode
- **Order summary modal** — displayed after a successful Paystack payment, showing the customer's name and a list of items purchased
- **Auto-reset** — cart and form are cleared after a successful checkout
- **Smooth animations** — orbiting gadget graphic in the hero, hover zoom on product images, and a pulse effect on the cart count badge

---

## 📁 Project Structure

```
ems-store/
├── index.html          # Full single-page layout (Intro, About, Shop, Footer, Modals)
├── css/
│   └── style.css       # All styles — tokens, layout, components, responsive breakpoints
├── js/
│   ├── products.js     # Products data array (id, name, price, image, alt)
│   └── app.js          # All application logic — cart, modals, validation, Paystack
└── README.md
```

---

## 🛠 Getting Started

No build tools or package installation required.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ems-store.git
cd ems-store
```

### 2. Add your Paystack public key

Open `js/app.js` and replace the placeholder with your actual Paystack test key:

```js
key: 'pk_test_YOUR_ACTUAL_KEY_HERE',
```

Get your key from: [dashboard.paystack.com → Settings → API Keys & Webhooks](https://dashboard.paystack.com/#/settings/developers)

### 3. Run locally

Serve the project with a simple local server for best results:

**Using Python:**
```bash
python3 -m http.server 8080
```

**Using Node.js:**
```bash
npx serve .
```

Then open your browser and visit `http://localhost:8080`

> You can also just open `index.html` directly in your browser — most features will work, though a local server is recommended to avoid browser security restrictions on file:// URLs.

---

## 💳 Paystack Integration

The checkout flow uses the [Paystack Popup JS](https://paystack.com/docs/libraries-and-plugins/libraries/#javascript) library loaded via CDN.

**How it works:**
1. User fills in the cart and enters their name, email, and phone number
2. Clicking **Checkout** validates the form first
3. On success, the Paystack modal opens
4. After a successful payment, the order summary modal is shown
5. Clicking **Ok** clears the cart and reloads the page

**Test cards for Paystack (Test Mode):**

| Card Number          | Result   |
|----------------------|----------|
| 4084 0841 1052 0409  | ✅ Success |
| 4084 0840 1725 0409  | ❌ Declined |

Use any future expiry date and any 3-digit CVV.

---

## 🧰 Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and semantic markup |
| CSS3 | Styling, animations, CSS custom properties, responsive grid |
| Vanilla JavaScript (ES6+) | Cart logic, DOM manipulation, form validation |
| [Paystack Popup JS](https://paystack.com/docs) | Payment processing |
| [Google Fonts](https://fonts.google.com) | Montserrat & Inter typefaces |
| [Unsplash](https://unsplash.com) | Product images |

---


*Built with ❤️ — Frontend Ninja*
