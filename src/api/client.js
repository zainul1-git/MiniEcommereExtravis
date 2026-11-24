const envBaseUrl = import.meta.env?.VITE_API_BASE_URL;

// Agar .env mein value set hai toh woh use hogi, warna fallback base URL chalega
export const API_BASE_URL = (
  envBaseUrl ||
  "https://prod-main-api-704464-00tre1p1erm.compute.instacloud-edge.com/api/v1"
).replace(/\/+$/, "");

export async function apiGet(path = "") {
  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  const url = `${API_BASE_URL}${cleanPath}`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`Invalid JSON response (HTTP ${response.status})`);
  }

  // Agar HTTP status error ho ya API ne success: false bheja ho
  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || `Request failed (HTTP ${response.status})`);
  }

  // FreeAPI envelope mein asli data "data" key ke andar hota hai
  return payload && typeof payload === "object" && "data" in payload
    ? payload.data
    : payload;
}