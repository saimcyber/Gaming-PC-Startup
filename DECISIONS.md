# Frontend decisions

One decision for each problem I found on the reference websites (PC parts shops in Pakistan).
Screenshots of my version are in `docs/screenshots/`. Screenshots of the reference sites are in the PDF report.

---

## 1. Empty search results give a way forward (interaction / state)

| | |
|---|---|
| **Problem** | On rbtechngames.com, searching "rtx 5090" shows 2 cards, but "rtx 5090 founders" shows an empty page with no suggestion. The user has no idea that one extra word caused it, and has to guess what to delete. |
| **Decision** | When search + filters give 0 parts, show a no-results box that: (1) names the words that are not in any part ("founders"), (2) offers a button to search without them ("Search for "rtx 4060" instead (1 part)"), (3) has a separate "Remove ..." button for every active filter, each showing how many parts you would get without it, and (4) shows the closest matches (parts that match some of the words). All of it works through the URL search params, so Back/Forward and refresh keep the same state. |
| **Alternative** | Automatically loosen the search (show "any word" matches instead of "all words") and show those results silently. |
| **Reason** | Students search with very specific model names. Telling them exactly which word or filter is the problem keeps them in control, and they can still see real in-stock parts instead of leaving the site. Silent loosening would show parts they didn't ask for without explaining why. |
| **Tradeoff** | More code and more on screen. The counts on each button mean the search/filter runs again once per active filter (fine for 17 parts, but would need caching for a big catalogue). |
| **Code location** | `src/components/NoResults.jsx` (NoResults), `src/utils/productFilters.js` (getResults, findClosestMatches, findUnknownWords), `src/pages/ProductsPage.jsx` (removeFilter, searchInstead, focusCount) |
| **Evidence** | `docs/screenshots/p1-no-results.png`. Steps: open Parts, type `rtx 4060 founders` -> box says "founders" isn't sold, click "Search for "rtx 4060" instead" -> 1 part shown and focus moves to "Showing 1 of 17 parts". Also try `/products?q=i5+14400f&stock=in` -> "Remove "In stock only" (1 part)". |

---

## 2. Sold-out parts look different from parts you can buy (information hierarchy)

| | |
|---|---|
| **Problem** | On junaidtech.pk, a sold-out product shows an "Out Of Stock" button with the same yellow style and position as "Add To Cart". It looks clickable, and clicking it does nothing, with no message. |
| **Decision** | A sold-out card has **no button at all**. It gets a dashed border, a greyed-out picture, an "Out of stock" badge and the plain text "Can't be ordered right now". In the default "Featured" sort, sold-out parts move to the end of the list. The "In stock only" filter hides them. The details page replaces the quantity form with an out-of-stock message and a link to in-stock parts in the same category. |
| **Alternative** | Keep a disabled grey "Out of stock" button in the same place as the Add to cart button. |
| **Reason** | A button shape says "you can press this", even if it is grey. Students comparing prices should see straight away which parts they can actually get, so the first cards in the list are buyable ones and sold-out ones clearly look different. Text (not only colour) explains the state. |
| **Tradeoff** | Sold-out cards have a different layout from normal cards. Moving sold-out parts to the end changes the "Featured" order, so a popular part that just sold out is harder to spot. There is no "notify me" option. |
| **Code location** | `src/components/ProductCard.jsx` (soldOut / limitText), `src/components/StockBadge.jsx`, `src/utils/productFilters.js` (sortProducts), `src/components/AddToCartPanel.jsx` (out-of-stock branch), `src/styles/products.css` (`.sold-out`, `.sold-out-note`) |
| **Evidence** | `docs/screenshots/p2-sold-out-card.png`. Steps: open Parts, choose Category = CPU. The Intel Core i5-14400F (stock 0) is last, dashed, with no button. Open it -> "Out of stock" message and "See CPU parts that are in stock" link. |

---

## 3. Delivery fees shown before the cart (information hierarchy + mobile layout)

| | |
|---|---|
| **Problem** | On dadducharger.com the product page only says "Nationwide delivery". The actual shipping fee (Rs 1,500) and the free-shipping amount only appear once the product is in the cart. |
| **Decision** | Every product page has a "Delivery and pickup" box: a table of all areas and fees, the free delivery amount, the pickup point, and a line saying what the order would total with this part and how much more is needed for free delivery. The cart summary shows the fee range and "Add Rs X more for free delivery" (or that delivery is free). Checkout shows the exact fee for the chosen area. On phones (390 px) the box and the cart lines stack into one column so nothing is cut off. |
| **Alternative** | Only show a small "Delivery from Rs 200" line on the product page and keep the full table in checkout. |
| **Reason** | Students on a budget compare total cost, not just the part price. The fee depends on the area, so showing the full table early lets them decide between delivery and free pickup before they add anything. All numbers come from `deliveryAreas.js` and `FREE_DELIVERY_FROM`, so they can't go out of sync with checkout. |
| **Tradeoff** | The product page is longer and the add-to-cart panel is pushed further from the specs. The same information appears in three places (product, cart, checkout). |
| **Code location** | `src/components/DeliveryInfo.jsx` (DeliveryInfo), `src/rules/deliveryRule.js` (getDeliveryCharge, amountToFreeDelivery, FREE_DELIVERY_FROM), `src/pages/CartPage.jsx`, `src/pages/CheckoutPage.jsx`, `src/styles/cart.css` (`@media (max-width: 560px)`) |
| **Evidence** | `docs/screenshots/p3-details-delivery.png`, `docs/screenshots/p3-cart-free-delivery.png`, `docs/screenshots/mobile-cart-390.png`. Steps: with only the Kingston DDR5 RAM in the cart, open the RTX 4060 page -> table of fees and "makes your order Rs 111,500. That gets free delivery". Open the cart -> "Add Rs 42,500 more for free delivery". |
