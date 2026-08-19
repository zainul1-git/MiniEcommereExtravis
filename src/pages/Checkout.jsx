import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
};

function validate(form) {
  const errors = {};

  if (!form.fullName.trim()) errors.fullName = "Full name is required.";
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email.";

  if (!form.phone.trim()) errors.phone = "Phone is required.";
  else if (!/^[0-9+\-\s()]{7,20}$/.test(form.phone)) errors.phone = "Enter a valid phone number.";

  if (!form.address.trim()) errors.address = "Address is required.";
  if (!form.city.trim()) errors.city = "City is required.";

  if (!form.postalCode.trim()) errors.postalCode = "Postal code is required.";
  else if (!/^[A-Za-z0-9\- ]{3,10}$/.test(form.postalCode)) errors.postalCode = "Enter a valid postal code.";

  return errors;
}

const fields = [
  { name: "fullName", label: "Full name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "address", label: "Address", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "postalCode", label: "Postal code", type: "text" },
];

export default function Checkout() {
  const { items, subtotal, shipping, total, clear } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleBlur(e) {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
    setErrors(validate(form));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched(Object.fromEntries(fields.map((f) => [f.name, true])));

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setTimeout(() => {
      const order = {
        id: `ORD-${Date.now().toString().slice(-8)}`,
        items,
        total,
        customer: form,
      };
      clear();
      setSubmitting(false);
      navigate("/order-success", { state: { order } });
    }, 700);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <h1 className="mb-8 font-display text-3xl text-ink">Checkout</h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="mb-1.5 block text-sm text-ink">
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={form[field.name]}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink focus:border-primary ${
                  touched[field.name] && errors[field.name] ? "border-danger" : "border-line"
                }`}
              />
              {touched[field.name] && errors[field.name] && (
                <p className="mt-1.5 text-xs text-danger">{errors[field.name]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-paper hover:bg-primary-soft disabled:opacity-60"
          >
            {submitting ? "Placing order…" : `Place order · $${total.toFixed(2)}`}
          </button>
        </form>

        <div className="h-fit rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-lg text-ink">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-ink-soft">
                  {item.title} <span className="font-mono">× {item.quantity}</span>
                </span>
                <span className="font-mono text-ink">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-soft">Subtotal</span>
              <span className="font-mono text-ink">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Shipping</span>
              <span className="font-mono text-ink">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-2 font-display text-base text-ink">
              <span>Total</span>
              <span className="font-mono">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}