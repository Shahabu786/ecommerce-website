import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopBar from "../Components/TopBar";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import "../App.css";
import Icon from "../Components/Icon";

const SERVICES = [
  { id: "split-ac", name: "Split AC Installation", price: "₹1,299", icon: "❄️", desc: "Wall-mounted split units up to 2 Ton" },
  { id: "window-ac", name: "Window AC Installation", price: "₹799", icon: "🪟", desc: "All window-type AC brands" },
  { id: "cassette-ac", name: "Cassette / Ducted AC", price: "₹2,499", icon: "🏢", desc: "Commercial & ceiling-mounted units" },
  { id: "repair", name: "AC Repair & Servicing", price: "₹499+", icon: "🔧", desc: "Gas refill, cleaning, fault diagnosis" },
  { id: "move", name: "AC Relocation", price: "₹1,999", icon: "📦", desc: "Shift AC to another room or house" },
];

export default function ACInstallation() {
  const { user, cartCount } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    serviceName: "split-ac",
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.contact || "",
    address: "",
    city: "",
    pincode: "",
    acBrand: "",
    acTon: "",
    date: "",
    timeSlot: "morning",
    notes: "",
  });

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setSubmitting(true);
    try {
      await api.bookAcInstallation({
        serviceName: SERVICES.find(s => s.id === form.serviceName)?.name,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        pincode: form.pincode,
        acBrand: form.acBrand,
        acTon: form.acTon,
        date: form.date,
        timeSlot: form.timeSlot,
        notes: form.notes,
      });
      setSubmitted(true);
    } catch (e) {
      alert("Failed to book. Please ensure the backend is running.");
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
            <p className="success-eyebrow">AC INSTALLATION BOOKED</p>
            <h1>Your appointment is confirmed!</h1>
            <p className="form-subtitle">
              A TechNest technician will contact you within 2 hours to confirm
              your {form.date} slot.
            </p>
            <div className="success-details">
              <p><strong>Service:</strong> {SERVICES.find(s => s.id === form.serviceName)?.name}</p>
              <p><strong>Date:</strong> {form.date}</p>
              <p><strong>Time:</strong> {form.timeSlot === "morning" ? "9 AM – 12 PM" : form.timeSlot === "afternoon" ? "12 PM – 3 PM" : "3 PM – 6 PM"}</p>
              <p><strong>Address:</strong> {form.address}, {form.city} - {form.pincode}</p>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button className="primary-btn" onClick={() => setSubmitted(false)}>Book Another</button>
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
      <main className="ac-install-page">
        <div className="ac-install-container">
          {/* HERO */}
          <section className="ac-install-hero">
            <span className="ac-install-eyebrow">PROFESSIONAL SERVICE</span>
            <h1>
              Expert AC <span>Installation</span>
            </h1>
            <p className="ac-install-sub">
              Certified technicians · Same-day service · Free diagnostics · ₹500 off on first booking
            </p>
            <div className="ac-install-stats">
              <div><strong>50+</strong><span>Branches</span></div>
              <div><strong>2M+</strong><span>Installations</span></div>
              <div><strong>4.8★</strong><span>Rating</span></div>
              <div><strong>1hr</strong><span>Response</span></div>
            </div>
          </section>

          {/* SERVICE SELECTOR */}
          <div className="ac-form-shell">
            {/* STEP INDICATOR */}
            <div className="ac-steps">
              {["Service", "Details", "Confirm"].map((label, i) => (
                <div key={label} className={`ac-step ${step >= i + 1 ? "active" : ""}`}>
                  <span className="ac-step-num">{i + 1}</span>
                  <span className="ac-step-label">{label}</span>
                </div>
              ))}
            </div>

            <div className="ac-form-layout">
              {/* LEFT — FORM */}
              <section className="ac-form-card">
                {step === 1 && (
                  <>
                    <h2>Select your service</h2>
                    <p className="form-subtitle">Choose the type of AC service you need.</p>
                    <div className="service-grid">
                      {SERVICES.map((svc) => (
                        <div
                          key={svc.id}
                          className={`service-card ${form.serviceName === svc.id ? "selected" : ""}`}
                          onClick={() => setForm({ ...form, serviceName: svc.id })}
                        >
                          <div className="service-icon"><Icon name={svc.icon} /></div>
                          <h3>{svc.name}</h3>
                          <p>{svc.desc}</p>
                          <strong>{svc.price}</strong>
                        </div>
                      ))}
                    </div>
                    <button className="primary-btn full-width-btn" onClick={() => setStep(2)}>
                      Continue →
                    </button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h2>Your details</h2>
                    <p className="form-subtitle">Where should we send the technician?</p>
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
                        Address <sup>*</sup>
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
                      <label>
                        AC Brand
                        <input name="acBrand" value={form.acBrand} onChange={update} placeholder="e.g. Samsung, LG, Daikin" />
                      </label>
                      <label>
                        AC Type / Ton
                        <select name="acTon" value={form.acTon} onChange={update}>
                          <option value="">Select type</option>
                          <option value="0.8">0.8 Ton</option>
                          <option value="1">1 Ton</option>
                          <option value="1.5">1.5 Ton</option>
                          <option value="2">2 Ton</option>
                          <option value="3">3 Ton</option>
                        </select>
                      </label>
                      <label>
                        Preferred Date <sup>*</sup>
                        <input type="date" name="date" value={form.date} onChange={update} required min={new Date().toISOString().split("T")[0]} />
                      </label>
                      <label>
                        Time Slot <sup>*</sup>
                        <select name="timeSlot" value={form.timeSlot} onChange={update}>
                          <option value="morning">Morning (9 AM – 12 PM)</option>
                          <option value="afternoon">Afternoon (12 PM – 3 PM)</option>
                          <option value="evening">Evening (3 PM – 6 PM)</option>
                        </select>
                      </label>
                      <label className="full-width">
                        Additional notes
                        <textarea name="notes" value={form.notes} onChange={update} rows={2} placeholder="Any specific instructions..." />
                      </label>
                    </div>
                    <div className="form-buttons-row">
                      <button className="secondary-btn" onClick={() => setStep(1)}>← Back</button>
                      <button className="primary-btn" onClick={() => setStep(3)}>Review Booking →</button>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <h2>Review & confirm</h2>
                    <p className="form-subtitle">Please verify your booking details before confirming.</p>
                    <div className="booking-summary">
                      <div className="summary-row"><span>Service</span><strong>{SERVICES.find(s => s.id === form.serviceName)?.name}</strong></div>
                      <div className="summary-row"><span>Name</span><strong>{form.fullName}</strong></div>
                      <div className="summary-row"><span>Phone</span><strong>{form.phone}</strong></div>
                      <div className="summary-row"><span>Email</span><strong>{form.email}</strong></div>
                      <div className="summary-row full"><span>Address</span><strong>{form.address}, {form.city} - {form.pincode}</strong></div>
                      <div className="summary-row"><span>Date</span><strong>{form.date}</strong></div>
                      <div className="summary-row"><span>Time</span><strong>{form.timeSlot === "morning" ? "9 AM – 12 PM" : form.timeSlot === "afternoon" ? "12 PM – 3 PM" : "3 PM – 6 PM"}</strong></div>
                      {form.acBrand && <div className="summary-row"><span>AC Brand</span><strong>{form.acBrand}</strong></div>}
                      {form.acTon && <div className="summary-row"><span>AC Type</span><strong>{form.acTon} Ton</strong></div>}
                      {form.notes && <div className="summary-row full"><span>Notes</span><strong>{form.notes}</strong></div>}
                      <div className="summary-divider" />
                      <div className="summary-total"><span>Service charge</span><strong>{SERVICES.find(s => s.id === form.serviceName)?.price}</strong></div>
                    </div>
                    <div className="form-buttons-row">
                      <button className="secondary-btn" onClick={() => setStep(2)}>← Edit</button>
                      <button className="primary-btn" onClick={submit} disabled={submitting}>
                        {submitting ? "Booking…" : "Confirm Booking →"}
                      </button>
                    </div>
                  </>
                )}
              </section>

              {/* RIGHT — INFO PANEL */}
              <aside className="ac-info-panel">
                <div className="info-card">
                  <h3>Why choose TechNest?</h3>
                  <ul className="info-list">
                    <li><span className="info-check"><Icon name="check" /></span>Certified & background-verified technicians</li>
                    <li><span className="info-check"><Icon name="check" /></span>Same-day installation in most cities</li>
                    <li><span className="info-check"><Icon name="check" /></span>₹500 off on your first booking</li>
                    <li><span className="info-check"><Icon name="check" /></span>Free post-installation service call</li>
                    <li><span className="info-check"><Icon name="check" /></span>90-day service warranty</li>
                    <li><span className="info-check"><Icon name="check" /></span>No hidden charges — fixed pricing</li>
                  </ul>
                </div>
                <div className="info-card info-card-highlight">
                  <h3><Icon name="fire" /> Limited offer</h3>
                  <p>Free gas refill with every new AC installation booked this month. Hurry — limited slots available!</p>
                </div>
                <div className="info-card">
                  <h3>Need help?</h3>
                  <p>Call our support team:</p>
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
