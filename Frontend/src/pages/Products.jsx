import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { products as demoProducts } from "../data/products";
import { useCart } from "../context/CartContext";
import ProductCard from "../Components/ProductCard";
import TopBar from "../Components/TopBar";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { api, toFrontendProduct } from "../services/api";
import "../App.css";
import { CATEGORY_PHOTOS } from "../data/productImages";
import Icon from "../Components/Icon";

const CATEGORIES_WITH_COUNTS = [
  { id: "All", name: "All Products", count: 17, image: CATEGORY_PHOTOS["All Products"] },
  { id: "Electronics", name: "Electronics", count: 5, image: CATEGORY_PHOTOS.Electronics },
  { id: "Home Appliances", name: "Home Appliances", count: 3, image: CATEGORY_PHOTOS["Home Appliances"] },
  { id: "Fashion", name: "Fashion", count: 2, image: CATEGORY_PHOTOS.Fashion },
  { id: "Mobiles & Accessories", name: "Mobiles & Accessories", count: 3, image: CATEGORY_PHOTOS["Mobiles & Accessories"] },
  { id: "Computers & Laptops", name: "Computers & Laptops", count: 2, image: CATEGORY_PHOTOS["Computers & Laptops"] },
  { id: "TV & Audio", name: "TV & Audio", count: 1, image: CATEGORY_PHOTOS["TV & Audio"] },
  { id: "Accessories", name: "Accessories", count: 1, image: CATEGORY_PHOTOS.Accessories },
];

const FILTER_PILLS = [
  { id: "All", name: "All", icon: "▦" },
  { id: "Electronics", name: "Electronics", icon: "💻" },
  { id: "Home Appliances", name: "Home Appliances", icon: "🧺" },
  { id: "Fashion", name: "Fashion", icon: "👕" },
  { id: "Mobiles & Accessories", name: "Mobiles", icon: "📱" },
  { id: "Computers & Laptops", name: "Computers", icon: "💻" },
];

export default function Products() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { cartCount, addToCart } = useCart();

  const [catalogue, setCatalogue] = useState(demoProducts);
  const [apiMessage, setApiMessage] = useState("");
  const [search, setSearch] = useState(params.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Popularity");

  useEffect(() => {
    let active = true;
    api.products()
      .then((rows) => {
        if (active && Array.isArray(rows) && rows.length) {
          setCatalogue(rows.map(toFrontendProduct));
          setApiMessage("");
        }
      })
      .catch(() => {
        if (active) setApiMessage("Backend unavailable — showing demo catalogue.");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const q = params.get("q") || "";
    setSearch(q);
  }, [params]);

  const query = search.trim().toLowerCase();

  const filteredMatches = useMemo(() => {
    return catalogue.filter((p) => {
      const textMatch = `${p.name} ${p.brand || ""} ${p.category || ""}`
        .toLowerCase()
        .includes(query);

      const catMatch =
        selectedCategory === "All" ||
        p.category === selectedCategory ||
        (selectedCategory === "Mobiles & Accessories" && (p.category === "Mobile Phones" || p.category === "Accessories")) ||
        (selectedCategory === "Computers & Laptops" && (p.category === "Laptops" || p.category === "Computers")) ||
        (selectedCategory === "TV & Audio" && (p.category === "Televisions" || p.category === "Audio"));

      return textMatch && catMatch;
    });
  }, [query, catalogue, selectedCategory]);

  const sortedMatches = useMemo(() => {
    const list = [...filteredMatches];
    if (sortBy === "Price: Low to High") {
      list.sort((a, b) => (parseFloat(String(a.price).replace(/[^0-9.]/g, "")) || 0) - (parseFloat(String(b.price).replace(/[^0-9.]/g, "")) || 0));
    } else if (sortBy === "Price: High to Low") {
      list.sort((a, b) => (parseFloat(String(b.price).replace(/[^0-9.]/g, "")) || 0) - (parseFloat(String(a.price).replace(/[^0-9.]/g, "")) || 0));
    } else if (sortBy === "Rating") {
      list.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
    }
    return list;
  }, [filteredMatches, sortBy]);

  return (
    <div className="app">
      <TopBar />
      <Navbar
        search={search}
        setSearch={setSearch}
        cartCount={cartCount}
        products={catalogue}
      />

      <main className="shopnest-all-products-page">
        <div className="shopnest-container">
          <div className="shopnest-layout">
            {/* LEFT SIDEBAR CATEGORIES */}
            <aside className="shopnest-sidebar">
              <div className="sidebar-categories-card">
                <div className="sidebar-categories-header">
                  <span className="sidebar-header-icon"><Icon name="menu" /></span>
                  <h3>Categories</h3>
                </div>
                <div className="sidebar-categories-list">
                  {CATEGORIES_WITH_COUNTS.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        className={`sidebar-category-item ${isActive ? "active" : ""}`}
                        onClick={() => setSelectedCategory(cat.id)}
                      >
                        <div className="cat-item-left">
                          <span className="cat-icon">{cat.image ? <img src={cat.image} alt="" loading="lazy" /> : <Icon name={cat.icon} />}</span>
                          <span className="cat-name">{cat.name}</span>
                        </div>
                        <div className="cat-item-right">
                          <span className="cat-count">{cat.count}</span>
                          <span className="cat-arrow">›</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FREE DELIVERY PROMO CARD */}
              <div className="sidebar-promo-card">
                <div className="promo-truck-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                  </svg>
                </div>
                <div className="promo-text-content">
                  <strong>Free Delivery</strong>
                  <p>On orders above ₹999</p>
                </div>
                <button type="button" className="promo-arrow-btn" aria-label="Free delivery details">
                  ›
                </button>
              </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <section className="shopnest-main-content">
              {/* HERO BANNER */}
              <div className="products-hero-banner">
                <div className="hero-banner-text">
                  <span className="collection-eyebrow">OUR COLLECTION</span>
                  <h1>
                    {query ? `Search results for “${query}”` : <>All <span>Products</span></>}
                  </h1>
                  <p className="products-found-count">{sortedMatches.length} products found</p>
                  <p className="hero-banner-description">
                    Upgrade your lifestyle with the latest and best products from our store. Quality, style and value — all in one place.
                  </p>
                  {apiMessage && <small className="api-status-msg" role="status">{apiMessage}</small>}
                </div>

                <div className="hero-banner-illustration">
                  <Link to="/" className="banner-home-link">
                    ← Home
                  </Link>

                  <div className="3d-cart-graphic">
                    <svg viewBox="0 0 280 180" fill="none" className="cart-illustration-svg">
                      <defs>
                        <linearGradient id="bagGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#1D4ED8" />
                        </linearGradient>
                        <linearGradient id="bagGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FDE68A" />
                          <stop offset="100%" stopColor="#F59E0B" />
                        </linearGradient>
                      </defs>
                      <circle cx="140" cy="110" r="65" fill="#DBEAFE" opacity="0.6" />
                      {/* Shopping Cart Body */}
                      <path d="M60 50 H80 L100 120 H180 L200 65 H85" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="rgba(219, 234, 254, 0.4)" />
                      {/* Cart Grid */}
                      <path d="M100 80 H195 M105 95 H188 M110 110 H180 M120 65 V120 M140 65 V120 M160 65 V120 M180 65 V120" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.5" />
                      {/* Cart Wheels */}
                      <circle cx="115" cy="135" r="9" fill="#1E40AF" />
                      <circle cx="115" cy="135" r="4" fill="#FFFFFF" />
                      <circle cx="165" cy="135" r="9" fill="#1E40AF" />
                      <circle cx="165" cy="135" r="4" fill="#FFFFFF" />
                      {/* Shopping Bags in Cart */}
                      <rect x="105" y="45" width="30" height="40" rx="3" fill="url(#bagGrad1)" />
                      <path d="M113 45 V38 Q120 32 127 38 V45" stroke="#BFDBFE" strokeWidth="2" fill="none" />
                      <rect x="130" y="52" width="35" height="35" rx="3" fill="url(#bagGrad2)" />
                      <path d="M140 52 V46 Q147 40 155 46 V52" stroke="#FEF08A" strokeWidth="2" fill="none" />
                      {/* Plant pot */}
                      <path d="M42 120 L46 140 H60 L64 120 Z" fill="#D97706" />
                      <ellipse cx="53" cy="112" rx="10" ry="12" fill="#10B981" />
                    </svg>
                    <div className="cursive-tagline">
                      <span>Better Products</span>
                      <span>Happier You <Icon name="heart" /></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FILTER PILLS & SORT ROW */}
              <div className="products-controls-bar">
                <div className="filter-pills-scroll">
                  {FILTER_PILLS.map((pill) => {
                    const isActive = selectedCategory === pill.id;
                    return (
                      <button
                        key={pill.id}
                        type="button"
                        className={`filter-pill-btn ${isActive ? "active" : ""}`}
                        onClick={() => setSelectedCategory(pill.id)}
                      >
                        <span className="pill-icon"><Icon name={pill.icon} /></span>
                        <span>{pill.name}</span>
                      </button>
                    );
                  })}
                  <button type="button" className="filter-pill-btn more-pill" onClick={() => setSelectedCategory("All")}>
                    •••
                  </button>
                </div>

                <div className="sort-by-dropdown-wrapper">
                  <span className="sort-label">Sort by:</span>
                  <select
                    className="sort-by-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="Popularity">Popularity</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Price: High to Low">Price: High to Low</option>
                    <option value="Rating">Rating</option>
                  </select>
                </div>
              </div>

              {/* PRODUCTS GRID */}
              {sortedMatches.length ? (
                <div className="products-grid-v2">
                  {sortedMatches.map((product) => (
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
                  <p>Try searching for another item or clear your active category filter.</p>
                  <button
                    className="primary-btn"
                    onClick={() => {
                      setSelectedCategory("All");
                      setSearch("");
                      navigate("/products");
                    }}
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
