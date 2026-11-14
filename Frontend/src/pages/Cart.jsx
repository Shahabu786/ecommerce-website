import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useCatalogue } from "../hooks/useCatalogue";
import { useNavigate, Link } from "react-router-dom";
import { getProductImage } from "../data/productImages";
import TopBar from "../Components/TopBar";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../App.css";
import Icon from "../Components/Icon";

function PackageIllustration({ empty = false }) {
  return (
    <svg
      className={empty ? "cart-empty-art" : "cart-package-art"}
      viewBox="0 0 220 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Shopping package illustration"
    >
      <ellipse cx="110" cy="158" rx="76" ry="10" fill="#DBEAFE" />
      <circle cx="168" cy="39" r="23" fill="#DBEAFE" />
      <circle cx="42" cy="73" r="14" fill="#EFF6FF" />
      <path
        d="M57 78L110 49L164 78L110 109L57 78Z"
        fill="#93C5FD"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M57 78L110 109V158L57 126V78Z"
        fill="#BFDBFE"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M110 109L164 78V126L110 158V109Z"
        fill="#60A5FA"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M91 60L143 90L127 100L74 70L91 60Z"
        fill="#FBBF24"
        stroke="#D97706"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M110 109V158" stroke="#2563EB" strokeWidth="2" />
      <path d="M84 94V118" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      {empty && (
        <>
          <path
            d="M88 38L100 26L112 38"
            stroke="#2563EB"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}

function Cart() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { products: liveProducts } = useCatalogue();

  const {
    cartItems,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartMessage,
  } = useCart();

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to remove all items from your cart?")) {
      clearCart();
    }
  };

  const money = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

  const getPrice = (item) =>
    Number(String(item.price).replace(/[₹,\s]/g, "")) || 0;

  return (
    <div className="app">
      <TopBar />
      <Navbar
        search={search}
        setSearch={setSearch}
        cartCount={cartCount}
        products={liveProducts}
      />

      {cartItems.length === 0 ? (
        <main className="cart-page-v2 empty">
          <div className="cart-empty-card">
            <PackageIllustration empty />
            <span className="cart-eyebrow">YOUR CART</span>
            <h1>Your next great find awaits.</h1>
            <p>
              Looks like you haven't added anything yet. Explore our collection and
              find something you love.
            </p>
            <Link to="/products" className="cart-primary-btn-v2">
              Explore Products <span>→</span>
            </Link>
          </div>
        </main>
      ) : (
        <main className="cart-page-v2">
          <div className="cart-container-v2">
            <div className="cart-breadcrumb-v2">
              <Link to="/"><span className="home-icon"><Icon name="home" /></span> Home</Link>
              <span className="separator">/</span>
              <span>Shopping Cart</span>
            </div>

            <header className="cart-hero-v2">
              <div className="cart-hero-content">
                <span className="cart-hero-eyebrow">YOUR SHOPPING BAG</span>
                <h1 className="cart-hero-title">
                  Shopping Cart<span>.</span>
                </h1>
                <p className="cart-hero-subtitle">Review your items before you place your order.</p>
              </div>

              <div className="cart-hero-visual">
                <div className="cart-hero-svg-wrapper">
                  <svg viewBox="0 0 200 130" fill="none" className="cart-bag-hero-svg">
                    <ellipse cx="100" cy="120" rx="70" ry="8" fill="#DBEAFE" />
                    <path
                      d="M45 45 H75 L95 105 H155 L175 55 H70"
                      stroke="#2563EB"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="rgba(219, 234, 254, 0.4)"
                    />
                    <circle cx="90" cy="115" r="7" fill="#1E40AF" />
                    <circle cx="140" cy="115" r="7" fill="#1E40AF" />
                    <rect x="80" y="25" width="26" height="35" rx="3" fill="#F59E0B" />
                    <rect x="115" y="20" width="30" height="40" rx="3" fill="#8B5CF6" />
                  </svg>
                  <div className="cart-hero-badge">
                    Good Things Ahead! <Icon name="heart" />
                  </div>
                </div>
              </div>
            </header>

            {cartMessage && (
              <div className="cart-message-banner" role="alert">
                {cartMessage}
              </div>
            )}

            <div className="cart-grid-v2">
              <section className="cart-items-section">
                <div className="cart-section-header-v2">
                  <div className="title-area">
                    <div className="icon-box"><Icon name="cart" /></div>
                    <h2>Your Items</h2>
                  </div>
                  <div className="cart-header-actions">
                    <span className="count-pill">
                      {cartCount} item{cartCount !== 1 ? "s" : ""}
                    </span>
                    <button
                      type="button"
                      className="clear-cart-btn"
                      onClick={handleClearCart}
                    >
                      <Icon name="trash" /> Clear Cart
                    </button>
                  </div>
                </div>

                <div className="cart-items-list-v2">
                  {cartItems.map((item) => {
                    const price = getPrice(item);
                    const itemKey = item.id ?? item.name;

                    return (
                      <article className="cart-item-card-v2" key={itemKey}>
                        {item.badge && (
                          <div className={`item-badge-v2 ${item.badge.toLowerCase()}`}>
                            {item.badge}
                          </div>
                        )}
                        <div className="item-image-box-v2">
                          {getProductImage(item) ? (
                            <img
                              src={getProductImage(item)}
                              alt={item.name}
                              loading="lazy"
                            />
                          ) : (
                            <div className="placeholder-box">
                              <PackageIllustration />
                              <span className="item-icon-overlay">
                                <Icon name={item.icon || "bag"} />
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="item-info-v2">
                          <span className="item-collection-label">
                            TECHNEST COLLECTION
                          </span>

                          <h3 className="item-name-v2">{item.name}</h3>

                          <div className="item-rating-v2">
                            <span className="rating-stars">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" />)}</span>
                            <span className="rating-val">{item.rating || "4.5"} ({item.reviews || "120"} reviews)</span>
                          </div>

                          <p className="item-price-unit-v2">
                            {money(price)} <span>/ unit</span>
                          </p>

                          <div className="item-controls-v2">
                            <div className="item-qty-stepper">
                              <button
                                type="button"
                                onClick={() => updateQuantity(itemKey, -1)}
                                disabled={item.quantity <= 1}
                              >
                                −
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(itemKey, 1)}
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              className="item-remove-link"
                              onClick={() => removeFromCart(itemKey)}
                            >
                              <Icon name="trash" /> Remove
                            </button>
                          </div>
                        </div>

                        <div className="item-total-price-v2">
                          <span className="total-label">Item total</span>
                          <strong className="total-val">{money(price * item.quantity)}</strong>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <Link to="/products" className="continue-btn-v2">
                  <span>←</span> Continue Shopping
                </Link>
              </section>

              <aside className="cart-sidebar-v2">
                <div className="summary-card-v2">
                  <header className="summary-header-v2">
                    <div className="summary-icon-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="4" y="3" width="16" height="18" rx="2" />
                        <path d="M8 8h8M8 12h8M8 16h5" />
                      </svg>
                    </div>
                    <div className="summary-title-group">
                      <span className="summary-eyebrow">ORDER DETAILS</span>
                      <h2>Order Summary</h2>
                    </div>
                  </header>

                  <div className="summary-content-v2">
                    <div className="summary-items-v2">
                      {cartItems.map((item) => (
                        <div className="summary-row-v2" key={item.id ?? item.name}>
                          <div className="summary-item-left">
                            <div className="summary-item-thumb">
                              {getProductImage(item) ? (
                                <img src={getProductImage(item)} alt={item.name} />
                              ) : (
                                <span className="thumb-emoji"><Icon name={item.icon || "bag"} /></span>
                              )}
                            </div>
                            <span className="summary-item-name">{item.name} × {item.quantity}</span>
                          </div>
                          <span className="summary-item-price">{money(getPrice(item) * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="summary-divider" />

                    <div className="summary-line-v2">
                      <span>Subtotal</span>
                      <strong>{money(cartTotal)}</strong>
                    </div>

                    <div className="summary-line-v2">
                      <span>Delivery</span>
                      <span className="delivery-val">At checkout</span>
                    </div>

                    <div className="summary-divider" />

                    <div className="total-display-box-v2">
                      <div className="total-label-group">
                        <span className="total-main-label">Estimated total</span>
                        <span className="total-sub-label">Inclusive of listed prices</span>
                      </div>
                      <strong className="total-amount-val">{money(cartTotal)}</strong>
                    </div>

                    <button
                      type="button"
                      className="checkout-action-btn"
                      onClick={() => navigate("/checkout")}
                    >
                      <div className="btn-left">
                        <span className="btn-lock"><Icon name="lock" /></span>
                        <span>Proceed to Checkout</span>
                      </div>
                      <span className="btn-arrow">→</span>
                    </button>

                    <div className="checkout-trust-v2">
                      <span className="trust-shield"><Icon name="shield" /></span> Secure checkout experience
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
}

export default Cart;
