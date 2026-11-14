# TechNest Frontend (fixed demo)

React + Vite storefront with working client-side demo flows:
- Product cards: Add to Cart, Buy Now, View Details
- Cart quantity controls, remove item, persistent cart in localStorage
- Live search suggestions and search results page
- Dedicated category pages from the three hero offer cards
- Sign in / sign up demo form
- Seller registration form (demo only; sensitive details are not persisted)
- Checkout form with a demo order confirmation

## Run locally

1. Extract this ZIP.
2. Open the `Frontend` folder in VS Code.
3. Run `npm install`
4. Run `npm run dev`
5. Open the local URL printed in the terminal.

## Important demo limitations

Authentication, seller registration, payment and order placement are frontend-only demonstrations. They do not send data to a server, create real accounts, or charge payments. Do not enter real PAN or bank details until a secure backend has been implemented. The next step is connecting these flows to Spring Boot + MySQL with server-side validation and secure authentication.
