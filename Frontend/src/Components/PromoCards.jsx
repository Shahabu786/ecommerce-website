import React from "react";
import { Link } from "react-router-dom";
import { PRODUCT_IMAGES } from "../data/productImages";
import Icon from "./Icon";

export default function PromoCards({}) {
  return (
    <>
      <section className="promo-section">

        <Link className="promo-card blue-promo" to="/laptops-monitors">

          <small>WORK FROM HOME</small>

          <h2>Laptops & Monitors</h2>

          <p>
            Starting ₹29,999 · Up to 15% off
          </p>

          <span className="promo-card-link">
            Shop Now →
          </span>

          <img className="promo-product-image laptop-promo-image" src={PRODUCT_IMAGES["macbook-air-m3"]} alt="Laptop for the Laptops & Monitors offer" loading="lazy" />

        </Link>


        <Link className="promo-card red-promo" to="/ac-installation">

          <small>INCLUDED FREE</small>

          <h2>AC Installation</h2>

          <p>
            Free install on orders above ₹25,000
          </p>

          <span className="promo-card-link">
            Book Now →
          </span>

          <span className="promo-icon">
            <Icon name="wrench" />
          </span>

        </Link>


        <Link className="promo-card green-promo" to="/exchange">

          <small>SAVE MORE</small>

          <h2>Old for New Exchange</h2>

          <p>
            Up to ₹15,000 extra off on exchange
          </p>

          <span className="promo-card-link">
            Check My Value →
          </span>

          <span className="promo-icon">
            <Icon name="recycle" />
          </span>

        </Link>

      </section>
    </>
  );
}
