import { useEffect, useState } from "react";
import { api, toFrontendProduct } from "../services/api";

/** Loads products from the backend. `products` is null while loading, empty or when the API is unreachable. */
export function useCatalogue() {
  const [state, setState] = useState({ products: null, loading: true, error: "" });
  useEffect(() => {
    let active = true;
    api
      .products()
      .then((rows) => {
        if (!active) return;
        const list = Array.isArray(rows) && rows.length ? rows.map(toFrontendProduct) : null;
        setState({ products: list, loading: false, error: "" });
      })
      .catch((error) => {
        if (active) setState({ products: null, loading: false, error: error.message });
      });
    return () => {
      active = false;
    };
  }, []);
  return state;
}
