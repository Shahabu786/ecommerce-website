import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Icon from "./Icon";

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function Navbar({ search, setSearch, cartCount, products = [], onMenuClick }) {
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { clearCart } = useCart();
  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => `${p.name} ${p.brand || ""} ${p.category || ""}`.toLowerCase().includes(q)).slice(0, 6);
  }, [search, products]);

  const openProduct = (product) => {
    sessionStorage.setItem("technest-last-product", JSON.stringify(product));
    setSearch("");
    setFocused(false);
    navigate(`/product/${slugify(product.name)}`, { state: { product } });
  };

  return (
    <header className="navbar">
      <div className="nav-left">
        <button className="menu-btn" onClick={onMenuClick} aria-label="Browse products"><Icon name="menu" /></button>
        <Link to="/" className="logo"><span>Tech</span><strong>Nest</strong></Link>
      </div>
      <form className="search-box" onSubmit={(e) => { e.preventDefault(); navigate(`/products?q=${encodeURIComponent(search)}`); setFocused(false); }}>
        <input type="search" placeholder="Search products, brands..." value={search} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 150)} onChange={(e) => setSearch(e.target.value)} aria-label="Search products" />
        <button type="submit" aria-label="Search"><Icon name="search" /></button>
        {focused && search.trim() && <div className="search-results">
          {results.length ? results.map((product, i) => <button type="button" key={`${product.name}-${i}`} onMouseDown={() => openProduct(product)} className="search-result">
            <span className="search-result-icon"><Icon name={product.icon || "bag"} /></span><span><strong>{product.name}</strong><small>{product.brand} · {product.price}</small></span>
          </button>) : <p className="search-empty">No matching products. Press Enter to search all products.</p>}
        </div>}
      </form>
      <div className="nav-actions">
        {user ? (
          <>
            <Link className="signin" to="/orders"><Icon name="user" /> {String(user.name || "Account").split(" ")[0]} · Orders</Link>
            <button type="button" className="signin" onClick={() => { clearCart({ remote: false }); logout(); }}>Sign out</button>
          </>
        ) : (
          <Link className="signin" to="/login"><Icon name="user" /> Sign In</Link>
        )}
        <Link to="/cart" className="cart" aria-label={`Shopping cart, ${cartCount} items`}><Icon name="cart" /><span className="cart-count">{cartCount}</span></Link>
        <Link className="seller-btn" to="/seller/register">Sell With Us</Link>
      </div>
    </header>
  );
}
