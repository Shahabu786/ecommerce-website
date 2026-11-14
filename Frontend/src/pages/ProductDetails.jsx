
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductById, slugify } from "../data/products";
import { getProductImage } from "../data/productImages";
import { useCatalogue } from "../hooks/useCatalogue";
import "../App.css";
import Icon from "../Components/Icon";

export default function ProductDetails() {
  const { slug } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { products: liveProducts } = useCatalogue();

  // Get last viewed product from session storage
  let savedProduct = null;

  try {
    savedProduct = JSON.parse(
      sessionStorage.getItem("technest-last-product") || "null"
    );
  } catch {
    savedProduct = null;
  }

  // Find product from available sources
  const product =
    state?.product ||
    liveProducts?.find((p) => slugify(p.name) === slug) ||
    getProductById(slug) ||
    (savedProduct &&
    (
      savedProduct.id === slug ||
      savedProduct.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") === slug
    )
      ? savedProduct
      : null);

  // Currency formatter
  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(
      Number(String(value ?? 0).replace(/[₹,\s]/g, "")) || 0
    );

  // Product not found
  if (!product) {
    return (
      <main className="simple-page">
        <h1>Product not found</h1>
        <p>Please select the product again from the Home page.</p>

        <button
          className="primary-btn"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </main>
    );
  }

  const price =
    Number(String(product.price ?? 0).replace(/[₹,\s]/g, "")) || 0;

  // Get product image
  const productImage = getProductImage(product);

  // Stock status
  const isOutOfStock = product.stockQuantity === 0;

  return (
    <main className="product-details-page">

      {/* Back Button */}
      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="product-details-layout">

        {/* PRODUCT IMAGE SECTION */}
        <section className="product-details-image">

          {productImage ? (
            <img
              className="product-details-photo"
              src={productImage}
              alt={product.name}
              loading="eager"
              onError={(event) => {
                event.currentTarget.style.display = "none";

                const fallback =
                  event.currentTarget.nextElementSibling;

                if (fallback) {
                  fallback.style.display = "flex";
                }
              }}
            />
          ) : null}

          {/* Fallback icon if image is unavailable */}
          <div
            className="product-details-icon"
            style={{
              display: productImage ? "none" : "flex",
            }}
          >
            <Icon name={product.icon || "bag"} />
          </div>

        </section>

        {/* PRODUCT INFORMATION SECTION */}
        <section className="product-details-info">

          {/* Category */}
          <p className="details-category">
            {product.category || "TechNest Products"}
          </p>

          {/* Product Name */}
          <h1>{product.name}</h1>

          {/* Rating */}
          <p className="details-rating">
            <Icon name="star" />
            {" "}{product.rating || "4.5"} / 5

            {product.reviews
              ? ` (${product.reviews} reviews)`
              : ""}
          </p>

          {/* Product Price */}
          <div className="details-prices">

            <span className="details-current-price">
              {money(price)}
            </span>

            {product.oldPrice && (
              <span className="details-old-price">
                {money(product.oldPrice)}
              </span>
            )}

          </div>

          {/* Description */}
          <p className="details-description">
            {product.description ||
              `Upgrade your tech experience with ${product.name}. A product chosen with quality and everyday use in mind.`}
          </p>

          {/* Stock Status */}
          <p className="details-stock">

            {product.stockQuantity === undefined ? (
              "Demo listing · availability will be confirmed by the seller"
            ) : isOutOfStock ? (
              <>
                <Icon name="close" />
                {" "}Out of stock
              </>
            ) : (
              `In stock (${product.stockQuantity} available)`
            )}

          </p>

          {/* ACTION BUTTONS */}
          <div className="details-actions">

            {/* Add to Cart */}
            <button
              className="details-button"
              disabled={isOutOfStock}
              onClick={() => addToCart(product)}
            >
              <Icon name="cart" />
              {" "}Add to Cart
            </button>

            {/* Buy Now */}
            <button
              className="details-buy-button"
              disabled={isOutOfStock}
              onClick={async () => {
                const result = await addToCart(product);

                if (result?.ok !== false) {
                  navigate("/cart");
                }
              }}
            >
              Buy Now
            </button>

          </div>

          {/* PRODUCT BENEFITS */}
          <div className="details-benefits">

            <p>
              <Icon name="truck" />
              {" "}Delivery details at checkout
            </p>

            <p>
              <Icon name="lock" />
              {" "}Cash on Delivery available
            </p>

            <p>
              <Icon name="chat" />
              {" "}Customer support
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}
