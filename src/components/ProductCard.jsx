import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
   <div className="group overflow-hidden rounded-2xl border border-line bg-surface">
      <Link to={`/products/${product.id}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-paper-dim">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(product);
            }}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-colors hover:bg-white"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={wishlisted ? "var(--color-danger)" : "none"}
              stroke={wishlisted ? "var(--color-danger)" : "var(--color-ink-soft)"}
              strokeWidth="2"
            >
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
          </button>
        </div>
      </Link>

      <div className="p-4">
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
          {product.category}
        </p>
        <Link to={`/products/${product.id}`}>
          <h3 className="mt-1 font-display text-lg leading-snug text-ink line-clamp-2">
            {product.title}
          </h3>
        </Link>
        <div className="mt-3 flex items-center justify-between">
          <p className="font-mono text-base text-ink">${product.price.toFixed(2)}</p>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="rounded-full border border-primary px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary hover:text-paper disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}