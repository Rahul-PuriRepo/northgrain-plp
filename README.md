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

The JavaScript keeps product and cart state in a small `plp` module. Product cards and the cart drawer are rendered from state, while event delegation handles product and cart interactions.
