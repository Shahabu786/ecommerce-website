# TechNest Frontend + Spring Boot Integration

## Run
1. Start MySQL and make sure the database in `DB_URL` exists (default in `application.properties`: `jdbc:mysql://localhost:8080/ecomm_db` — change it with the `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` environment variables if your MySQL runs on e.g. 3306).
2. Backend: from `ecomm/`, run `./mvnw spring-boot:run` (Windows: `mvnw.cmd spring-boot:run`). API: `http://localhost:8484`.
   On the first start an EMPTY database is filled with demo categories and products (`DataSeeder`). Turn this off with `app.seed-demo-data=false`.
3. Frontend: from `Frontend/`, run `npm install` then `npm run dev` (http://localhost:5173).
4. Copy `.env.example` to `.env` only if you want to change `VITE_API_BASE_URL`.

## What is connected (frontend -> backend module)
| Frontend | Backend |
|---|---|
| Home sections, Products, Category page, Product details, search | `GET /api/products` (+ `categoryName`, `brand`, `oldPrice`, stock) |
| Sign up | `POST /api/users` (password hashed, cart created, duplicate email -> 409) |
| Sign in / Sign out / navbar | `POST /api/auth/login` |
| Add / change / remove / clear cart (logged in) | `/api/carts/user/{id}`, `/api/cart-items`, `DELETE /api/carts/{id}/items` |
| Checkout | `POST /api/orders/checkout` (Order + OrderItems + Payment, price/total from DB, stock reduced, cart emptied) |
| My Orders page (`/orders`), cancel order | `GET /api/orders/user/{id}`, `PUT /api/orders/{id}` |
| Payment status shown on order | `Payment` created by checkout (`COD`, `PENDING`); also `/api/payments` CRUD |
| Order items | included in every order; `/api/order-items` CRUD (old `/order-items` path still works) |
| Categories | `/api/categories` CRUD (seeded) |

`src/services/api.js` has one helper for every endpoint above.

## Guests vs logged-in users
Guests keep the cart in `localStorage`. After login the guest cart is merged into the server cart and every change is mirrored to the backend. Demo products (string ids from `data/products.js`) are only used when the backend is offline/empty; they cannot be ordered.

## Still NOT done (important)
- There is no token/session security yet: login returns the user, but the API endpoints themselves are open (e.g. `GET /api/users`, `/api/orders` list everything). Add Spring Security + JWT before going live.
- Seller registration is connected (POST /api/sellers/register). PAN/bank data is stored as plain text, so encrypt it and add admin approval before going live.
- No online payment gateway: checkout supports COD only.


## Troubleshooting (what was fixed / what to check)
- **Signup / login / cart / order / seller form do nothing, products still show:** the browser was blocking every POST/PUT because CORS only allowed a header called `api`. Fixed in `WebConfig.java` (all headers allowed). Restart the backend after pulling this change.
- **`VITE_API_BASE_URL`:** default is `/api` (Vite proxies it to `http://localhost:8484`). Restart `npm run dev` after editing `.env`. A URL without `/api` or with a trailing `/` is corrected automatically.
- **Backend does not start / "Communications link failure":** `application.properties` uses MySQL on port **8080**. If your MySQL is on the default 3306, start the backend with `DB_URL=jdbc:mysql://localhost:3306/ecomm_db?createDatabaseIfNotExist=true`, `DB_USERNAME`, `DB_PASSWORD` (the `ecomm_db` database is created automatically).
- **Yellow "Could not connect to the backend" bar on Home / demo products:** the frontend cannot reach `http://localhost:8484`. Demo products cannot be ordered.
- Real server errors are now printed in the backend console (previously every error became a silent "Something went wrong").
