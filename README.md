# HostelRig - PC parts for students

CS4032 Web Programming - Assignment 02 (React business website)

| | |
|---|---|
| Student | Saim Zaib |
| Roll no. | 24I-2023 |
| Section | C |
| GitHub | https://github.com/saimcyber/Gaming-PC-Startup |
| Live site | https://saimcyber.github.io/Gaming-PC-Startup/ |

HostelRig is a made-up budget PC parts shop in G-9 Markaz, Islamabad. Students can browse and search parts,
check stock and delivery fees, build a cart (with a CPU / motherboard socket check), fill in a checkout form
and place a **simulated** order for delivery or free pickup.

The site is built with React + Vite + react-router-dom and plain CSS (no UI kits). It fixes three problems
I found on real Pakistani PC parts websites (see [DECISIONS.md](DECISIONS.md)).

## Business profile

- **Business:** HostelRig, a small (fictional) PC parts shop in G-9 Markaz, Islamabad.
- **Offering:** 17 parts: CPUs, motherboards, graphics cards (new and shop-tested used), RAM, SSD, PSU, case, keyboard and mouse.
- **Primary audience:** university students in Islamabad / Rawalpindi building or upgrading a budget gaming / study PC.
- **Operating area:** delivery to selected Islamabad sectors and parts of Rawalpindi, or free pickup from the shop.
- **Main customer task:** find compatible parts, build a cart, and place an order for delivery or pickup.
- **Business goal:** a completed order with no surprise charges and no incompatible parts.

## Setup and commands

Needs Node.js 18 or newer (tested with Node 20 and 24).

```bash
npm install        # install dependencies
npm run dev        # start the dev server -> http://localhost:5173/Gaming-PC-Startup/
npm run build      # production build into dist/ (also writes the route pages for GitHub Pages)
npm run preview    # serve the built dist/ folder
npm test           # run the business rule test (node --test)
```

The site is deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`
(install -> test -> build -> deploy).

## Routes

| Route | Page |
|---|---|
| `/` | Home: categories, how it works, delivery areas and fees |
| `/products` | Parts list with search, category filter, in-stock filter and sort (all kept in the URL, e.g. `/products?q=ryzen&cat=CPU&sort=price-asc`) |
| `/products/:id` | Part details: price, stock, warranty, socket, quantity + add to cart, delivery fees, specs |
| `/cart` | Cart: change quantity, remove, problems that block checkout, summary with delivery info |
| `/checkout` | Checkout form (name, mobile, delivery or pickup, area, address or pickup day, note) and order summary |
| `/order/confirmed` | Confirmation with order number and final summary (simulated) |
| `*` | Not found page with links back |

## Features

- Async mock loader with loading spinner, error message and **Try again** button.
- Search across name, brand, category, summary, socket and specs; category filter; in-stock filter; 4 sort options.
- Cart shared across all pages (header count, cards, details, cart, checkout), saved in localStorage.
- Checkout form with field-by-field validation, error summary, focus on the first wrong field, and valid input kept.
- Three business rules (below), all enforced before an order can be placed.
- Fixes for the three reference-site problems (no-results guidance, sold-out hierarchy, early delivery fees).
- Saved cart is checked against the latest stock: removed / sold-out / too-many parts are explained with fix buttons.
- Works at 390 px and 1280 px, keyboard accessible (skip link, visible focus, labels, real buttons and links).

## Business rules

| Rule | Condition | Where the user sees it | What happens | Boundary case |
|---|---|---|---|---|
| 1. Quantity (availability) | 1 to `MAX_PER_ORDER` (3) of a part per order, and never more than stock | "Max 3 per order · N in stock" beside the quantity box | Add is blocked with a specific message; + button stops at the limit; cart and checkout blocked if over | 3 in cart is allowed, 4 is blocked. Stock 2: 2 ok, 3 blocked |
| 2. Socket (compatibility) | A CPU and motherboard in the cart must have the same socket (AM5 / LGA1700) | Warning on the details page before adding, problem list in cart and checkout | Can be added, but checkout is blocked until one part is removed | Only a CPU (no board) is fine. Ryzen 5 7600 (AM5) + Gigabyte B760M (LGA1700) is blocked |
| 3. Delivery (pricing / fulfilment) | Fee by area (Rs 200 / 350 / 450); free when subtotal >= `FREE_DELIVERY_FROM` (Rs 60,000); pickup free; "outside" area not served | Home page table, product page delivery box, cart summary, checkout summary | Fee added to the total; "outside" area shows an error and blocks the order | Rs 59,999 pays the fee, Rs 60,000 gets free delivery |

Rules are plain JavaScript in `src/rules/` (no React), so they can be tested with Node.

## Test

```bash
npm test
```

`tests/quantityRule.test.js` uses `node:test` and `node:assert/strict` to test `checkQuantity()` from
`src/rules/quantityRule.js` (the same function the app uses). Cases: a valid quantity (2), exactly the limit (3),
over the limit (4), stock lower than the limit, out of stock, and invalid input (0, negative, decimal).
Result: 8 tests, 8 passed.

## Reproducing the edge cases

Open **Demo controls (testing only)** at the bottom of any page, tick an option and press **Save and reload parts**.
The settings are saved in localStorage under `hostelrig-demo` (you can also set it by hand in DevTools, e.g.
`localStorage.setItem('hostelrig-demo', '{"stockDrop":true}')`). **Reset to normal** turns everything off.

| Case | How to reproduce | Expected result |
|---|---|---|
| Loading failure | Tick "Fail the next load once", save | Red error box with "Try again". Pressing it loads the parts (the option turns itself off after one failure) |
| Empty catalogue | Tick "Empty catalogue", save, open Parts | "No parts listed right now" (different from "no parts match your search") with "Check again" |
| Changed availability / restored cart | Add RTX 4060 (1), Ryzen 5 7600 (2) and ASRock A620M (1) to the cart, then tick "Stock drop" and save | Banner on other pages; cart lists 3 changes with "Fix all" and per-line "Remove sold-out part" / "Lower to 1" / "Remove" buttons; checkout blocked until fixed |
| No search matches | Search `rtx 4060 founders` | Box names "founders", offers "Search for "rtx 4060" instead", remove-filter buttons with counts, closest matches |
| Unknown category in URL | Open `/products?cat=Laptops` | Warning that the category doesn't exist, all parts shown, "Remove it" button |
| Invalid product ID | Open `/products/gpu-rtx-3060` | "Part not found" with a search for "gpu rtx 3060" and "Browse all parts" |
| Invalid URL | Open `/something` | Not found page with links to Parts and Home |
| Broken saved cart | In DevTools set `hostelrig-cart` to `{not json` and refresh | Cart is treated as empty, no crash |
| Missing content | Open Thermaltake Smart 650W (no photo, no description, no specs) | "Photo coming soon" placeholder, "No description added", "Spec sheet not added yet", warranty "Not listed" |
| Long content | Open the Cooler Master Q300L case (very long name) | Name wraps inside the card and page, no sideways scrolling |
| Invalid form input | Press "Place order" with an empty form, or type phone `12345` | Error summary, specific message under each field, focus moves to the first wrong field, valid fields keep their values |
| Quantity limit | On a part with 1 in the cart, try to add 3 more | "You can order at most 3 of this part (the limit is 3 per order). You can add 2 more." |

## Simulated operations

- Products come from `src/data/products.js` through a fake async loader (`src/api/loadProducts.js`, 700 ms delay).
- Placing an order (`src/api/placeOrder.js`) only waits and returns an order number like `HR-123456`. No payment is
  taken and nothing is sent anywhere. This is labelled on the checkout and confirmation pages.
- The saved order in localStorage keeps only the parts, totals and delivery method. Name, phone and address are
  **not** stored.

## Known limitations

- Placing an order does not reduce the stock numbers (there is no real backend).
- Socket conflicts are not fixed automatically by "Fix all", because the user has to decide which part to keep.
- The demo controls are visible on the live site too (they are clearly labelled as testing only).
- On GitHub Pages, an invalid URL (e.g. `/products/nope`) is served through `404.html`, so the browser console shows
  one "404" network line even though the app shows its own "Part not found" page. Valid routes have their own page
  files and load with status 200.
- Product photos are simple drawings made for this project, not real product photos.
- Cart and last order are saved per browser only.

## Concept map

| Concept | File | Component / function |
|---|---|---|
| Components and modules | `src/components/`, `src/pages/` | e.g. `ProductCard`, `CartLine`, `NoResults`, `DeliveryInfo`, `CheckoutPage` |
| Props | `src/pages/ProductsPage.jsx` | passes `product`, `qtyInCart`, `listSearch` to `ProductCard` |
| Callback props | `src/App.jsx` -> `src/components/ProductCard.jsx` | `addToCart` passed down as `onAdd`; `removeFromCart` as `onRemove`; `fixCart` as `onFixAll` |
| Events + preventDefault | `src/pages/CheckoutPage.jsx`, `src/components/FilterBar.jsx` | `handleSubmit`, form `onSubmit` |
| State + controlled inputs | `src/pages/CheckoutPage.jsx` | `form` state, `handleChange`, `handleBlur` |
| Functional updates | `src/App.jsx` | `addToCart`, `updateQuantity`, `removeFromCart`, `fixCart` (`setCart((prev) => ...)`) |
| Objects without mutation | `src/pages/CheckoutPage.jsx` | `setForm((prev) => ({ ...prev, [name]: value }))` |
| Arrays without mutation | `src/App.jsx`, `src/utils/cartHelpers.js` | `map` / `filter` / spread in `addToCart`, `applyCartFixes` |
| Lists and keys | `src/pages/ProductsPage.jsx`, `src/pages/CartPage.jsx` | `results.map(...)` with `key={product.id}` |
| Conditional rendering | `src/components/LoadStatus.jsx`, `src/components/ProductCard.jsx`, `src/components/AddToCartPanel.jsx` | loading / error, sold out, validation messages |
| Shared state | `src/App.jsx` | `products`, `status`, `cart`, `lastOrder` passed to every page |
| Derived values | `src/utils/cartHelpers.js`, `src/pages/CheckoutPage.jsx` | `getCartSummary`, `getCartProblems`, `planCartFixes`, `total` |
| Effects, dependencies, cleanup | `src/App.jsx`, `src/hooks/usePageTitle.js`, `src/components/ScrollToTop.jsx` | load effect with `ignore` cleanup and `[loadCount]`; save cart effect `[cart]`; title restored on cleanup |
| Async code + errors | `src/api/loadProducts.js`, `src/App.jsx`, `src/pages/CheckoutPage.jsx` | Promise in `loadProducts`; `async fetchProducts` with try/catch; `await placeOrder(...)` |
| Browser storage | `src/utils/storage.js`, `src/api/demoSettings.js` | `readJSON`, `writeJSON`, `readSavedCart`, `readDemoSettings` |
| Routing | `src/main.jsx`, `src/App.jsx`, `src/pages/ProductDetailsPage.jsx`, `src/pages/ProductsPage.jsx` | `BrowserRouter`, `Routes`, `useParams`, `useSearchParams`, `useNavigate`, `Link` / `NavLink` |
| Business rules | `src/rules/quantityRule.js`, `compatibilityRule.js`, `deliveryRule.js` | `checkQuantity`, `findSocketConflicts`, `getDeliveryCharge` |
| Rule test | `tests/quantityRule.test.js` | `node:test` + `node:assert/strict` on `checkQuantity` |
| Validation | `src/utils/validateCheckout.js` | `validateCheckout`, `getPickupDays` |

## Folder structure

```
src/
  api/          fake loader, fake placeOrder, demo settings
  assets/       product drawings (SVG) made for this project
  components/   reusable pieces (cards, filter bar, cart line, banners...)
  data/         products.js, deliveryAreas.js
  hooks/        usePageTitle
  pages/        one file per route
  rules/        the three business rules (plain JS)
  styles/       global, layout, products, cart CSS
  utils/        search/filter/sort, cart helpers, storage, form validation, formatting
tests/          node:test file for the quantity rule
scripts/        build helper that writes the route pages for GitHub Pages
docs/screenshots/  screenshots used in DECISIONS.md
```
