import React from "react";
import ProductCard from "./ProductCard";

export default function NewArrivalsSection({filteredNew, addToCart}) {
  return (
    <>
      <section className="section new-arrivals">

        <div className="section-heading">

          <div>

            <small>JUST LANDED</small>

            <h2>
              New <em>Arrivals</em>
            </h2>

          </div>

          <button>
            See All →
          </button>

        </div>


        <div className="products-grid">

          {filteredNew.map((product) => (

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
