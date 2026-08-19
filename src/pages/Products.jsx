import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, fetchCategories } from "../api/products";
import { useDebounce } from "../hooks/useDebounce";
import ProductCard from "../components/ProductCard";

const PAGE_SIZE = 12;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page") || "1");

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 400);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("loading");

  function updateParams(patch) {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (!value) next.delete(key);
      else next.set(key, value);
    });
    setSearchParams(next);
  }

  useEffect(() => {
    if (debouncedSearch !== search) {
      updateParams({ q: debouncedSearch || undefined, page: undefined });
    }
    // eslint-disable-next-line
  }, [debouncedSearch]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    let ignore = false;
    setStatus("loading");
    const skip = (page - 1) * PAGE_SIZE;

    fetchProducts({ search, category, limit: PAGE_SIZE, skip })
      .then((data) => {
        if (ignore) return;
        let items = data.products;
        if (sort === "price-asc") items = [...items].sort((a, b) => a.price - b.price);
        if (sort === "price-desc") items = [...items].sort((a, b) => b.price - a.price);
        setProducts(items);
        setTotal(data.total);
        setStatus("ready");
      })
      .catch(() => !ignore && setStatus("error"));

    return () => { ignore = true; };
  }, [search, category, sort, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <h1 className="mb-8 font-display text-3xl text-ink">Products</h1>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search products…"
          className="w-full rounded-full border border-line bg-white px-4 py-2.5 text-sm sm:max-w-xs"
        />

        <div className="flex gap-3">
          <select
            value={category}
            onChange={(e) => updateParams({ category: e.target.value, page: undefined })}
            className="rounded-full border border-line bg-white px-4 py-2.5 text-sm"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value || undefined })}
            className="rounded-full border border-line bg-white px-4 py-2.5 text-sm"
          >
            <option value="">Sort: Featured</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
          </select>
        </div>
      </div>

      {status === "loading" && <p className="text-ink-soft">Loading products…</p>}
      {status === "error" && <p className="text-danger">Something went wrong. Please try again.</p>}
      {status === "ready" && products.length === 0 && (
        <p className="text-ink-soft">No products found.</p>
      )}

      {status === "ready" && products.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              onClick={() => updateParams({ page: page - 1 === 1 ? undefined : page - 1 })}
              disabled={page === 1}
              className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-40"
            >
              Prev
            </button>
            <span className="font-mono text-sm text-ink-soft">{page} / {totalPages}</span>
            <button
              onClick={() => updateParams({ page: page + 1 })}
              disabled={page === totalPages}
              className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}