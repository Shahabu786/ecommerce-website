import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import "../App.css";

const money = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(n) || 0);

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return undefined;
    let active = true;
    api
      .ordersByUser(user.id)
      .then((rows) => { if (active) setOrders(rows); })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [user?.id]);

  const cancel = async (id) => {
    setError("");
    try {
      const updated = await api.cancelOrder(id);
      setOrders((rows) => rows.map((row) => (row.id === id ? updated : row)));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) {
    return (
      <main className="simple-page">
        <h1>My Orders</h1>
        <p>Please log in to view your orders.</p>
        <Link to="/login" className="primary-btn link-button">Login</Link>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <Link to="/" className="catalog-back">← Home</Link>
      <h1>My Orders</h1>
      {error && <p className="form-message" role="alert">{error}</p>}
      {orders === null && !error && <p>Loading orders…</p>}
      {orders?.length === 0 && (
        <p>You have no orders yet. <Link to="/products">Start shopping →</Link></p>
      )}
      {orders?.map((order) => (
        <article className="order-card" key={order.id}>
          <header>
            <div>
              <strong>Order #{order.id}</strong>
              <small>{order.orderDate ? new Date(order.orderDate).toLocaleString("en-IN") : ""}</small>
            </div>
            <span className={`order-status status-${String(order.orderStatus).toLowerCase()}`}>{order.orderStatus}</span>
          </header>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                <span>{item.productName} × {item.quantity}</span>
                <span>{money(item.purchasePrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <footer>
            <span>
              {order.paymentMethod} · Payment {order.paymentStatus || "—"}
              {order.shippingAddress ? ` · ${order.shippingAddress}` : ""}
            </span>
            <strong>{money(order.totalAmount)}</strong>
          </footer>
          {["PLACED", "CONFIRMED"].includes(order.orderStatus) && (
            <button className="order-cancel" onClick={() => cancel(order.id)}>Cancel order</button>
          )}
        </article>
      ))}
    </main>
  );
}
