import React from "react";
import ProductCard from "./ProductCard";
import Icon from "./Icon";

export default function BestsellersSection({filteredBest, addToCart}) {
  return (
    <>
      <section className="dark-section bestseller-section">

        <div className="section-heading dark-heading">

          <div>

            <small><Icon name="fire" /> TRENDING</small>

            <h2>
              Bestsellers <em>Right Now</em>
            </h2>

          </div>

          <button>
            View All →
          </button>

        </div>


        <div className="products-grid">

          {filteredBest.map((product) => (

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
