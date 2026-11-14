import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <>
      <section className="hero-section">

        <div className="hero-content">

          <div className="sale-tag">
            ● SUMMER MEGA SALE 2026
          </div>

          <h1>
            Beat The Heat.
            <br />
            Shop India's Best
            <br />

            <span>
              ACs & Coolers.
            </span>

          </h1>

          <p>
            Up to 48% off on Split ACs, Window ACs,
            Desert Coolers & Tower Fans.
            Free professional installation on orders above ₹25,000.
          </p>


          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() =>
                document
                  .getElementById("deals")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              <Icon name="fire" /> Shop Now
            </button>

            <button
              className="secondary-btn"
              onClick={() =>
                document
                  .getElementById("deals")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              See All Offers →
            </button>

          </div>


          <div className="hero-stats">

            <div>
              <strong>48%</strong>
              <span>Max Discount</span>
            </div>

            <div>
              <strong>FREE</strong>
              <span>Installation</span>
            </div>

            <div>
              <strong>2M+</strong>
              <span>Happy Buyers</span>
            </div>

            <div>
              <strong>500+</strong>
              <span>Cities</span>
            </div>

          </div>

        </div>


        <div className="hero-icon">
          <Icon name="snowflake" />
        </div>


        <div className="hero-side-cards">

          <button type="button" className="side-card blue hero-side-button" onClick={() => navigate("/category/televisions")}>

            <small>NEW LAUNCH</small>

            <h3>4K Smart TVs</h3>

            <p>OLED & QLED from ₹18,999</p>

            <strong>Up to 38% Off</strong>

          </button>


          <button type="button" className="side-card red hero-side-button" onClick={() => navigate("/category/mobile-phones")}>

            <small>FLASH SALE</small>

            <h3>Smartphones</h3>

            <p>Samsung, Apple, OnePlus</p>

            <strong>No-Cost EMI</strong>

          </button>


          <button type="button" className="side-card green hero-side-button" onClick={() => navigate("/category/refrigerators")}>

            <small>EXCHANGE OFFER</small>

            <h3>Double Door Fridges</h3>

            <p>Frost-free from ₹22,499</p>

            <strong>₹8,000 Off on Exchange</strong>

          </button>

        </div>

      </section>
    </>
  );
}
