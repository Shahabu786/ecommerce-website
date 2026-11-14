import React from "react";
import Icon from "./Icon";

export default function Benefits({}) {
  return (
    <>
      <section className="benefits" id="benefits">

        <div>
          <Icon name="truck" />
          <div>
            <strong>Free Delivery</strong>
            <span>On orders above ₹999</span>
          </div>
        </div>

        <div>
          <Icon name="refresh" />
          <div>
            <strong>7-Day Returns</strong>
            <span>No-questions-asked</span>
          </div>
        </div>

        <div>
          <Icon name="check-circle" />
          <div>
            <strong>100% Genuine</strong>
            <span>8,000+ verified sellers</span>
          </div>
        </div>

        <div>
          <Icon name="credit-card" />
          <div>
            <strong>No-Cost EMI</strong>
            <span>On major bank cards</span>
          </div>
        </div>

      </section>
    </>
  );
}
