import React from "react";
import Icon from "./Icon";

export default function CategoriesSection({categories, activeCategory, setActiveCategory}) {
  return (
    <>
      <section className="section categories-section">

        <div className="section-heading">

          <div>

            <small>BROWSE</small>

            <h2>
              Shop by <em>Category</em>
            </h2>

          </div>

          <button>
            All Categories →
          </button>

        </div>


        <div className="categories-grid">

          {categories.map((category) => (

            <div
              key={category.name}
              className={
                activeCategory === category.name
                  ? "category-card selected"
                  : "category-card"
              }
              role="button"
              tabIndex={0}
              aria-label={`Shop ${category.name} deals`}
              onClick={() => setActiveCategory(category.name)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveCategory(category.name);
                }
              }}
            >

              <div className="category-icon">
                {category.image ? (
                  <img src={category.image} alt={category.name} loading="lazy" />
                ) : <Icon name={category.icon} />}
              </div>

              <h3>
                {category.name}
              </h3>

              <p>
                {category.count}
              </p>

            </div>

          ))}

        </div>

      </section>
    </>
  );
}
