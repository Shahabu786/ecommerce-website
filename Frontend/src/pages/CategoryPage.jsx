import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, toFrontendProduct } from "../services/api";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import ProductCard from "../Components/ProductCard";
import "../App.css";

const categoryNames = { televisions: "Televisions", "mobile-phones": "Mobile Phones", refrigerators: "Refrigerators", "air-conditioners": "Air Conditioners", "air-coolers": "Air Coolers" };
export default function CategoryPage() {
  const { category } = useParams();
  const [catalogue, setCatalogue] = useState(products);
  useEffect(() => { let active = true; api.products().then((rows) => { if (active && Array.isArray(rows) && rows.length) setCatalogue(rows.map(toFrontendProduct)); }).catch(() => {}); return () => { active = false; }; }, []);
  const { addToCart } = useCart();
  const title = categoryNames[category] || category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const items = catalogue.filter((p) => p.category.toLowerCase() === title.toLowerCase() || (category === "televisions" && p.category === "Televisions"));
  return <main className="catalog-page"><div className="catalog-top"><div><p className="details-category">SHOP BY CATEGORY</p><h1>{title}</h1><p>{items.length} products available</p></div><Link to="/" className="catalog-back">← Home</Link></div>
    {items.length ? <div className="products-grid catalog-grid">{items.map((product) => <ProductCard key={product.id} product={product} addToCart={addToCart} />)}</div> : <div className="empty-state"><h2>Products coming soon</h2><p>There are no products listed in this category yet.</p><Link to="/products">Browse all products →</Link></div>}
  </main>;
}
