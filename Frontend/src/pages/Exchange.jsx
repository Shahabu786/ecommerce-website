import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopBar from "../Components/TopBar";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import "../App.css";
import Icon from "../Components/Icon";

const EXCHANGE_CATEGORIES = [
  { id: "ac", name: "Air Conditioner", icon: "❄️", maxValue: "₹15,000", desc: "Split, window & portable ACs" },
  { id: "fridge", name: "Refrigerator", icon: "🧊", maxValue: "₹12,000", desc: "Single & double door fridges" },
  { id: "tv", name: "Television", icon: "📺", maxValue: "₹10,000", desc: "LED, LCD & Smart TVs" },
  { id: "washing", name: "Washing Machine", icon: "🫧", maxValue: "₹8,000", desc: "Front & top load machines" },
  { id: "microwave", name: "Microwave Oven", icon: "🍳", maxValue: "₹3,000", desc: "Convection & solo microwaves" },
  { id: "other", name: "Other Appliances", icon: "🔌", maxValue: "₹2,000", desc: "AC accessories & more" },
];

export default function Exchange() {
  const { user, cartCount } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    category: "",
    brand: "",
    model: "",
    age: "",
    condition: "working",
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.contact || "",
    address: "",
    city: "",
    pincode: "",
    notes: "",
  });

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setSubmitting(true);
    try {
      await api.submitExchange({
        category: form.category,
        brand: form.brand,
        model: form.model,
        age: form.age,
        condition: form.condition,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        pincode: form.pincode,
        notes: form.notes,
      });
      setSubmitted(true);
    } catch (e) {
      alert("Failed to submit. Please ensure the backend is running.");
    } finally {
      setSubmitting(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <div className="app">
        <TopBar />
        <Navbar search={search} setSearch={setSearch} cartCount={cartCount} />
        <main className="form-page">
          <section className="form-card success-card">
            <div className="success-icon"><Icon name="check" /></div>
            <p className="success-eyebrow">EXCHANGE REQUEST SUBMITTED</p>
            <h1>Your item has been booked for exchange!</h1>
            <p className="form-subtitle">
              A TechNest executive will visit your location to inspect the old appliance and finalize your exchange value.
            </p>
            <div className="success-details">
              <p><strong>Category:</strong> {EXCHANGE_CATEGORIES.find(c => c.id === form.category)?.name}</p>
              <p><strong>Brand:</strong> {form.brand}</p>
              <p><strong>Condition:</strong> {form.condition === "working" ? "Working" : form.condition === "needs-repair" ? "Needs Repair" : "Poor"}</p>
              <p><strong>Date:</strong> {form.date || "To be confirmed"}</p>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button className="primary-btn" onClick={() => setSubmitted(false)}>Submit Another</button>
              <Link to="/" className="secondary-btn" style={{ textDecoration: "none", textAlign: "center" }}>Back to Home</Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <TopBar />
      <Navbar search={search} setSearch={setSearch} cartCount={cartCount} />
      <main className="exchange-page">
        <div className="exchange-container">
          {/* HERO */}
          <section className="exchange-hero">
            <span className="exchange-eyebrow">SAVE MORE, GROW LESS</span>
            <h1>
              Old for New <span>Exchange</span>
            </h1>
            <p className="exchange-sub">
              Trade in your old appliance and get up to ₹15,000 extra off on your new purchase.
              Free doorstep pickup — no hassle, no hidden charges.
            </p>
            <div className="exchange-stats">
              <div><strong>₹15K</strong><span>Max Discount</span></div>
              <div><strong>Free</strong><span>Doorstep Pickup</span></div>
              <div><strong>Same Day</strong><span>Exchange</span></div>
              <div><strong>50+</strong><span>Cities</span></div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="exchange-how-section">
            <h2>How it works</h2>
            <div className="exchange-steps-row">
              {[
                { num: "01", title: "Tell us what you have", desc: "Select your appliance type and condition" },
                { num: "02", title: "Get an instant estimate", desc: "Receive your exchange value within minutes" },
                { num: "03", title: "Schedule a pickup", desc: "We collect your old appliance at your convenience" },
                { num: "04", title: "Get discount on new purchase", desc: "Apply your exchange value as discount" },
              ].map((s) => (
                <div key={s.num} className="exchange-step-card">
                  <div className="exchange-step-num">{s.num}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FORM */}
          <div className="exchange-form-shell">
            <div className="exchange-form-layout">
              {/* LEFT — FORM */}
              <section className="exchange-form-card">
                {step === 1 && (
                  <>
                    <h2>What are you exchanging?</h2>
                    <p className="form-subtitle">Select the category of your old appliance.</p>
                    <div className="exchange-grid">
                      {EXCHANGE_CATEGORIES.map((cat) => (
                        <div
                          key={cat.id}
                          className={`exchange-cat-card ${form.category === cat.id ? "selected" : ""}`}
                          onClick={() => setForm({ ...form, category: cat.id })}
                        >
                          <div className="exchange-cat-icon"><Icon name={cat.icon} /></div>
                          <h3>{cat.name}</h3>
                          <p>{cat.desc}</p>
                          <strong>Up to {cat.maxValue}</strong>
                        </div>
                      ))}
                    </div>
                    <button className="primary-btn full-width-btn" onClick={() => setStep(2)}>Continue →</button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h2>Appliance details</h2>
                    <p className="form-subtitle">Tell us about the condition of your old appliance.</p>
                    <div className="form-grid">
                      <label>
                        Brand <sup>*</sup>
                        <input name="brand" value={form.brand} onChange={update} required placeholder="e.g. Samsung, LG" />
                      </label>
                      <label>
                        Model / Series
                        <input name="model" value={form.model} onChange={update} placeholder="e.g. AR18, 43UT8050" />
                      </label>
                      <label className="full-width">
                        Age of appliance <sup>*</sup>
                        <select name="age" value={form.age} onChange={update} required>
                          <option value="">Select age range</option>
                          <option value="<1">Less than 1 year</option>
                          <option value="1-2">1 – 2 years</option>
                          <option value="2-4">2 – 4 years</option>
                          <option value="4-6">4 – 6 years</option>
                          <option value="6+">More than 6 years</option>
                        </select>
                      </label>
                      <label className="full-width">
                        Condition <sup>*</sup>
                        <div className="condition-options">
                          {["working", "needs-repair", "poor"].map((c) => (
                            <div
                              key={c}
                              className={`condition-card ${form.condition === c ? "selected" : ""}`}
                              onClick={() => setForm({ ...form, condition: c })}
                            >
                              <span className="condition-emoji"><Icon name={c === "working" ? "check-circle" : c === "needs-repair" ? "alert" : "x-circle"} /></span>
                              <strong>{c === "working" ? "Working" : c === "needs-repair" ? "Needs Repair" : "Poor"}</strong>
                              <small>{c === "working" ? "Runs perfectly" : c === "needs-repair" ? "Has minor issues" : "Does not work"}</small>
                            </div>
                          ))}
                        </div>
                      </label>
                      <label className="full-width">
                        Additional notes
                        <textarea name="notes" value={form.notes} onChange={update} rows={2} placeholder="Any issues, defects, or missing parts..." />
                      </label>
                    </div>
                    <div className="form-buttons-row">
                      <button className="secondary-btn" onClick={() => setStep(1)}>← Back</button>
                      <button className="primary-btn" onClick={() => setStep(3)}>Continue →</button>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <h2>Your contact details</h2>
                    <p className="form-subtitle">Where should we pick up your old appliance?</p>
                    <div className="form-grid">
                      <label className="full-width">
                        Full name <sup>*</sup>
                        <input name="fullName" value={form.fullName} onChange={update} required placeholder="Enter your full name" autoComplete="name" />
                      </label>
                      <label>
                        Email <sup>*</sup>
                        <input type="email" name="email" value={form.email} onChange={update} required placeholder="you@example.com" autoComplete="email" />
                      </label>
                      <label>
                        Phone <sup>*</sup>
                        <input type="tel" name="phone" value={form.phone} onChange={update} required placeholder="+91 XXXXX XXXXX" autoComplete="tel" />
                      </label>
                      <label className="full-width">
                        Pickup address <sup>*</sup>
                        <textarea name="address" value={form.address} onChange={update} required rows={2} placeholder="House / Flat / Building No." autoComplete="street-address" />
                      </label>
                      <label>
                        City <sup>*</sup>
                        <input name="city" value={form.city} onChange={update} required placeholder="City" autoComplete="address-level2" />
                      </label>
                      <label>
                        Pincode <sup>*</sup>
                        <input name="pincode" value={form.pincode} onChange={update} required placeholder="6-digit pincode" maxLength={6} pattern="[0-9]{6}" inputMode="numeric" autoComplete="postal-code" />
                      </label>
                    </div>
                    <div className="form-buttons-row">
                      <button className="secondary-btn" onClick={() => setStep(2)}>← Back</button>
                      <button className="primary-btn" onClick={() => setStep(4)}>Review Booking →</button>
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <h2>Review & confirm</h2>
                    <p className="form-subtitle">Please verify your exchange details before submitting.</p>
                    <div className="booking-summary">
                      <div className="summary-row"><span>Category</span><strong>{EXCHANGE_CATEGORIES.find(c => c.id === form.category)?.name}</strong></div>
                      <div className="summary-row"><span>Brand</span><strong>{form.brand}</strong></div>
                      {form.model && <div className="summary-row"><span>Model</span><strong>{form.model}</strong></div>}
                      <div className="summary-row"><span>Age</span><strong>{form.age}</strong></div>
                      <div className="summary-row"><span>Condition</span><strong>{form.condition === "working" ? "Working" : form.condition === "needs-repair" ? "Needs Repair" : "Poor"}</strong></div>
                      <div className="summary-row"><span>Name</span><strong>{form.fullName}</strong></div>
                      <div className="summary-row"><span>Phone</span><strong>{form.phone}</strong></div>
                      <div className="summary-row full"><span>Address</span><strong>{form.address}, {form.city} - {form.pincode}</strong></div>
                      {form.notes && <div className="summary-row full"><span>Notes</span><strong>{form.notes}</strong></div>}
                      <div className="summary-divider" />
                      <div className="summary-total"><span>Estimated exchange value</span><strong>{EXCHANGE_CATEGORIES.find(c => c.id === form.category)?.maxValue}</strong></div>
                    </div>
                    <div className="form-buttons-row">
                      <button className="secondary-btn" onClick={() => setStep(3)}>← Edit</button>
                      <button className="primary-btn" onClick={submit} disabled={submitting}>
                        {submitting ? "Submitting…" : "Submit Exchange Request →"}
                      </button>
                    </div>
                  </>
                )}
              </section>

              {/* RIGHT — INFO PANEL */}
              <aside className="exchange-info-panel">
                <div className="exchange-info-card">
                  <h3><Icon name="refresh" /> How exchange works</h3>
                  <p>When you place an order for a new product, select "Exchange" at checkout. We'll pick up your old appliance and give you an instant discount on the new one.</p>
                </div>
                <div className="exchange-info-card exchange-info-highlight">
                  <h3><Icon name="rupee" /> Estimated values</h3>
                  <ul className="exchange-value-list">
                    {EXCHANGE_CATEGORIES.map((cat) => (
                      <li key={cat.id}><span><Icon name={cat.icon} /> {cat.name}</span><strong>Up to {cat.maxValue}</strong></li>
                    ))}
                  </ul>
                </div>
                <div className="exchange-info-card">
                  <h3><Icon name="clipboard" /> What to bring</h3>
                  <ul className="info-list">
                    <li><span className="info-check"><Icon name="check" /></span>All original accessories & remote</li>
                    <li><span className="info-check"><Icon name="check" /></span>Original invoice / bill (if available)</li>
                    <li><span className="info-check"><Icon name="check" /></span>Power cord & wall mount (for ACs)</li>
                    <li><span className="info-check"><Icon name="check" /></span>No major damage or missing parts</li>
                  </ul>
                </div>
                <div className="exchange-info-card">
                  <h3>Need help?</h3>
                  <a href="tel:+919876543210" className="info-phone">+91 98765 43210</a>
                  <p className="info-hours">Mon–Sat, 8 AM – 8 PM</p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
