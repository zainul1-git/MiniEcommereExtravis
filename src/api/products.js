// const BASE_URL = "https://dummyjson.com";

// export async function fetchProducts({ search = "", category = "", limit = 12, skip = 0 } = {}) {
//   let url;

//   if (category) {
//     url = `${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=100&skip=0`;
//   } else if (search) {
//     url = `${BASE_URL}/products/search?q=${encodeURIComponent(search)}&limit=100&skip=0`;
//   } else {
//     url = `${BASE_URL}/products?limit=${limit}&skip=${skip}`;
//   }

//   const res = await fetch(url);
//   if (!res.ok) {
//     throw new Error(`Failed to load products (${res.status})`);
//   }
//   const data = await res.json();
//   let products = data.products || [];

//   if (category && search) {
//     const q = search.toLowerCase();
//     products = products.filter(
//       (p) =>
//         p.title.toLowerCase().includes(q) ||
//         p.description.toLowerCase().includes(q)
//     );
//   }

//   if (category || search) {
//     const total = products.length;
//     const page = products.slice(skip, skip + limit);
//     return { products: page, total };
//   }

//   return { products, total: data.total };
// }

// export async function fetchProductById(id) {
//   const res = await fetch(`${BASE_URL}/products/${id}`);
//   if (!res.ok) {
//     throw new Error(`Failed to load product (${res.status})`);
//   }
//   return res.json();
// }

// export async function fetchCategories() {
//   const res = await fetch(`${BASE_URL}/products/categories`);
//   if (!res.ok) {
//     throw new Error(`Failed to load categories (${res.status})`);
//   }
//   const data = await res.json();
//   return data.map((c) => (typeof c === "string" ? { slug: c, name: c } : c));
// }




import { apiGet } from "./client";

// Base URL (.env / client.js) ke baad ka endpoint path
const RANDOM_QUOTE_ENDPOINT = "/public/quotes/quote/random";

function toSlug(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Quote JSON -> MiniEcommerce Product object alignment
// function createCardImageDataUrl(label = "Product", categoryLabel = "Featured") {
//   const safeLabel = String(label).replace(/[<>&"]/g, "");
//   const safeCategory = String(categoryLabel).replace(/[<>&"]/g, "");

//   const svg = `
//     <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
//       <rect width="600" height="400" fill="#f3efe6" />
//       <rect x="28" y="28" width="544" height="344" rx="18" fill="#ffffff" stroke="#dcd6c8" stroke-width="2" />
//       <text x="60" y="95" font-family="sans-serif" font-size="18" font-weight="600" fill="#6b655c">${safeCategory.toUpperCase()}</text>
//       <text x="60" y="195" font-family="sans-serif" font-size="34" font-weight="700" fill="#1c1917">${safeLabel}</text>
//       <text x="60" y="245" font-family="sans-serif" font-size="18" fill="#57534e">MiniEcommerce • API Integrated Item</text>
//     </svg>
//   `.trim();

//   return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
// }
function createProductImageDataUrl({ category = "Featured" }) {
  if (typeof document === "undefined") {
    return "";
  }

  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 1000;
  const ctx = canvas.getContext("2d");

  if (!ctx) return "";

  // Soft background
  ctx.fillStyle = "#f4f1ea";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Inner frame
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(44, 44, canvas.width - 88, canvas.height - 88);

  // Subtle category pill text at top-left
  ctx.fillStyle = "#78716c";
  ctx.font = "600 24px monospace";
  ctx.fillText(String(category).toUpperCase(), 84, 120);

  // Center emblem
  ctx.fillStyle = "#eae5da";
  ctx.beginPath();
  ctx.arc(400, 500, 165, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#1c1917";
  ctx.font = "700 72px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ME", 400, 526);
  ctx.textAlign = "left";

  return canvas.toDataURL("image/png");
}

export function mapQuoteToProduct(quote, index = 0) {

  const item = quote && typeof quote === "object" ? quote : {};
  const id = item.id ?? index + 1;

  const firstTag =
    Array.isArray(item.tags) && item.tags.length > 0
      ? String(item.tags[0])
      : "Featured";

  const categorySlug = toSlug(firstTag) || "featured";
  const price = 15 + ((Number(id) || index + 1) % 20) * 5;
  // const title = `Signature Edition #${id}`;
  // const imageUrl = createCardImageDataUrl(title, firstTag);

          const title = `Signature Edition #${id}`;
const imageUrl = createProductImageDataUrl({ category: firstTag });


  return {

    id,
    title,
    subtitle: item.author ? `Curated by ${item.author}` : "Curated Item",
    description: item.content || "No description available.",
    price,
    category: categorySlug,
    categoryName: firstTag,
    thumbnail: imageUrl,
    images: [imageUrl],
    quoteMeta: {
      author: item.author || "Unknown",
      authorSlug: item.authorSlug || "",
      tags: Array.isArray(item.tags) ? item.tags : [],
      length: item.length ?? (item.content ? item.content.length : 0),
    },
  };
}

// Multiple random quotes la kar catalog banata hai taake list/search/filter/pagination kaam kare
async function fetchQuoteCatalog(count = 8) {
  const requests = Array.from({ length: count }, () =>
    apiGet(RANDOM_QUOTE_ENDPOINT)
  );
  const quotes = await Promise.all(requests);
  return quotes.map((quote, idx) => mapQuoteToProduct(quote, idx));
}

export async function fetchProducts({
  search = "",
  category = "",
  limit = 12,
  skip = 0,
} = {}) {
  let items = await fetchQuoteCatalog(8);

  if (category) {
    const target = category.toLowerCase();
    items = items.filter(
      (p) =>
        p.category.toLowerCase() === target ||
        p.categoryName.toLowerCase() === target
    );
  }

  if (search) {
    const q = search.toLowerCase().trim();
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
    );
  }

  const total = items.length;
  const products = items.slice(skip, skip + limit);

  return { products, total };
}

export async function fetchProductById(id) {
  const items = await fetchQuoteCatalog(8);
  const found = items.find((p) => String(p.id) === String(id));
  if (found) return found;

  const singleQuote = await apiGet(RANDOM_QUOTE_ENDPOINT);
  return mapQuoteToProduct({ ...singleQuote, id });
}

export async function fetchCategories() {
  const items = await fetchQuoteCatalog(8);
  const map = new Map();

  for (const p of items) {
    if (!map.has(p.category)) {
      map.set(p.category, { slug: p.category, name: p.categoryName });
    }
  }

  return Array.from(map.values());
}