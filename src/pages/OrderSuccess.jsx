import { Link, Navigate, useLocation } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8">
      <h1 className="font-display text-3xl text-ink">Order placed 🎉</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Thanks, {order.customer.fullName.split(" ")[0]}! Your order has been received.
      </p>

      <div className="mt-8 rounded-2xl border border-line bg-white p-6 text-left">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-soft">Order number</span>
          <span className="font-mono text-sm text-ink">{order.id}</span>
        </div>

        <ul className="mt-4 space-y-3">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between text-sm">
              <span className="text-ink-soft">{item.title} × {item.quantity}</span>
              <span className="font-mono text-ink">${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex justify-between border-t border-line pt-4 font-display text-base text-ink">
          <span>Total paid</span>
          <span className="font-mono">${order.total.toFixed(2)}</span>
        </div>
      </div>

      <Link
        to="/products"
        className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-paper hover:bg-primary-soft"
      >
        Continue shopping
      </Link>
    </div>
  );
}