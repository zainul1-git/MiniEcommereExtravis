const BASE_URL = "https://dummyjson.com";

export async function fetchProducts({ search = "", category = "", limit = 12, skip = 0 } = {}) {
  let url;

  if (category) {
    url = `${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=100&skip=0`;
  } else if (search) {
    url = `${BASE_URL}/products/search?q=${encodeURIComponent(search)}&limit=100&skip=0`;
  } else {
    url = `${BASE_URL}/products?limit=${limit}&skip=${skip}`;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load products (${res.status})`);
  }
  const data = await res.json();
  let products = data.products || [];

  if (category && search) {
    const q = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (category || search) {
    const total = products.length;
    const page = products.slice(skip, skip + limit);
    return { products: page, total };
  }

  return { products, total: data.total };
}

export async function fetchProductById(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to load product (${res.status})`);
  }
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/products/categories`);
  if (!res.ok) {
    throw new Error(`Failed to load categories (${res.status})`);
  }
  const data = await res.json();
  return data.map((c) => (typeof c === "string" ? { slug: c, name: c } : c));
}