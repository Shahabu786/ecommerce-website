import React from "react";
import ProductCard from "./ProductCard";
import Icon from "./Icon";

export default function DealsSection({time, filteredDeals, addToCart}) {
  return (
    <>
      <section
        className="dark-section"
        id="deals"
      >

        <div className="deal-header">

          <div>

            <div className="section-label">
              <Icon name="fire" />
            </div>

            <h2>
              Deals of the Day
            </h2>

            <p>
              Lightning deals refreshed every 24 hours
            </p>

          </div>


          <div className="timer">

            <div>
              <strong>
                {String(time.hours).padStart(2, "0")}
              </strong>

              <small>HOURS</small>
            </div>

            <span>:</span>

            <div>
              <strong>
                {String(time.minutes).padStart(2, "0")}
              </strong>

              <small>MINS</small>
            </div>

            <span>:</span>

            <div>
              <strong>
                {String(time.seconds).padStart(2, "0")}
              </strong>

              <small>SECS</small>
            </div>

          </div>

        </div>


        <div className="products-grid">

          {filteredDeals.map((product) => (

            <ProductCard
              key={product.name}
              product={product}
              addToCart={addToCart}
            />

          ))}

        </div>

      </section>
    </>
  );
}
