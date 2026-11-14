
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Icon from "../Components/Icon";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  contact: "",
  address: "",
};

export default function Login() {
  // Default mode is signup so the page matches the signup screenshot
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();
  const isSignup = mode === "signup";

  const change = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    if (isSignup && !form.name.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    if (isSignup && !form.contact.trim()) {
      setMessage("Please enter your contact number.");
      return;
    }

    if (isSignup && !form.address.trim()) {
      setMessage("Please enter your address.");
      return;
    }

    if (isSignup && !agreed) {
      setMessage("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        const saved = await api.register({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          contact: form.contact.trim(),
          address: form.address.trim(),
          role: "CUSTOMER",
        });

        if (!saved) {
          throw new Error("Could not create the account.");
        }

        setMessage("Account created! Please click Login now.");
        setMode("login");
        setAgreed(false);
        setForm({
          ...emptyForm,
          email: saved.email || form.email.trim().toLowerCase(),
        });
      } else {
        if (typeof api.login !== "function") {
          setMessage(
            "Login API is not configured yet. A secure login endpoint needs to be added in the backend."
          );
          return;
        }

        const result = await api.login({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        });

        if (!result?.user) {
          throw new Error("No user data was found in the login response.");
        }

        auth.login({ ...result.user, cartId: result.cartId });

        navigate("/");
      }
    } catch (error) {
      const errorText = error?.message || "Unknown error";

      if (
        errorText.includes("Failed to fetch") ||
        errorText.includes("NetworkError")
      ) {
        setMessage(
          "Cannot connect to the backend. Please check Spring Boot, MySQL and the API URL."
        );
      } else {
        setMessage(errorText);
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode((current) =>
      current === "signup" ? "login" : "signup"
    );
    setForm(emptyForm);
    setMessage("");
    setAgreed(false);
  };

  return (
    <main className="auth-page">
      <div className="auth-layout">
        {/* LEFT SIDE */}
        <section className="auth-intro">
          <span className="auth-eyebrow">JOIN TECHNEST</span>

          <h1>
            Tech Nest
            <span>Starts Here</span>
          </h1>

          <p className="auth-description">
            Create your account and get access to exclusive offers,
            personalized recommendations and a better shopping
            experience.
          </p>

          <div className="auth-benefits">
            <div className="auth-benefit">
              <span className="benefit-icon"><Icon name="gift" /></span>
              <div>
                <strong>Exclusive Member Offers</strong>
                <p>Get special discounts and deals</p>
              </div>
            </div>

            <div className="auth-benefit">
              <span className="benefit-icon"><Icon name="gift" /></span>
              <div>
                <strong>Track Your Orders</strong>
                <p>Stay updated in real-time</p>
              </div>
            </div>

            <div className="auth-benefit">
              <span className="benefit-icon"><Icon name="heart" /></span>
              <div>
                <strong>Secure Shopping</strong>
                <p>Your data is always protected</p>
              </div>
            </div>
          </div>

          <div className="auth-visual">
            <div className="auth-circle" />
            <img
              src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=85"
              alt="Headphones and electronic gadgets"
            />
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="auth-form-side">
          <form className="auth-card" onSubmit={submit}>
            <Link to="/" className="auth-brand">
              Tech<strong>Nest</strong>
            </Link>

            <p className="auth-form-eyebrow">
              {isSignup ? "CREATE YOUR ACCOUNT" : "WELCOME BACK"}
            </p>

            <h2>
              {isSignup ? (
                <>
                  Welcome to <span>Tech Nest</span>
                </>
              ) : (
                <>
                  Welcome <span>Back!</span>
                </>
              )}
            </h2>

            <p className="auth-form-subtitle">
              {isSignup
                ? "Fill in your details to get started."
                : "Sign in to continue shopping with TechNest."}
            </p>

            {isSignup && (
              <label className="auth-field">
                <span>Full Name <b>*</b></span>
                <span className="auth-input-wrap">
                  <span className="auth-field-icon"><Icon name="user" /></span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={change}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    maxLength={100}
                    required
                  />
                </span>
              </label>
            )}

            <label className="auth-field">
              <span>Email Address <b>*</b></span>
              <span className="auth-input-wrap">
                <span className="auth-field-icon"><Icon name="mail" /></span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={change}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  maxLength={150}
                  required
                />
              </span>
            </label>

            <label className="auth-field">
              <span>Password <b>*</b></span>
              <span className="auth-input-wrap">
                <span className="auth-field-icon"><Icon name="user" /></span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={change}
                  placeholder="Create a strong password"
                  autoComplete={
                    isSignup ? "new-password" : "current-password"
                  }
                  minLength={6}
                  required
                />
              </span>
            </label>

            {isSignup && (
              <>
                <label className="auth-field">
                  <span>Contact Number <b>*</b></span>
                  <span className="auth-input-wrap">
                    <span className="auth-field-icon"><Icon name="gift" /></span>
                    <input
                      type="tel"
                      name="contact"
                      value={form.contact}
                      onChange={change}
                      placeholder="Enter your mobile number"
                      autoComplete="tel"
                      required
                    />
                  </span>
                </label>

                <label className="auth-field">
                  <span>Address <b>*</b></span>
                  <span className="auth-input-wrap auth-textarea-wrap">
                    <span className="auth-field-icon">⌖</span>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={change}
                      placeholder="Enter your full address"
                      autoComplete="street-address"
                      rows={2}
                      required
                    />
                  </span>
                </label>

                <label className="auth-consent">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <span>
                    I agree to the <a href="#terms">Terms of Service</a>
                    {" "}and <a href="#privacy">Privacy Policy</a>.
                  </span>
                </label>
              </>
            )}

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isSignup
                  ? "Create Account  →"
                  : "Sign In  →"}
            </button>

            {message && (
              <p className="auth-message" role="status">
                {message}
              </p>
            )}

            <p className="auth-switch">
              {isSignup
                ? "Already have an account?"
                : "Don't have an account?"}
              {" "}
              <button
                type="button"
                onClick={switchMode}
                disabled={loading}
              >
                {isSignup ? "Login" : "Create account"}
              </button>
            </p>

            <div className="auth-security">
              <span className="auth-lock">▣</span>
              <div>
                <strong>Your information is safe with us.</strong>
                <p>We take your privacy and security seriously.</p>
              </div>
            </div>

            <button
              type="button"
              className="auth-seller-link"
              onClick={() => navigate("/seller/register")}
            >
              Register as a Seller
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
