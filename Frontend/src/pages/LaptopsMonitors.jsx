import { useState } from "react";
import { Link } from "react-router-dom";
import { products as demoProducts } from "../data/products";
import { useCart } from "../context/CartContext";
import { useCatalogue } from "../hooks/useCatalogue";
import ProductCard from "../Components/ProductCard";
import TopBar from "../Components/TopBar";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../App.css";
import Icon from "../Components/Icon";

const SUBCATEGORIES = [
  { id: "All", name: "All", icon: "💻" },
  { id: "Laptops", name: "Laptops", icon: "💻" },
  { id: "Monitors", name: "Monitors", icon: "🖥️" },
];

export default function LaptopsMonitors() {
  const { cartCount, addToCart } = useCart();
  const { products: liveProducts } = useCatalogue();
  const [search, setSearch] = useState("");
  const [activeSub, setActiveSub] = useState("All");

  const catalogue = liveProducts?.length ? liveProducts : demoProducts;

  const filtered = catalogue.filter((p) => {
    const inCategory =
      p.category === "Laptops" || p.category === "Monitors";
    const inSub =
      activeSub === "All" || p.category === activeSub;
    const textMatch = `${p.name} ${p.brand || ""}`
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return inCategory && inSub && textMatch;
  });

  const featured = [
    {
      brand: "APPLE",
      name: 'Apple MacBook Air M3 13" 8GB RAM 256GB SSD Midnight',
      price: "₹1,14,900",
      oldPrice: "₹1,19,900",
      discount: "₹5,000 off",
      icon: "💻",
      category: "Laptops",
      rating: "4.9",
      reviews: "892",
      badge: "NEW",
    },
    {
      brand: "SAMSUNG",
      name: 'Samsung Odyssey Ark 32" Curved 4K 165Hz Gaming Monitor',
      price: "₹89,999",
      oldPrice: "₹1,09,999",
      discount: "₹20,000 off",
      icon: "🖥️",
      category: "Monitors",
      rating: "4.9",
      reviews: "380",
      badge: "HOT DEAL",
    },
  ];

  return (
    <div className="app">
      <TopBar />
      <Navbar
        search={search}
        setSearch={setSearch}
        cartCount={cartCount}
        products={catalogue}
      />

      <main className="laptops-monitors-page">
        <div className="laptops-monitors-container">
          {/* HERO BANNER */}
          <section className="lm-hero-banner">
            <div className="lm-hero-copy">
              <span className="lm-eyebrow">WORK FROM HOME COLLECTION</span>
              <h1>
                Laptops &amp; <span>Monitors</span>
              </h1>
              <p className="lm-hero-sub">
                Starting ₹29,999 · Up to 15% off on the latest laptops and
                4K monitors. Free professional setup on orders above ₹25,000.
              </p>
              <div className="lm-hero-stats">
                <div><strong>15%</strong><span>Max Discount</span></div>
                <div><strong>4K</strong><span>UHD Displays</span></div>
                <div><strong>5yr</strong><span>Warranty</span></div>
                <div><strong>2M+</strong><span>Happy Users</span></div>
              </div>
            </div>
            <div className="lm-hero-visual">
              <div className="lm-hero-card">
                <small>FEATURED PICK</small>
                <h3>MacBook Air M3</h3>
                <p>Thin, light, all-day battery.</p>
                <strong>₹1,14,900</strong>
              </div>
              <div className="lm-hero-icon"><Icon name="laptop" /></div>
            </div>
          </section>

          {/* SUBCATEGORY TABS */}
          <div className="lm-subnav">
            {SUBCATEGORIES.map((sub) => {
              const isActive = activeSub === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  className={`lm-sub-btn ${isActive ? "active" : ""}`}
                  onClick={() => setActiveSub(sub.id)}
                >
                  <span className="lm-sub-icon"><Icon name={sub.icon} /></span>
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>

          {/* FEATURED STRIP */}
          <div className="lm-featured-grid">
            {featured.map((product) => (
              <article className="lm-featured-card" key={product.name}>
                <div className="lm-featured-badge">{product.badge}</div>
                <div className="lm-featured-icon"><Icon name={product.icon} /></div>
                <small className="lm-featured-brand">{product.brand}</small>
                <h3>{product.name}</h3>
                <div className="lm-featured-prices">
                  <strong>{product.price}</strong>
                  <del>{product.oldPrice}</del>
                </div>
                <p className="lm-featured-discount">{product.discount}</p>
                <div className="lm-featured-actions">
                  <Link to="/products" className="lm-featured-link">
                    View Details →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* PRODUCT GRID */}
          <div className="lm-section-head">
            <div>
              <span className="lm-section-eyebrow">ALL PRODUCTS</span>
              <h2>
                {activeSub === "All"
                  ? "Laptops & Monitors"
                  : activeSub}
                <small>{filtered.length} available</small>
              </h2>
            </div>
            <Link to="/products" className="lm-section-link">
              Browse all products →
            </Link>
          </div>

          {filtered.length ? (
            <div className="products-grid-v2">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id || product.name}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state-v2">
              <h2>No products found</h2>
              <p>Try another search term or clear the active filter.</p>
              <button
                className="primary-btn"
                onClick={() => {
                  setSearch("");
                  setActiveSub("All");
                }}
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* INSTALLATION CTA */}
          <section className="lm-cta-card">
            <div className="lm-cta-copy">
              <span className="lm-cta-tag">INCLUDED FREE</span>
              <h2>Free professional setup on orders above ₹25,000</h2>
              <p>
                Our technicians install and configure your new laptop or monitor
                at home — connection, software and warranty registration handled
                for you.
              </p>
            </div>
            <Link to="/ac-installation" className="lm-cta-btn">
              Book Setup →
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}