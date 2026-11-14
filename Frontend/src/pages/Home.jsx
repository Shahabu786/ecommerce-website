import "../App.css";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { useCatalogue } from "../hooks/useCatalogue";
import { splitCatalogue } from "../services/api";
import TopBar from "../Components/TopBar";
import Navbar from "../Components/Navbar";
import CategoryNav from "../Components/CategoryNav";
import HeroSection from "../Components/HeroSection";
import Benefits from "../Components/Benefits";
import Ticker from "../Components/Ticker";
import CategoriesSection from "../Components/CategoriesSection";
import PromoCards from "../Components/PromoCards";
import DealsSection from "../Components/DealsSection";
import BestsellersSection from "../Components/BestsellersSection";
import NewArrivalsSection from "../Components/NewArrivalsSection";
import SellerSection from "../Components/SellerSection";
import Footer from "../Components/Footer";
import ProductCard from "../Components/ProductCard";
import { PRODUCT_IMAGES, CATEGORY_PHOTOS } from "../data/productImages";
import { products as demoProducts } from "../data/products";
import Icon from "../Components/Icon";


function Home() {

  // -----------------------------
  // STATES
  // -----------------------------
 const { cartCount, addToCart } = useCart();
  const { products: liveProducts, error: catalogueError } = useCatalogue();


  const [search, setSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarCategory, setSidebarCategory] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");

  // Category clicks use the same smooth landing as the hero Shop Now button.
  const selectCategoryAndShowDeals = (category) => {
    setActiveCategory(category);
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        document.getElementById("deals")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 80);
    });
  };

  const [time, setTime] = useState({
    hours: 9,
    minutes: 27,
    seconds: 57,
  });


  // -----------------------------
  // COUNTDOWN TIMER
  // -----------------------------

  useEffect(() => {

    const timer = setInterval(() => {

      setTime((prev) => {

        let hours = prev.hours;
        let minutes = prev.minutes;
        let seconds = prev.seconds;

        if (seconds > 0) {
          seconds--;
        } else {

          seconds = 59;

          if (minutes > 0) {
            minutes--;
          } else {

            minutes = 59;

            if (hours > 0) {
              hours--;
            }

          }

        }

        return {
          hours,
          minutes,
          seconds,
        };

      });

    }, 1000);


    return () => clearInterval(timer);

  }, []);


  // -----------------------------
  // CATEGORIES
  // -----------------------------

  const categories = [
    {
      name: "Air Conditioners",
      icon: "❄️",
      image: PRODUCT_IMAGES["samsung-split-ac"],
      count: "3,200+",
    },
    {
      name: "Refrigerators",
      icon: "🧊",
      image: PRODUCT_IMAGES["whirlpool-fridge"],
      count: "2,800+",
    },
    {
      name: "Televisions",
      icon: "📺",
      image: PRODUCT_IMAGES["lg-4k-smart-tv"],
      count: "4,100+",
    },
    {
      name: "Mobile Phones",
      icon: "📱",
      image: PRODUCT_IMAGES["oneplus-12"],
      count: "6,500+",
    },
    {
      name: "Air Coolers",
      icon: "🌀",
      image: PRODUCT_IMAGES["symphony-cooler"],
      count: "1,400+",
    },
    {
      name: "Fans",
      icon: "🪭",
      image: PRODUCT_IMAGES["crompton-fan"],
      count: "1,900+",
    },
    {
      name: "Washing Machines",
      icon: "🫧",
      image: PRODUCT_IMAGES["lg-washing-machine"],
      count: "1,700+",
    },
    {
      name: "Laptops",
      icon: "💻",
      image: PRODUCT_IMAGES["macbook-air-m3"],
      count: "3,800+",
    },
  ];


  // -----------------------------
  // DEAL PRODUCTS
  // -----------------------------

  const dealProducts = [
    {
      brand: "SAMSUNG",
      name: "Samsung 1.5 Ton 5★ Inverter Split AC 2024 Wi-Fi",
      price: "₹34,499",
      oldPrice: "₹62,499",
      discount: "45% OFF",
      icon: "❄️",
      category: "Air Conditioners",
      badge: "EMI",
    },

    {
      brand: "LG",
      name: "LG 43” 4K UHD Smart TV with ThinQ AI & WebOS",
      price: "₹28,999",
      oldPrice: "₹46,999",
      discount: "38% OFF",
      icon: "📺",
      category: "Televisions",
      badge: "HOT DEAL",
    },

    {
      brand: "ONEPLUS",
      name: "OnePlus 12 5G 16GB+512GB Silky Black",
      price: "₹54,999",
      oldPrice: "₹69,999",
      discount: "31% OFF",
      icon: "📱",
      category: "Mobile Phones",
      badge: "SALE",
    },

    {
      brand: "WHIRLPOOL",
      name: "Whirlpool 265L Double Door Frost-Free Refrigerator",
      price: "₹24,899",
      oldPrice: "₹34,999",
      discount: "28% OFF",
      icon: "🧊",
      category: "Refrigerators",
      badge: "SALE",
    },

    {
      brand: "SYMPHONY",
      name: "Symphony Diet 50i 50L Wi-Fi Desert Cooler + Remote",
      price: "₹12,499",
      oldPrice: "₹15,999",
      discount: "22% OFF",
      icon: "🌀",
      category: "Air Coolers",
      badge: "NEW",
    },
  ];


  // -----------------------------
  // BESTSELLER PRODUCTS
  // -----------------------------

  const bestProducts = [
    {
      brand: "CROMPTON",
      name: "Crompton Aura Prime 1200mm BLDC Ceiling Fan + Remote",
      price: "₹4,299",
      oldPrice: "₹5,990",
      discount: "28% off",
      icon: "🪭",
      category: "Fans",
      rating: "4.6",
      reviews: "4,210",
      badge: "BESTSELLER",
    },

    {
      brand: "SONY",
      name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
      price: "₹24,990",
      oldPrice: "₹38,990",
      discount: "Save ₹14,000",
      icon: "🎧",
      category: "Audio",
      rating: "4.9",
      reviews: "7,840",
      badge: "36% OFF",
    },

    {
      brand: "APPLE",
      name: "Apple Watch Series 9 GPS 45mm Midnight Aluminium",
      price: "₹41,900",
      oldPrice: "₹44,900",
      discount: "₹3,000 off",
      icon: "⌚",
      category: "Smartwatches",
      rating: "4.8",
      reviews: "3,120",
      badge: "NEW LAUNCH",
    },

    {
      brand: "LG",
      name: "LG 7kg 5★ Inverter Fully Auto Front Load Washing Machine",
      price: "₹28,490",
      oldPrice: "₹47,490",
      discount: "Save ₹19,000",
      icon: "🫧",
      category: "Washing Machines",
      rating: "4.5",
      reviews: "1,650",
      badge: "40% OFF",
    },

    {
      brand: "CANON",
      name: "Canon EOS R50 Mirrorless Camera with 18-45mm Lens Kit",
      price: "₹62,495",
      oldPrice: "₹74,995",
      discount: "17% off",
      icon: "📷",
      category: "Cameras",
      rating: "4.6",
      reviews: "980",
      badge: "NO-COST EMI",
    },
  ];


  // -----------------------------
  // NEW ARRIVALS
  // -----------------------------

  const newProducts = [
    {
      brand: "SAMSUNG",
      name: "Samsung Galaxy S24 Ultra 5G 12GB+256GB Titanium Black",
      price: "₹1,24,999",
      oldPrice: "₹1,34,999",
      discount: "7% OFF",
      icon: "📱",
      category: "Mobile Phones",
      rating: "4.9",
      reviews: "1,200",
      badge: "NEW",
    },

    {
      brand: "APPLE",
      name: 'Apple MacBook Air M3 13" 8GB RAM 256GB SSD Midnight',
      price: "₹1,14,900",
      oldPrice: "₹1,19,900",
      discount: "₹5,000 off",
      icon: "💻",
      category: "Laptops",
      rating: "4.9",
      reviews: "892",
      badge: "NEW",
    },

    {
      brand: "SONY",
      name: 'Sony Bravia 55" OLED 4K Ultra HD Smart Google TV',
      price: "₹1,09,990",
      oldPrice: "₹1,29,990",
      discount: "Save ₹20K",
      icon: "📺",
      category: "Televisions",
      rating: "4.8",
      reviews: "432",
      badge: "NEW",
    },

    {
      brand: "DAIKIN",
      name: "Daikin 2 Ton 5★ Wi-Fi Inverter Split AC 2024 Model",
      price: "₹49,990",
      oldPrice: "₹56,990",
      discount: "12% off",
      icon: "❄️",
      category: "Air Conditioners",
      rating: "4.6",
      reviews: "678",
      badge: "NEW",
    },
  ];



  // -----------------------------
  // FILTER PRODUCTS
  // -----------------------------

  const filterProducts = (products) => {

    return products.filter((product) => {

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" ||
        product.category === activeCategory;

      return matchesSearch && matchesCategory;

    });

  };


  const liveSections = splitCatalogue(liveProducts);

  const allProducts = useMemo(() => {
    const list = liveProducts || [...demoProducts];
    return list.filter((p) => {
      const textMatch = `${p.name} ${p.brand || ""} ${p.category || ""}`.toLowerCase().includes(search.trim().toLowerCase());
      const catMatch = sidebarCategory === "All" ||
        p.category === sidebarCategory ||
        (sidebarCategory === "Mobiles & Accessories" && (p.category === "Mobile Phones" || p.category === "Accessories" || p.category === "Wearables")) ||
        (sidebarCategory === "Computers & Laptops" && (p.category === "Laptops" || p.category === "Monitors" || p.category === "Computers")) ||
        (sidebarCategory === "TV & Audio" && (p.category === "Televisions" || p.category === "Audio"));
      return textMatch && catMatch;
    });
  }, [search, sidebarCategory, liveProducts]);

  const filteredDeals = filterProducts(liveSections ? liveSections.deals : dealProducts);

  const filteredBest = filterProducts(liveSections ? liveSections.best : bestProducts);

  const filteredNew = filterProducts(liveSections ? liveSections.fresh : newProducts);


  // -----------------------------
  // JSX
  // -----------------------------

  const sidebarCategories = [
    { id: "All", name: "All Products", image: CATEGORY_PHOTOS["All Products"], count: allProducts.length },
    { id: "Electronics", name: "Electronics", image: CATEGORY_PHOTOS.Electronics },
    { id: "Mobile Phones", name: "Mobiles & Accessories", image: CATEGORY_PHOTOS["Mobiles & Accessories"] },
    { id: "Laptops", name: "Computers & Laptops", image: CATEGORY_PHOTOS["Computers & Laptops"] },
    { id: "Air Conditioners", name: "Home Appliances", image: CATEGORY_PHOTOS["Home Appliances"] },
    { id: "Televisions", name: "TV & Audio", image: CATEGORY_PHOTOS["TV & Audio"] },
    { id: "Audio", name: "Accessories", image: CATEGORY_PHOTOS.Accessories },
  ];

  return (

    <div className="app">

      <TopBar />
      {catalogueError && <div className="backend-notice" role="alert"><Icon name="alert" /> Could not connect to the backend — showing demo products. Please start Spring Boot (port 8484) and MySQL.</div>}
      <Navbar
        search={search}
        setSearch={setSearch}
        cartCount={cartCount}
        products={liveProducts || [...demoProducts]}
        onMenuClick={() => setShowSidebar(true)}
      />

      {showSidebar && (
        <>
          <div className="sidebar-overlay" onClick={() => setShowSidebar(false)} />
          <aside className="sidebar-categories-panel">
            <div className="sidebar-panel-header">
              <span className="sidebar-panel-icon"><Icon name="menu" /></span>
              <h3>Categories</h3>
              <button className="sidebar-close-btn" onClick={() => setShowSidebar(false)}><Icon name="close" /></button>
            </div>
            <div className="sidebar-panel-list">
              {sidebarCategories.map((cat) => {
                const isActive = sidebarCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`sidebar-panel-item ${isActive ? "active" : ""}`}
                    onClick={() => setSidebarCategory(cat.id)}
                  >
                    <div className="sidebar-item-left">
                      <span className="sidebar-item-icon">{cat.image ? <img src={cat.image} alt="" loading="lazy" /> : <Icon name={cat.icon} />}</span>
                      <span className="sidebar-item-name">{cat.name}</span>
                    </div>
                    <div className="sidebar-item-right">
                      {cat.count !== undefined && <span className="sidebar-item-count">{cat.count}</span>}
                      <span className="sidebar-item-arrow">›</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        </>
      )}

      {!showSidebar ? (
        <>
          <CategoryNav categories={categories} activeCategory={activeCategory} setActiveCategory={selectCategoryAndShowDeals} />
          <HeroSection />
          <Benefits />
          <Ticker />
          <CategoriesSection categories={categories} activeCategory={activeCategory} setActiveCategory={selectCategoryAndShowDeals} />
          <PromoCards />
          <DealsSection time={time} filteredDeals={filteredDeals} addToCart={addToCart} />
          <BestsellersSection filteredBest={filteredBest} addToCart={addToCart} />
          <NewArrivalsSection filteredNew={filteredNew} addToCart={addToCart} />
          <SellerSection />
        </>
      ) : (
        <div className="sidebar-products-view">
          <div className="sidebar-products-header">
            <h2>{sidebarCategories.find((c) => c.id === sidebarCategory)?.name || "Products"}</h2>
            <span className="sidebar-products-count">{allProducts.length} products found</span>
          </div>
          {allProducts.length > 0 ? (
            <div className="sidebar-products-grid">
              {allProducts.map((product) => (
                <ProductCard key={product.id || product.name} product={product} addToCart={addToCart} />
              ))}
            </div>
          ) : (
            <div className="sidebar-empty-state">
              <p>No products found for this category.</p>
              <button className="primary-btn" onClick={() => setSidebarCategory("All")}>Show All Products</button>
            </div>
          )}
        </div>
      )}

      <Footer />

    </div>

  );
}


export default Home;