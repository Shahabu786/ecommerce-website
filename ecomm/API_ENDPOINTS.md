# ecomm API (base: http://localhost:8484)

Auth: `POST /api/auth/login {email,password}` -> `{user, cartId}` (401 on wrong credentials)
Users: `/api/users` (POST/GET/GET {id}/PUT/DELETE) — password is write-only and stored as PBKDF2 hash
Categories: `/api/categories` CRUD
Products: `/api/products` CRUD — JSON uses `categoryId` (+ read-only `categoryName`), `brand`, `oldPrice`
Carts: `/api/carts` CRUD, `GET /api/carts/user/{userId}` (created on first use), `DELETE /api/carts/{id}/items`
Cart items: `/api/cart-items` CRUD, `GET /api/cart-items/cart/{cartId}` — POST increases quantity if product already in cart
Orders: `/api/orders` CRUD, `POST /api/orders/checkout {userId, paymentMethod:"COD", shippingAddress, items:[{productId,quantity}]}`, `GET /api/orders/user/{userId}`
Order items: `/api/order-items` CRUD (also `/order-items`), `GET /api/order-items/order/{orderId}`
Payments: `/api/payments` CRUD, `GET /api/payments/order/{orderId}`

Errors are returned as JSON with a `message` field (e.g. 409 "Not enough stock for ...").
Properties: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` env vars override the datasource; `app.seed-demo-data=false` disables demo data.
