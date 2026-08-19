import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function Wishlist() {
  const { items, remove } = useWishlist();
  const { addItem } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-20 text-center sm:px-8">
        <p className="font-display text-2xl text-ink">Your wishlist is empty</p>
        <p className="mt-2 text-sm text-ink-soft">
          Tap the heart on any product to save it here.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="mt-6 rounded-full border border-primary px-6 py-2.5 text-sm font-medium text-primary hover:bg-primary hover:text-paper"
        >
          Browse products
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <h1 className="mb-8 font-display text-3xl text-ink">Your wishlist</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl border border-line bg-white">
            <Link to={`/products/${item.id}`}>
              <div className="aspect-[4/5] overflow-hidden bg-paper-dim">
                <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
              </div>
            </Link>

            <div className="p-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                {item.category}
              </p>
              <Link to={`/products/${item.id}`}>
                <h3 className="mt-1 font-display text-lg leading-snug text-ink line-clamp-2">
                  {item.title}
                </h3>
              </Link>

              <div className="mt-3 flex items-center justify-between">
                <p className="font-mono text-base text-ink">${item.price.toFixed(2)}</p>
                <button
                  onClick={() => remove(item.id)}
                  className="font-mono text-xs text-ink-soft hover:text-danger"
                >
                  Remove
                </button>
              </div>

              <button
                onClick={() => addItem(item)}
                disabled={item.stock === 0}
                className="mt-3 w-full rounded-full border border-primary px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary hover:text-paper disabled:opacity-40"
              >
                {item.stock === 0 ? "Sold out" : "Add to cart"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}