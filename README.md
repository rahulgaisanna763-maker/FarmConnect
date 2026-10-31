# FarmConnect — Farmer Marketplace Prototype

A student hackathon prototype for HACK-P309. FarmConnect helps farmers publish produce listings and lets buyers discover local stock, create order requests, and track order status.

## Features
- Buyer, farmer and demo-admin account flows.
- Marketplace with product search, category, location and price filters.
- Product listings include category, unit, stock, price, availability date, location and pickup/delivery note.
- Cart with quantity validation and stock-aware order submission.
- Order lifecycle: `requested → accepted → ready → completed` or `cancelled`.
- Farmer dashboard: listings, stock, incoming orders and completed sales.
- Buyer dashboard: order history and totals.
- Admin demo view: hide/restore listings and inspect orders.
- 5 sample farmers and 15 sample products.
- Firebase Authentication + Cloud Firestore integration; localStorage demo fallback.
- No card/payment information is collected. Payment is cash-on-pickup / arranged directly.
- Delivery is not operated by this prototype; “delivery” is only a preference to discuss with the farmer.

## Run locally (demo mode)
1. Unzip the project.
2. Open the `FarmConnect` folder in VS Code.
3. Start a local static server (recommended): install the VS Code **Live Server** extension, right-click `index.html`, choose **Open with Live Server**.
4. The site starts in demo mode if `config.js` has an empty `apiKey`. Demo users are stored in the current browser session; products and orders use localStorage.
5. Use Sign in to create a demo account. Select Buyer, Farmer, or Admin. Create a farmer account to add listings; use the seeded farmer listings to browse immediately.

## Connect Firebase
1. Create a Firebase project at https://console.firebase.google.com.
2. Add a Web App and copy its Firebase configuration.
3. In Firebase Console, enable **Authentication → Sign-in method → Email/Password**.
4. Create a **Cloud Firestore** database.
5. Copy the web app values into `config.js`.
6. Publish the rules from `firebase.rules` in Firestore → Rules.
7. Serve the site from localhost or Firebase Hosting. Firebase Auth does not work reliably from a `file://` URL.
8. Reload. The app will use Firebase Auth and Firestore automatically.

### Firebase collections
- `users/{uid}`: `{ name, email, role, location, farm }`
- `products/{productId}`: `{ name, category, emoji, price, unit, quantity, location, farmerId, availableDate, fulfilment, description, active }`
- `orders/{orderId}`: `{ buyerId, buyerName, items[], total, fulfilment, note, status, createdAt }`

## Demo accounts / credentials
There are no hard-coded production credentials. In local demo mode, use the Sign in form to create any demo account:
- Buyer: choose `Buyer`.
- Farmer: choose `Farmer` and enter a location.
- Admin: choose `Admin` (demo moderation only).

For Firebase mode, register accounts with email/password. **Important:** role selection is intentionally suitable only for a student demo. In a real deployment, users must not be able to grant themselves admin/farmer privileges; use trusted server-side role assignment and stricter Firestore rules.

## Architecture
```text
Browser UI (HTML + CSS + vanilla JS)
       |
       +-- Firebase Authentication (email/password)
       |
       +-- Cloud Firestore
              |-- users
              |-- products
              +-- orders

Fallback for offline/demo judging:
Browser sessionStorage + localStorage
```

## Tests
Run basic stock/cancellation checks with Node:
```bash
node tests/stock.test.js
```
The test file checks that a buyer cannot order more than available stock and that cancelling a valid order restores the reserved quantity. The live UI also validates stock before submission. Firestore order submission uses a batch so stock decrements and order creation commit together.

## Known limitations / next steps
- Product photos are represented by emoji in this prototype; add Firebase Storage upload for real images.
- No live chat, maps, delivery dispatch, real payment processing or price trend data.
- Search is client-side; production scale should use a search service or indexed query strategy.
- Production order workflows should use trusted Cloud Functions / Firestore transactions and server-side validation for all stock and status transitions.
- Admin authorization must be managed securely; never trust a role chosen in a public sign-up form.
- Firestore rules should be tightened for per-farmer order item ownership and permitted status transitions before public launch.

## Hackathon demo flow
1. Open Marketplace and search/filter produce.
2. Create/sign in as Buyer, add produce to cart, submit an order request.
3. Sign out and sign in as Farmer, view incoming order, change status to accepted → ready → completed.
4. Create a farmer listing and show it in the marketplace.
5. Open Admin demo role and hide/restore a listing.
6. Explain that checkout is a request workflow, not a payment gateway or delivery service.
