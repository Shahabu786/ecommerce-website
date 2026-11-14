import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { slugify } from "../data/products";
import { getProductImage } from "../data/productImages";
import Icon from "./Icon";

export default function ProductCard({ product, addToCart }) {
  const navigate = useNavigate();
  const cart = useCart();
  const add = addToCart || cart.addToCart;
  const [feedback, setFeedback] = useState("");
  const [busyAction, setBusyAction] = useState("");
  const feedbackTimer = useRef(null);
  const navigateTimer = useRef(null);

  useEffect(() => () => {
    window.clearTimeout(feedbackTimer.current);
    window.clearTimeout(navigateTimer.current);
  }, []);

  const showFeedback = (message) => {
    window.clearTimeout(feedbackTimer.current);
    setFeedback(message);
    feedbackTimer.current = window.setTimeout(() => {
      setFeedback("");
      setBusyAction("");
    }, 1800);
  };

  const openDetails = () => {
    sessionStorage.setItem("technest-last-product", JSON.stringify(product));
    navigate(`/product/${slugify(product.name)}`, { state: { product } });
  };

  const handleAddToCart = async () => {
    setBusyAction("cart");
    const result = await add(product);
    if (result?.ok === false) {
      showFeedback(result.message);
      return;
    }
    showFeedback("Added to cart!");
  };

  const buyNow = async () => {
    const result = await add(product);
    if (result?.ok === false) {
      setBusyAction("");
      showFeedback(result.message);
      return;
    }
    setBusyAction("buy");
    setFeedback("Added! Opening cart…");
    window.clearTimeout(navigateTimer.current);
    navigateTimer.current = window.setTimeout(() => navigate("/cart"), 550);
  };

  return (
    <article className={`product-card ${feedback ? "product-card-feedback" : ""}`}>
      <div className="product-image">
        {product.badge && <div className="product-badge">{product.badge}</div>}
        <button className="product-icon" onClick={openDetails} aria-label={`View ${product.name}`}>
          {getProductImage(product) ? (
            <img src={getProductImage(product)} alt={product.name} loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} />
          ) : (
            <Icon name={product.icon || "bag"} />
          )}
        </button>
        <button className="heart" aria-label="Sign in to save favourites" onClick={() => navigate("/login")}><Icon name="heart" /></button>
      </div>
      <div className="product-info">
        <small className="brand">{product.brand}</small>
        <h3>{product.name}</h3>
        {product.rating && <div className="rating">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" />)} <span>{product.rating}{product.reviews ? ` (${product.reviews})` : ""}</span></div>}
        <div className="price-row"><strong>{product.price}</strong>{product.oldPrice && <del>{product.oldPrice}</del>}</div>
        {product.discount && <p className="discount">{product.discount}</p>}
        <button className="view-details-link" onClick={openDetails}>View Details →</button>
        <p className="emi">No-Cost EMI available</p>
        {feedback && <div className={`product-action-feedback ${busyAction === "buy" ? "buy-feedback" : ""}`} role="status">{feedback}</div>}
        <div className="product-buttons">
          <button className={`add-cart ${busyAction === "cart" ? "action-success" : ""}`} onClick={handleAddToCart}>
            {busyAction === "cart" ? <><Icon name="check" /> Added!</> : "+ Cart"}
          </button>
          <button className={`buy-now ${busyAction === "buy" ? "action-success" : ""}`} onClick={buyNow}>
            {busyAction === "buy" ? <><Icon name="check" /> Added!</> : "Buy Now"}
          </button>
        </div>
      </div>
    </article>
  );
}
