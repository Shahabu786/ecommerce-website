import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import "./SellerRegistration.css";
import Icon from "../Components/Icon";

const initial = {
  fullName: "",
  businessName: "",
  email: "",
  phone: "",
  pan: "",
  gstin: "",
  accountHolder: "",
  accountNumber: "",
  ifsc: "",
  address: "",
};

function SellerIllustration() {
  return (
    <svg className="seller-illustration" viewBox="0 0 520 410" role="img" aria-label="Seller managing an online store">
      <defs>
        <linearGradient id="sellerBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="sellerDark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#16365f" />
          <stop offset="100%" stopColor="#071426" />
        </linearGradient>
      </defs>
      <circle cx="280" cy="205" r="155" fill="#2563eb" opacity=".10" />
      <circle cx="280" cy="205" r="120" fill="#60a5fa" opacity=".09" />
      <path d="M90 330 Q240 375 420 322" fill="none" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
      {/* storefront */}
      <rect x="285" y="116" width="145" height="194" rx="13" fill="white" stroke="#bfdbfe" strokeWidth="3" />
      <path d="M270 125 L295 72 H420 L445 125 Z" fill="url(#sellerBlue)" />
      <path d="M270 125 Q285 153 305 125 Q325 153 345 125 Q365 153 385 125 Q405 153 425 125 Q435 145 445 125" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
      <rect x="308" y="153" width="98" height="12" rx="6" fill="#dbeafe" />
      <rect x="308" y="177" width="70" height="8" rx="4" fill="#e2e8f0" />
      <rect x="308" y="197" width="98" height="63" rx="7" fill="#eff6ff" />
      <path d="M324 239 L343 219 L359 231 L382 207" fill="none" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="326" y="274" width="48" height="36" rx="5" fill="#bfdbfe" />
      <rect x="382" y="274" width="25" height="36" rx="5" fill="#dbeafe" />
      {/* floating sales card */}
      <rect x="347" y="36" width="116" height="61" rx="12" fill="white" stroke="#dbeafe" strokeWidth="2" />
      <circle cx="367" cy="57" r="8" fill="#22c55e" />
      <path d="M363 57 l3 3 5 -6" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <rect x="383" y="51" width="61" height="6" rx="3" fill="#cbd5e1" />
      <rect x="383" y="64" width="42" height="5" rx="2.5" fill="#dbeafe" />
      <text x="359" y="85" fontSize="11" fontWeight="700" fill="#2563eb">NEW ORDER</text>
      {/* person */}
      <path d="M155 326 Q165 250 211 244 Q257 250 269 326 Z" fill="url(#sellerBlue)" />
      <path d="M184 254 L211 288 L237 254 L226 238 H195 Z" fill="white" />
      <path d="M197 239 L211 264 L225 239" fill="#dbeafe" />
      <rect x="199" y="211" width="25" height="35" rx="10" fill="#d99a72" />
      <ellipse cx="211" cy="181" rx="42" ry="49" fill="#e8ad85" />
      <path d="M169 183 Q158 130 206 126 Q252 126 255 172 L246 190 Q239 160 218 155 Q200 174 174 166 Z" fill="#16365f" />
      <path d="M173 187 Q169 212 190 226 L185 207 Z" fill="#16365f" />
      <circle cx="197" cy="184" r="3" fill="#1e293b" />
      <circle cx="226" cy="184" r="3" fill="#1e293b" />
      <path d="M201 202 Q211 210 222 201" fill="none" stroke="#9a5b43" strokeWidth="3" strokeLinecap="round" />
      {/* laptop */}
      <path d="M128 281 Q128 274 136 274 H198 L215 320 H125 Z" fill="#16365f" />
      <path d="M121 320 H221 L231 331 H112 Z" fill="#60a5fa" />
      <rect x="140" y="284" width="51" height="28" rx="3" fill="#dbeafe" />
      <path d="M149 303 L159 293 L168 300 L181 289" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* parcel */}
      <rect x="54" y="268" width="64" height="57" rx="6" fill="#fbbf24" />
      <path d="M54 284 L86 301 L118 284 M86 301 V325" fill="none" stroke="#d97706" strokeWidth="3" />
      <path d="M74 268 L86 282 L98 268" fill="none" stroke="#d97706" strokeWidth="3" />
      {/* sparkles */}
      <path d="M100 105 V127 M89 116 H111" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" />
      <path d="M448 202 V220 M439 211 H457" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" />
      <circle cx="132" cy="150" r="5" fill="#fbbf24" />
      <circle cx="454" cy="274" r="5" fill="#22c55e" />
    </svg>
  );
}

export default function SellerRegister() {
  const [form, setForm] = useState(initial);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const update = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({
      ...current,
      [name]: ["pan", "gstin", "ifsc"].includes(name) ? value.toUpperCase() : value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      // Form fields -> backend SellerRegistrationRequest
      const digits = form.phone.replace(/\D/g, "");
      const saved = await api.registerSeller({
        fullLegalName: form.fullName.trim(),
        businessName: form.businessName.trim(),
        email: form.email.trim(),
        mobileNumber: digits.slice(-10),
        panNumber: form.pan.trim(),
        gstin: form.gstin.trim(),
        accountHolderName: form.accountHolder.trim(),
        bankAccountNumber: form.accountNumber.trim(),
        ifscCode: form.ifsc.trim(),
        businessAddress: form.address.trim(),
      });
      setResult(saved);
      setSubmitted(true);
      setForm(initial);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="seller-register-page">
        <section className="seller-success-card">
          <div className="seller-success-icon"><Icon name="check" /></div>
          <p className="seller-eyebrow">TECHNEST SELLER PROGRAM</p>
          <h1>Registration submitted!</h1>
          <p>
            Thanks{result?.businessName ? `, ${result.businessName}` : ""}! Your seller application
            (ID #{result?.id}) is <strong>{result?.status || "PENDING"}</strong>. We will contact you at{" "}
            {result?.email} once it is verified.
          </p>
          <div className="seller-success-actions">
            <button type="button" className="seller-primary-btn" onClick={() => setSubmitted(false)}>
              Register another seller
            </button>
            <Link className="seller-outline-btn" to="/">Back to TechNest</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="seller-register-page">
      <div className="seller-register-shell">
        <aside className="seller-visual-panel">
          <Link to="/" className="seller-page-brand">Tech<span>Nest</span></Link>
          <div className="seller-visual-copy">
            <span className="seller-visual-tag"><i /> SELL WITH TECHNEST</span>
            <h1>Your store.<br />Your <em>success story.</em></h1>
            <p>Bring your products online and grow your business with a marketplace built for you.</p>
          </div>
          <div className="seller-art-wrap">
            <div className="seller-watermark">TechNest</div>
            <SellerIllustration />
          </div>
          <div className="seller-visual-points">
            <div><span className="seller-point-icon">↗</span><p><strong>Grow your reach</strong><small>Meet more customers online</small></p></div>
            <div><span className="seller-point-icon"><Icon name="check" /></span><p><strong>Simple onboarding</strong><small>Set up your seller profile</small></p></div>
          </div>
          <div className="seller-panel-footer">A smarter way to sell online <span><Icon name="sparkle" /></span></div>
        </aside>

        <section className="seller-form-panel">
          <div className="seller-mobile-brand"><Link to="/" className="seller-page-brand">Tech<span>Nest</span></Link></div>
          <div className="seller-form-heading">
            <div className="seller-step-label"><span>01</span> SELLER ONBOARDING</div>
            <h2>Create your seller account</h2>
            <p>Enter your details below to get started with TechNest.</p>
            <div className="seller-progress"><span /></div>
            <small className="seller-progress-caption">Seller details <b>•</b> Bank details <b>•</b> Review</small>
          </div>

          <form className="seller-registration-form" onSubmit={submit}>
            {error && (
              <div role="alert" style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "10px 14px", borderRadius: 10, marginBottom: 16, fontSize: 14 }}>
                {error}
              </div>
            )}
            <div className="seller-section-heading">
              <span className="seller-section-icon">01</span>
              <div><h3>Personal & business details</h3><p>Tell us who you are and what you sell.</p></div>
            </div>
            <div className="seller-fields-grid">
              <label>Full legal name <sup>*</sup>
                <input name="fullName" value={form.fullName} onChange={update} required autoComplete="name" placeholder="As per your PAN card" />
              </label>
              <label>Business / store name <sup>*</sup>
                <input name="businessName" value={form.businessName} onChange={update} required placeholder="Your store name" />
              </label>
              <label>Email address <sup>*</sup>
                <input type="email" name="email" value={form.email} onChange={update} required autoComplete="email" placeholder="you@example.com" />
              </label>
              <label>Mobile number <sup>*</sup>
                <input type="tel" name="phone" value={form.phone} onChange={update} required pattern="[0-9+ ()-]{10,16}" placeholder="10-digit phone number" autoComplete="tel" />
              </label>
              <label>PAN number <sup>*</sup>
                <input name="pan" value={form.pan} onChange={update} required maxLength={10} minLength={10} pattern="[A-Z]{5}[0-9]{4}[A-Z]" placeholder="ABCDE1234F" autoComplete="off" />
              </label>
              <label>GSTIN <span className="seller-optional">(if applicable)</span>
                <input name="gstin" value={form.gstin} onChange={update} maxLength={15} minLength={15} pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]" placeholder="15-character GSTIN" autoComplete="off" />
              </label>
            </div>

            <div className="seller-section-heading seller-bank-heading">
              <span className="seller-section-icon">02</span>
              <div><h3>Bank details</h3><p>Used for seller payouts after verification.</p></div>
              <span className="seller-secure-note">▣ Private information</span>
            </div>
            <div className="seller-fields-grid">
              <label>Account holder name <sup>*</sup>
                <input name="accountHolder" value={form.accountHolder} onChange={update} required placeholder="Name as per bank account" autoComplete="off" />
              </label>
              <label>Bank account number <sup>*</sup>
                <input name="accountNumber" value={form.accountNumber} onChange={update} required inputMode="numeric" minLength={9} maxLength={18} pattern="[0-9]{9,18}" placeholder="Enter account number" autoComplete="off" />
              </label>
              <label>IFSC code <sup>*</sup>
                <input name="ifsc" value={form.ifsc} onChange={update} required minLength={11} maxLength={11} pattern="[A-Z]{4}0[A-Z0-9]{6}" placeholder="ABCD0123456" autoComplete="off" />
              </label>
              <label className="seller-full-field">Business address <sup>*</sup>
                <textarea name="address" value={form.address} onChange={update} required rows={3} placeholder="Shop / street, city, state, PIN code" autoComplete="street-address" />
              </label>
            </div>

            <label className="seller-consent">
              <input type="checkbox" required />
              <span>I confirm the information provided is accurate and agree to its verification by TechNest.</span>
            </label>
            <button className="seller-submit-btn" type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit registration"} <span>→</span></button>
            <p className="seller-privacy-note"><span><Icon name="lock" /></span> Your details are sent to the TechNest server for verification.</p>
          </form>
        </section>
      </div>
    </main>
  );
}
