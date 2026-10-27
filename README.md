# Ibadah Jewellers

A detailed, single-page jewellery storefront with custom ivory, deep navy and muted gold styling, built with Bootstrap 5.3.3 and vanilla JavaScript.

## Open the shop

Open `index.html` directly, or serve the project directory with any static host. There is no build step, package installation or framework runtime.

Keep `styles.css`, `app.js` and `assets/` beside `index.html`. Bootstrap and Google Fonts load from their CDNs; all product and editorial photography is bundled locally.

## Shopping experience

- Responsive desktop and mobile layouts, an editorial hero carousel and four collection galleries.
- Eight sample products with category, search, finish, budget and price sorting controls.
- Product photography, a closer detail view, ring-size selection, a size guide and quantity controls.
- A saved wishlist and shopping bag that persist in the current browser.
- Separate bag items for different ring sizes, with validated quantities and recovery from malformed browser storage.
- A sample `IBADAH10` code for 10% off the merchandise subtotal.
- Optional gift wrapping at BDT 100 and a non-persisted gift message.
- Delivery previews: BDT 80 within Dhaka, BDT 120 outside Dhaka, or free collection at Mirpur 1. Delivery becomes complimentary at BDT 2,500 after discounts; gift-wrap fees do not contribute to that threshold.
- Checkout with delivery or collection, client-side validation and an on-screen order preview.
- Three original styling, care and gifting journal articles, plus an FAQ and contact section.
- Keyboard-accessible controls and reduced-motion support.

## Important scope

This is a storefront preview with a sample catalogue. Product prices, materials, sizes, discount and fulfilment options are illustrative. No payment gateway, account system, live inventory or order-submission backend is connected. The checkout does not charge money or place a real order.

Only bag selections and wishlist product IDs are saved in browser storage. Customer details and gift messages are not persisted or sent to a server. To make real sales, connect a secure backend, live product records, confirmed policies and a payment provider.

## Content and files

- `index.html`: page sections, drawers and modal shells.
- `styles.css`: responsive visual design and custom Bootstrap overrides.
- `app.js`: the sample catalogue, state, filters, variants, wishlist, bag and checkout preview.
- `assets/images/`: local jewellery and editorial photography.
- `assets/photo-sources.json`: photography sources and subject descriptions.

Update the `products` array at the top of `app.js` to edit the catalogue. Prices use Bangladeshi taka (BDT).

Brand: **Ibadah Jewellers**  
Contact: **info@ibadahejewellery.com**  
Address: **Mirpur 1**

## Validation

JavaScript syntax and catalogue/cart calculations were checked. Browser verification covered finish filters, saved favourites, ring variants, the size guide, quantities, gift wrapping, discounts, pickup checkout and a 375-pixel mobile layout.

Photography: Unsplash; individual sources are listed in `assets/photo-sources.json`. Bootstrap is distributed under the MIT license. Font families: Cormorant Garamond and Manrope, served by Google Fonts.
