import React from "react";
import Icon from "./Icon";

export default function CategoryNav({categories, activeCategory, setActiveCategory}) {
  return (
    <>
      <div className="category-nav">

        {categories.slice(0, 6).map((category) => (

          <button
            key={category.name}
            onClick={() => setActiveCategory(category.name)}
            aria-label={`Show ${category.name} deals`}
            className={
              activeCategory === category.name
                ? "category-nav-item active"
                : "category-nav-item"
            }
          >

            <span className="category-nav-image">
              {category.image ? (
                <img src={category.image} alt="" loading="lazy" />
              ) : <Icon name={category.icon} />}
            </span>

            {category.name}

          </button>

        ))}

      </div>
    </>
  );
}
