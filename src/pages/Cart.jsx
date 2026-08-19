import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, subtotal, shipping, total, increment, decrement, removeItem } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-20 text-center sm:px-8">
        <p className="font-display text-2xl text-ink">Your cart is empty</p>
        <p className="mt-2 text-sm text-ink-soft">
          Add a few things you like and they'll show up here.
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
      <h1 className="mb-8 font-display text-3xl text-ink">Your cart</h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-line border-y border-line">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-5">
              <Link
                to={`/products/${item.id}`}
                className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-line bg-paper-dim"
              >
                <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <Link to={`/products/${item.id}`} className="font-display text-base text-ink hover:text-primary">
                    {item.title}
                  </Link>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="font-mono text-xs text-ink-soft hover:text-danger"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-line">
                    <button onClick={() => decrement(item.id)} className="px-3 py-1 text-ink-soft hover:text-ink">
                      −
                    </button>
                    <span className="w-8 text-center font-mono text-sm">{item.quantity}</span>
                    <button onClick={() => increment(item.id)} className="px-3 py-1 text-ink-soft hover:text-ink">
                      +
                    </button>
                  </div>
                  <span className="font-mono text-sm text-ink">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-lg text-ink">Order summary</h2>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd className="font-mono text-ink">${subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Shipping</dt>
              <dd className="font-mono text-ink">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd>
            </div>
          </dl>

          <div className="mt-4 flex justify-between border-t border-line pt-4">
            <span className="font-display text-base text-ink">Total</span>
            <span className="font-mono text-base text-ink">${total.toFixed(2)}</span>
          </div>

          <Link
            to="/checkout"
            className="mt-6 block rounded-full bg-primary px-6 py-3 text-center text-sm font-medium text-paper hover:bg-primary-soft"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}