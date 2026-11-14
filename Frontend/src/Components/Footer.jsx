import React from "react";
import Icon from "./Icon";

export default function Footer({}) {
  return (
    <>
      {/* NEWSLETTER SECTION */}
      <section className="newsletter-section">
        <div className="newsletter-message">
          <span className="newsletter-icon"><Icon name="mail" /></span>
          <div>
            <h3>Get the Best Deals First</h3>
            <p>Subscribe for sale alerts, new product drops &amp; exclusive discounts.</p>
          </div>
        </div>

        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter your email address..."
            aria-label="Email address"
            required
          />
          <button type="submit">Subscribe →</button>
        </form>
      </section>

      {/* MAIN FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-about">
            <h2>TECH<span>Nest</span></h2>
            <p>
              Tech Nestis a modern multi-vendor ecommerce marketplace
              providing secure shopping, trusted sellers and fast delivery experience.
            </p>
            <div className="social-links">
              <a href="#facebook" aria-label="Facebook">f</a>
              <a href="#instagram" aria-label="Instagram">◎</a>
              <a href="#x" aria-label="X">𝕏</a>
              <a href="#linkedin" aria-label="LinkedIn">in</a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>
            <a href="/">Home</a>
            <a href="#deals">Products</a>
            <a href="#benefits">Services</a>
            <a href="#about">About Us</a>
            <a href="/founders">Founders</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-column">
            <h3>Customer Service</h3>
            <a href="#careers">Careers</a>
            <a href="#terms">Terms &amp; Conditions</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#returns">Returns</a>
            <a href="#help">Help Center</a>
          </div>

          <div className="footer-column">
            <h3>For Sellers</h3>
            <a href="#seller">Become Seller</a>
            <a href="#dashboard">Seller Dashboard</a>
            <a href="#seller-policy">Seller Policy</a>
            <a href="#payments">Payments</a>
            <a href="#support">Seller Support</a>
          </div>

          <div className="footer-column footer-contact">
            <h3>Subscribe Newsletter</h3>
            <p>Get updates about offers &amp; new products.</p>
            <p><Icon name="map-pin" /> Lucknow, Uttar Pradesh, India</p>
            <p><Icon name="mail" /> support@technest.com</p>
            <p><Icon name="phone" /> +91 80581 16097</p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="payment-icons" aria-label="Payment methods">
            <span>▤</span>
            <span>℗</span>
            <span>▱</span>
            <span><Icon name="credit-card" /></span>
          </div>
          <p>© 2026 Tech Nest. All Rights Reserved | Designed by Tech Nest Team <br></br>
          "1.Shahabudin ansari "
          2.Sunil yadav
          3.Abhishek yadav
          4.Gunjan Raj</p>
        </div>
      </footer>
    </>
  );
}
