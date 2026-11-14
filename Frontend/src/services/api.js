// Base URL of the Spring Boot API. "/api" (default) goes through the Vite dev proxy.
// A trailing slash is removed and "/api" is added when missing, so values like
// "https://xyz-8484.devtunnels.ms/" or "http://localhost:8484" also work.
function resolveBaseUrl(raw) {
  const value = String(raw || "/api").trim().replace(/\/+$/, "");
  return /\/api$/.test(value) ? value : `${value}/api`;
}
const API_BASE_URL = resolveBaseUrl(import.meta.env.VITE_API_BASE_URL);

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    });
  } catch {
    const error = new Error(
      "Could not connect to the backend. Please check that Spring Boot (port 8484) and MySQL are running."
    );
    error.status = 0;
    throw error;
  }
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    let message = text;
    try {
      const parsed = JSON.parse(text);
      message =
        parsed.message ||
        parsed.error ||
        (parsed && typeof parsed === "object" ? Object.values(parsed).join(", ") : text);
    } catch {
      /* body was not JSON */
    }
    const error = new Error(message || `API request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  if (response.status === 204) return null;
  const type = response.headers.get("content-type") || "";
  return type.includes("application/json") ? response.json() : response.text();
}
const json = (method, body) => ({ method, body: JSON.stringify(body) });
const del = { method: "DELETE" };

// One method per backend endpoint (all modules: auth, user, category, product, cart, cart item, order, order item, payment).
export const api = {
  // auth + users
  login: (credentials) => request("/auth/login", json("POST", credentials)),
  register: (user) => request("/users", json("POST", user)),
  users: () => request("/users"),
  user: (id) => request(`/users/${id}`),
  updateUser: (id, user) => request(`/users/${id}`, json("PUT", user)),
  deleteUser: (id) => request(`/users/${id}`, del),

  // categories
  categories: () => request("/categories"),
  category: (id) => request(`/categories/${id}`),
  createCategory: (category) => request("/categories", json("POST", category)),
  updateCategory: (id, category) => request(`/categories/${id}`, json("PUT", category)),
  deleteCategory: (id) => request(`/categories/${id}`, del),

  // products
  products: () => request("/products"),
  product: (id) => request(`/products/${id}`),
  createProduct: (product) => request("/products", json("POST", product)),
  updateProduct: (id, product) => request(`/products/${id}`, json("PUT", product)),
  deleteProduct: (id) => request(`/products/${id}`, del),

  // carts
  carts: () => request("/carts"),
  cart: (id) => request(`/carts/${id}`),
  cartByUser: (userId) => request(`/carts/user/${userId}`),
  createCart: (cart) => request("/carts", json("POST", cart)),
  updateCart: (id, cart) => request(`/carts/${id}`, json("PUT", cart)),
  clearCart: (id) => request(`/carts/${id}/items`, del),
  deleteCart: (id) => request(`/carts/${id}`, del),

  // cart items
  cartItems: () => request("/cart-items"),
  cartItem: (id) => request(`/cart-items/${id}`),
  cartItemsByCart: (cartId) => request(`/cart-items/cart/${cartId}`),
  addCartItem: (item) => request("/cart-items", json("POST", item)),
  updateCartItem: (id, item) => request(`/cart-items/${id}`, json("PUT", item)),
  deleteCartItem: (id) => request(`/cart-items/${id}`, del),

  // orders
  orders: () => request("/orders"),
  order: (id) => request(`/orders/${id}`),
  ordersByUser: (userId) => request(`/orders/user/${userId}`),
  checkout: (checkout) => request("/orders/checkout", json("POST", checkout)),
  createOrder: (order) => request("/orders", json("POST", order)),
  updateOrder: (id, order) => request(`/orders/${id}`, json("PUT", order)),
  cancelOrder: (id) => request(`/orders/${id}`, json("PUT", { orderStatus: "CANCELLED" })),
  deleteOrder: (id) => request(`/orders/${id}`, del),

  // order items
  orderItems: () => request("/order-items"),
  orderItem: (id) => request(`/order-items/${id}`),
  orderItemsByOrder: (orderId) => request(`/order-items/order/${orderId}`),
  createOrderItem: (item) => request("/order-items", json("POST", item)),
  updateOrderItem: (id, item) => request(`/order-items/${id}`, json("PUT", item)),
  deleteOrderItem: (id) => request(`/order-items/${id}`, del),

  // payments
  payments: () => request("/payments"),
  payment: (id) => request(`/payments/${id}`),
  paymentByOrder: (orderId) => request(`/payments/order/${orderId}`),
  createPayment: (payment) => request("/payments", json("POST", payment)),
  updatePayment: (id, payment) => request(`/payments/${id}`, json("PUT", payment)),
  deletePayment: (id) => request(`/payments/${id}`, del),


  //SellerRegistraion
  // =========================
// SELLER REGISTRATION APIs
// =========================

// Register new seller
registerSeller: (seller) =>
  request("/sellers/register", json("POST", seller)),

// AC Installation booking
bookAcInstallation: (data) =>
  request("/ac-installation", json("POST", data)),

// Exchange request
submitExchange: (data) =>
  request("/exchange", json("POST", data)),
};

const CATEGORY_ICONS = {
  "air conditioners": "❄️",
  refrigerators: "🧊",
  televisions: "📺",
  "mobile phones": "📱",
  "air coolers": "🌀",
  fans: "🪭",
  "washing machines": "🫧",
  laptops: "💻",
  audio: "🎧",
  smartwatches: "⌚",
  wearables: "⌚",
  cameras: "📷",
};

export const formatPrice = (value) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number(value) || 0)}`;

/** Numeric database id of a product, or null for demo products (string ids). */
export const dbId = (product) => {
  const value = product?.backendId ?? (typeof product?.id === "number" ? product.id : null);
  return value !== null && value !== undefined && Number.isFinite(Number(value)) ? Number(value) : null;
};

/** Backend ProductDto -> the shape the existing UI components expect. */
export const toFrontendProduct = (p) => {
  const price = Number(p.price) || 0;
  const oldPrice = Number(p.oldPrice) || 0;
  const category = p.categoryName ?? p.category?.categoryName ?? "General";
  const discountPercent = oldPrice > price && price > 0 ? Math.round((1 - price / oldPrice) * 100) : 0;
  return {
    id: p.id,
    backendId: p.id,
    name: p.productName ?? p.name ?? "Unnamed product",
    brand: (p.brand || "TECHNEST").toUpperCase(),
    price: formatPrice(price),
    oldPrice: oldPrice > price ? formatPrice(oldPrice) : undefined,
    discount: discountPercent ? `${discountPercent}% OFF` : undefined,
    discountPercent,
    category,
    categoryId: p.categoryId,
    description: p.description ?? "",
    icon: CATEGORY_ICONS[category.toLowerCase()] ?? "🛍️",
    badge: p.stockQuantity === 0 ? "OUT OF STOCK" : undefined,
    stockQuantity: p.stockQuantity,
    imagePath: p.imagePath,
  };
};

/** Splits the live catalogue into the three home-page sections. */
export function splitCatalogue(list) {
  if (!list?.length) return null;
  const byId = [...list].sort((a, b) => a.id - b.id);
  const deals = [...list].sort((a, b) => b.discountPercent - a.discountPercent).slice(0, 5);
  return {
    deals,
    best: byId.slice(0, 5),
    fresh: [...byId].reverse().slice(0, 4),
  };
}
