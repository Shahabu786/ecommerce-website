import React from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function SellerSection({}) {
  return (
    <>
      <section
        className="seller-section"
        id="seller"
      >

        <div className="seller-content">

          <small>
            FOR ELECTRONICS SELLERS
          </small>

          <h2>
            Grow Your Business with
            <em> Millions </em>
            of Buyers
          </h2>

          <p>
            Whether you run a shop in Lajpat Rai Market,
            a warehouse in Surat, or represent a brand —
            TechBazaar gives your products national reach.
          </p>


          <div className="seller-buttons">

            <Link to="/seller/register" className="primary-btn seller-register-link">
              <Icon name="store" /> Register as Seller — Free
            </Link>

            <Link to="/seller/register" className="secondary-btn seller-register-link">
              Learn More →
            </Link>

          </div>


          <div className="seller-steps">

            <div>
              <strong>01</strong>
              <h3>Register Free</h3>
              <p>
                Submit GSTIN & docs. Verified in 24hrs.
              </p>
            </div>

            <div>
              <strong>02</strong>
              <h3>List Products</h3>
              <p>
                Upload inventory with photos & specs.
              </p>
            </div>

            <div>
              <strong>03</strong>
              <h3>Receive Orders</h3>
              <p>
                Instant alerts. Ship via 20+ partners.
              </p>
            </div>

            <div>
              <strong>04</strong>
              <h3>Get Paid in 7 Days</h3>
              <p>
                Direct bank transfer. Zero surprises.
              </p>
            </div>

          </div>

        </div>


        <div className="seller-stats">

          <div>
            <strong>2M+</strong>
            <span>Active buyers on TechBazaar</span>
          </div>

          <div>
            <strong>8,000+</strong>
            <span>Verified sellers already growing</span>
          </div>

          <div>
            <strong>50K+</strong>
            <span>Products live and selling daily</span>
          </div>

          <div>
            <strong>₹500Cr+</strong>
            <span>Total GMV processed for sellers</span>
          </div>

        </div>

      </section>
    </>
  );
}
