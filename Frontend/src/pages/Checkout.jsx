import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useCatalogue } from "../hooks/useCatalogue";
import { getProductImage } from "../data/productImages";
import TopBar from "../Components/TopBar";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../App.css";
import { api, dbId } from "../services/api";
import Icon from "../Components/Icon";

export default function Checkout() {
  const { cartItems, cartTotal, clearCart, cartCount } = useCart();
  const { user } = useAuth();
  const { products: liveProducts } = useCatalogue();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.contact || "",
    address: user?.address || "",
    city: "",
    pincode: "",
  });

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const money = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  const getPrice = (item) =>
    Number(String(item.price).replace(/[₹,\s]/g, "")) || 0;

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user?.id) {
      setError("Please log in to place your order.");
      return;
    }
    if (cartItems.some((item) => dbId(item) === null)) {
      setError(
        "Your cart contains demo products that are not in the database. Please remove them and add products from the backend."
      );
      return;
    }
    setSubmitting(true);
    try {
      const saved = await api.checkout({
        userId: user.id,
        paymentMethod: "COD",
        shippingAddress: `${form.name}, ${form.phone}, ${form.address}, ${form.city} - ${form.pincode}`,
        items: cartItems.map((item) => ({
          productId: dbId(item),
          quantity: item.quantity,
        })),
      });
      setOrder({
        id: saved.id,
        name: form.name,
        total: saved.totalAmount,
        paymentStatus: saved.paymentStatus,
      });
      clearCart({ remote: false });
    } catch (err) {
      setError(`Order could not be saved: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (order) {
    return (
      <div className="app">
        <TopBar />
        <Navbar
          search={search}
          setSearch={setSearch}
          cartCount={cartCount}
          products={liveProducts}
        />
        <main className="form-page">
          <section className="form-card success-card">
            <div className="success-icon"><Icon name="check" /></div>
            <h1>Order placed!</h1>
            <p>
              Order reference: <strong>#{order.id}</strong>
            </p>
            <p>
              Thanks, {order.name}. Total: <strong>{money(order.total)}</strong>
            </p>
            <p>
              Payment: Cash on Delivery ({order.paymentStatus || "PENDING"}). Your order has been saved to the backend.
            </p>
            <Link className="form-submit link-button" to="/orders">
              View my orders
            </Link>
            <Link className="form-submit link-button" to="/">
              Continue shopping
            </Link>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="app">
        <TopBar />
        <Navbar
          search={search}
          setSearch={setSearch}
          cartCount={cartCount}
          products={liveProducts}
        />
        <main className="simple-page">
          <h1>Your cart is empty</h1>
          <p>Add products before checking out.</p>
          <Link to="/products" className="primary-btn link-button">
            Browse Products
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <TopBar />
      <Navbar
        search={search}
        setSearch={setSearch}
        cartCount={cartCount}
        products={liveProducts}
      />

      <main className="checkout-page-v2">
        <div className="checkout-container-v2">
          {/* BREADCRUMB & HEADER */}
          <div className="checkout-top-nav">
            <Link to="/cart" className="checkout-back-link">
              ← Back to cart
            </Link>
          </div>

          <header className="checkout-header-v2">
            <div className="checkout-header-text">
              <div className="checkout-header-title">
                <span className="checkout-bag-icon"><Icon name="bag" /></span>
                <h1>Checkout</h1>
              </div>
              <p className="checkout-header-sub">
                Complete your order and get your favorite products soon!
              </p>
            </div>

            <div className="checkout-header-graphic">
              <svg viewBox="0 0 180 110" fill="none" className="delivery-graphic-svg">
                <rect x="75" y="45" width="45" height="35" rx="4" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
                <path d="M85 45 V38 Q97.5 30 110 38 V45" stroke="#F59E0B" strokeWidth="2" fill="none" />
                <rect x="35" y="30" width="38" height="48" rx="5" fill="#3B82F6" />
                <path d="M47 30 V22 Q54 16 61 22 V30" stroke="#BFDBFE" strokeWidth="2" fill="none" />
                <path d="M135 30 C135 20 145 15 150 25 C155 35 135 55 135 55" stroke="#2563EB" strokeWidth="2" strokeDasharray="3 3" fill="none" />
                <circle cx="135" cy="25" r="7" fill="#EF4444" />
                <circle cx="135" cy="25" r="3" fill="#FFFFFF" />
              </svg>
              <div className="checkout-hero-tagline">
                Fast & Safe Delivery <Icon name="heart" />
              </div>
            </div>
          </header>

          {/* STEP INDICATOR BAR */}
          <div className="checkout-steps-bar">
            <div className="checkout-step active">
              <span className="step-num">1</span>
              <span className="step-label">Delivery Details</span>
            </div>
            <div className="step-line" />
            <div className="checkout-step">
              <span className="step-num">2</span>
              <span className="step-label">Payment Method</span>
            </div>
            <div className="step-line" />
            <div className="checkout-step">
              <span className="step-num">3</span>
              <span className="step-label">Complete Order</span>
            </div>
          </div>

          {/* TWO COLUMN CHECKOUT LAYOUT */}
          <div className="checkout-layout-v2">
            {/* LEFT COLUMN: DELIVERY DETAILS FORM */}
            <section className="checkout-form-section">
              <div className="checkout-card-header">
                <span className="card-header-icon"><Icon name="truck" /></span>
                <div>
                  <h2>Delivery details</h2>
                  <p>Please enter your shipping information</p>
                </div>
              </div>

              {!user && (
                <div className="checkout-notice-banner" role="alert">
                  <span className="info-icon">ℹ</span>
                  <span>
                    Please{" "}
                    <Link to="/login" className="login-link-inline">
                      log in
                    </Link>
                    {" "}to place your order.
                  </span>
                </div>
              )}

              {error && (
                <div className="checkout-error-banner" role="alert">
                  {error}
                </div>
              )}

              <form className="checkout-form-grid" onSubmit={submit}>
                <div className="form-field-wrapper">
                  <label>Full name *</label>
                  <div className="input-with-icon">
                    <span className="input-icon"><Icon name="user" /></span>
                    <input
                      name="name"
                      value={form.name}
                      onChange={update}
                      placeholder="Enter your full name"
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="form-field-wrapper">
                  <label>Email *</label>
                  <div className="input-with-icon">
                    <span className="input-icon"><Icon name="mail" /></span>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={update}
                      placeholder="Enter your email address"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="form-field-wrapper">
                  <label>Phone number *</label>
                  <div className="input-with-icon">
                    <span className="input-icon"><Icon name="phone" /></span>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={update}
                      placeholder="+91 Enter your mobile number"
                      required
                      pattern="[0-9+ ()-]{10,16}"
                    />
                  </div>
                </div>

                <div className="form-field-wrapper">
                  <label>Address *</label>
                  <div className="input-with-icon align-top">
                    <span className="input-icon"><Icon name="map-pin" /></span>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={update}
                      placeholder="House / Flat / Building No."
                      required
                      rows={2}
                    />
                  </div>
                </div>

                <div className="form-two-cols">
                  <div className="form-field-wrapper">
                    <label>City *</label>
                    <div className="input-with-icon">
                      <span className="input-icon"><Icon name="building" /></span>
                      <input
                        name="city"
                        value={form.city}
                        onChange={update}
                        placeholder="Enter your city"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-field-wrapper">
                    <label>Pincode *</label>
                    <div className="input-with-icon">
                      <span className="input-icon"><Icon name="map-pin" /></span>
                      <input
                        name="pincode"
                        value={form.pincode}
                        onChange={update}
                        placeholder="Enter your pincode"
                        required
                        pattern="[0-9]{6}"
                        maxLength={6}
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                </div>

                <button
                  className="checkout-primary-submit-btn"
                  type="submit"
                  disabled={submitting}
                >
                  <span>→</span> {submitting ? "Placing order…" : "Continue to Payment"}
                </button>
              </form>
            </section>

            {/* RIGHT COLUMN: ORDER SUMMARY SIDEBAR */}
            <aside className="checkout-summary-sidebar">
              <div className="summary-card-header">
                <span className="summary-header-icon"><Icon name="clipboard" /></span>
                <div>
                  <h3>Order Summary</h3>
                  <p>Your items and price details</p>
                </div>
              </div>

              <div className="summary-items-list">
                {cartItems.map((item, index) => {
                  const price = getPrice(item);
                  return (
                    <div className="summary-item-card" key={item.id || item.name}>
                      <div className="summary-item-img">
                        {getProductImage(item) ? (
                          <img src={getProductImage(item)} alt={item.name} />
                        ) : (
                          <span><Icon name={item.icon || "bag"} /></span>
                        )}
                      </div>
                      <div className="summary-item-info">
                        <h4>
                          {item.name} × {item.quantity}
                        </h4>
                        <span className="product-tag-pill">Product {index + 1}</span>
                      </div>
                      <div className="summary-item-price">
                        {money(price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="summary-totals-block">
                <div className="summary-line-row">
                  <span>Subtotal</span>
                  <strong>{money(cartTotal)}</strong>
                </div>
                <div className="summary-line-row">
                  <span>Delivery</span>
                  <strong className="delivery-badge">At checkout</strong>
                </div>

                <div className="estimated-total-box">
                  <div className="estimated-total-left">
                    <span className="tag-blue-icon"><Icon name="tag" /></span>
                    <div>
                      <strong>Estimated total</strong>
                      <small>Inclusive of listed prices</small>
                    </div>
                  </div>
                  <strong className="total-big-amount">{money(cartTotal)}</strong>
                </div>

                <button
                  type="button"
                  className="proceed-payment-btn"
                  onClick={() => {
                    const formEl = document.querySelector(".checkout-form-grid");
                    if (formEl) formEl.requestSubmit();
                  }}
                >
                  <Icon name="lock" /> Proceed to Payment <span>→</span>
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
