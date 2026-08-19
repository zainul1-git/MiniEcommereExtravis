import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductById } from "../api/products";
import { useCart } from "../context/CartContext";
export default function ProductDetails() {

     
 

  const { id } = useParams();
   const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let ignore = false;
    setStatus("loading");
    fetchProductById(id)
      .then((data) => {
        if (!ignore) {
          setProduct(data);
          setStatus("ready");
        }
      })
      .catch(() => !ignore && setStatus("error"));
    return () => { ignore = true; };
  }, [id]);

  if (status === "loading") {
    return <p className="mx-auto max-w-6xl px-5 py-10 text-ink-soft sm:px-8">Loading…</p>;
  }

  if (status === "error" || !product) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <p className="text-danger">Product not found.</p>
        <Link to="/products" className="mt-2 inline-block text-primary underline">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <Link to="/products" className="mb-6 inline-block font-mono text-xs text-ink-soft hover:text-primary">
        ← Back to products
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl border border-line bg-paper-dim">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-ink-soft">
            {product.category}
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
            {product.title}
          </h1>
          <p className="mt-3 font-mono text-2xl text-ink">${product.price.toFixed(2)}</p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-soft">
            {product.description}
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className={`h-2 w-2 rounded-full ${product.stock === 0 ? "bg-danger" : "bg-primary"}`} />
            <span className={product.stock === 0 ? "text-danger" : "text-ink-soft"}>
              {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
            </span>
          </div>

          <button
  onClick={() => addItem(product)}
  disabled={product.stock === 0}
  className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-primary-soft disabled:opacity-50"
>
  Add to cart
</button>
        </div>
      </div>
    </div>
  );
}