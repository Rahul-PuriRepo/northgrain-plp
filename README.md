# Northgrain PLP

A responsive product listing page (PLP) implementation built with vanilla HTML, CSS, and JavaScript.

## Features

- Responsive product grid with mobile, tablet, and desktop layouts
- Product variants with selectable options
- Add-to-cart functionality
- Cart item quantity increase/decrease
- Remove items from cart
- Cart item count
- Per-line totals and cart subtotal
- Slide-in cart drawer
- Close drawer with the close button, scrim, or Escape key
- Add-to-cart toast feedback
- Keyboard focus-visible states

## Project Structure

- `index.html` — page markup and product data/bootstrap values
- `plp.css` — responsive layout and component styling
- `plp.js` — PLP rendering, cart state, drawer behavior, and interactions

## Run Locally

Open `index.html` in a browser. No build step or package installation is required.

## Implementation Notes

The JavaScript keeps product and cart state in a small `plp` namespace. Product cards and the cart drawer are rendered from state, while event delegation handles product and cart interactions.

The cart uses the product ID and variant ID together as the cart key. This means adding the same product and variant increases its quantity, while selecting a different variant creates a separate cart line.

## Time Spent

Approximately 3 hours of focused work.

## What I'd Do Differently With More Time

I would spend some more time on visual polish and add more automated testing around the cart interactions. I would also improve focus handling inside the drawer with a proper focus trap.

## Persisting the Cart

The current cart is stored in memory, so it is cleared when the page is refreshed. If the cart needed to persist across reloads, I would store the cart data in `localStorage` and restore it when the page loads. I would also validate the restored products and variants against the current product data, since products or variants could have changed or become unavailable.

## Converting This Into a Shopify Theme App Extension

I would keep the JavaScript and CSS framework-free and use a Liquid app block for the markup and mount points. The product and collection data could be passed from Liquid to JavaScript through the existing `window.shopifyLiquidValuesPLP` data object. The existing `plp` namespace and prefixed CSS classes would help keep the extension isolated from the merchant's theme.
