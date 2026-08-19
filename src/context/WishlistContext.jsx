import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const WishlistContext = createContext(null);
const STORAGE_KEY = "marque_wishlist_v1";

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { items: JSON.parse(raw) };
  } catch {
    // corrupt data mile toh fresh start
  }
  return { items: [] };
}

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE": {
      const { product } = action.payload;
      const exists = state.items.find((i) => i.id === product.id);

      if (exists) {
        return { items: state.items.filter((i) => i.id !== product.id) };
      }

      return {
        items: [
          ...state.items,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            category: product.category,
            rating: product.rating,
            stock: product.stock,
          },
        ],
      };
    }

    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.payload.id) };

    case "CLEAR":
      return { items: [] };

    default:
      return state;
  }
}

export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const api = useMemo(() => {
    const ids = new Set(state.items.map((i) => i.id));

    return {
      items: state.items,
      count: state.items.length,
      isWishlisted: (id) => ids.has(id),
      toggle: (product) => dispatch({ type: "TOGGLE", payload: { product } }),
      remove: (id) => dispatch({ type: "REMOVE", payload: { id } }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state.items]);

  return <WishlistContext.Provider value={api}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}