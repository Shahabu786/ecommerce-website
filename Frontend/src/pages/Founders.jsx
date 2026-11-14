import { useState } from "react";
import TopBar from "../Components/TopBar";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useCart } from "../context/CartContext";
import "../App.css";
import "./Founders.css";
import Icon from "../Components/Icon";

// ============================================================
// FOUNDERS DATA
// ]
// ============================================================
const founders = [
  { name: "Shahabudin Ansari",photo:"C:\Crud Project\Frontend\src\pages\Shahabu.jpg "},
  { name: "Sunil Yadav", photo: "C:\Crud Project\Frontend\src\pages\sunil.jpeg" },       
  { name: "Abhishek Yadav", photo: "C:\Crud Project\Frontend\src\pages\abhishek yadav.jpeg" },    
  { name: "Gunjan Raj", photo: "C:\Crud Project\Frontend\src\pages\Gunjan.jpeg" },         
];
export default function Founders() {
  const [search, setSearch] = useState("");
  const { cartCount } = useCart();

  return (
    <>
      <TopBar />
      <Navbar search={search} setSearch={setSearch} cartCount={cartCount || 0} products={[]} />

      <main className="founders-page">
        {/* Page ka heading */}
        <section className="founders-header">
          <p className="founders-eyebrow">THE TEAM BEHIND TECHNEST</p>
          <h1>
            Meet Our <span>Founders</span>
          </h1>
          <p className="founders-sub">
            The people who built Tech Nest from an idea into a marketplace.
          </p>
        </section>

        {/* Founders ki list: har founder ka gol (circle) photo aur uske neeche naam */}
        <section className="founders-grid">
          {founders.map((f) => (
            <article className="founder-card" key={f.name}>
              {/* Gol photo wala section — photo khali hai, aap apni image yahan lagayenge */}
              <div className="founder-photo">
                {f.photo ? (
                  <img src={f.photo} alt={f.name} />
                ) : (
                  <span className="founder-placeholder" aria-hidden="true"><Icon name="user" /></span>
                )}
              </div>

              {/* Founder ka naam */}
              <h3 className="founder-name">{f.name}</h3>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}
