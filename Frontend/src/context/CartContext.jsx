import { createContext, useContext, useEffect, useRef, useState } from "react";
import { api, dbId, toFrontendProduct } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const keyOf = (item) => item.id || item.name;
const isRejected = (error) => [400, 404, 409].includes(error?.status);
const fromServerItem = (serverItem) => ({
  ...toFrontendProduct(serverItem.product),
  cartItemId: serverItem.id,
  quantity: serverItem.quantity,
});

function getSavedCart() {
  try {
    const savedCart = localStorage.getItem("technest-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
}

/**
 * Guests: the cart lives in localStorage only.
 * Logged-in users: every change on a database product is mirrored to the backend
 * (cart + cart-items tables), and the server cart is loaded again after login.
 */
export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(getSavedCart);
  const [cartMessage, setCartMessage] = useState("");
  const itemsRef = useRef(cartItems);
  const cartIdRef = useRef(null);
  const syncedUserRef = useRef(null);

  useEffect(() => {
    itemsRef.current = cartItems;
    try { localStorage.setItem("technest-cart", JSON.stringify(cartItems)); } catch { /* storage can be disabled in the browser */ }
  }, [cartItems]);

  async function getCartId() {
    if (cartIdRef.current) return cartIdRef.current;
    const cart = await api.cartByUser(user.id);
    cartIdRef.current = cart.id;
    return cart.id;
  }

  // After login: merge the guest cart into the user's server cart, then show the server cart.
  useEffect(() => {
    if (!user?.id) {
      syncedUserRef.current = null;
      cartIdRef.current = null;
      return;
    }
    if (syncedUserRef.current === user.id) return;
    syncedUserRef.current = user.id;
    (async () => {
      try {
        const serverCart = await api.cartByUser(user.id);
        cartIdRef.current = serverCart.id;
        const local = itemsRef.current;
        let serverItems = serverCart.items;
        let pushed = false;
        for (const item of local) {
          const productId = dbId(item);
          if (productId === null || serverItems.some((s) => s.productId === productId)) continue;
          try {
            await api.addCartItem({ cartId: serverCart.id, productId, quantity: item.quantity });
            pushed = true;
          } catch {
            /* e.g. not enough stock: skip this item */
          }
        }
        if (pushed) serverItems = (await api.cartByUser(user.id)).items;
        const demoOnly = local.filter((item) => dbId(item) === null);
        setCartItems([...serverItems.map(fromServerItem), ...demoOnly]);
      } catch {
        /* backend offline: keep the local cart */
      }
    })();
  }, [user?.id]);

  async function syncAdd(product, productId) {
    try {
      const cartId = await getCartId();
      const saved = await api.addCartItem({ cartId, productId, quantity: 1 });
      setCartItems((items) =>
        items.map((item) =>
          keyOf(item) === keyOf(product) ? { ...item, cartItemId: saved.id, quantity: saved.quantity } : item
        )
      );
      return { ok: true };
    } catch (error) {
      if (!isRejected(error)) return { ok: true }; // backend unreachable: keep the local cart
      setCartItems((items) =>
        items.flatMap((item) => {
          if (keyOf(item) !== keyOf(product)) return [item];
          const quantity = item.quantity - 1;
          return quantity > 0 ? [{ ...item, quantity }] : [];
        })
      );
      setCartMessage(error.message);
      return { ok: false, message: error.message };
    }
  }

  async function addToCart(product) {
    setCartMessage("");
    setCartItems((currentItems) => {
      const existing = currentItems.find((item) => keyOf(item) === (product.id || product.name));

      if (existing) {
        return currentItems.map((item) =>
          keyOf(item) === (product.id || product.name)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
    const productId = dbId(product);
    if (user?.id && productId !== null) return syncAdd(product, productId);
    return { ok: true };
  }

  function updateQuantity(key, amount) {
    const current = itemsRef.current.find((item) => keyOf(item) === key);
    setCartItems((items) =>
      items
        .map((item) =>
          keyOf(item) === key
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
    if (user?.id && current?.cartItemId) {
      const next = current.quantity + amount;
      const request = next > 0
        ? api.updateCartItem(current.cartItemId, { productId: dbId(current), quantity: next })
        : api.deleteCartItem(current.cartItemId);
      request.catch((error) => {
        if (!isRejected(error)) return;
        setCartItems((items) =>
          items.map((item) => (keyOf(item) === key ? { ...item, quantity: current.quantity } : item))
        );
        setCartMessage(error.message);
      });
    }
  }

  function removeFromCart(key) {
    const current = itemsRef.current.find((item) => keyOf(item) === key);
    setCartItems((items) => items.filter((item) => keyOf(item) !== key));
    if (user?.id && current?.cartItemId) {
      api.deleteCartItem(current.cartItemId).catch(() => {});
    }
  }

  // remote:false is used after checkout (the backend already emptied the cart) and on sign out.
  function clearCart({ remote = true } = {}) {
    setCartItems([]);
    setCartMessage("");
    itemsRef.current = [];
    try { localStorage.removeItem("technest-cart"); } catch { /* storage can be disabled */ }
    try { sessionStorage.removeItem("technest-last-product"); } catch { /* storage can be disabled */ }
    if (remote && user?.id) {
      getCartId()
        .then((cartId) => api.clearCart(cartId))
        .catch(() => {});
    }
  }

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(String(item.price).replace(/[₹,\s]/g, "")) *
        item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        cartMessage,
        clearCartMessage: () => setCartMessage(""),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
