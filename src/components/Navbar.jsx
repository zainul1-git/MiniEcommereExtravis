import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";
const navLinkClass = ({ isActive }) =>
  `text-sm tracking-wide transition-colors ${
    isActive ? "text-primary" : "text-ink-soft hover:text-ink"
  }`;

export default function Navbar() {
    const { itemCount } = useCart();
    const { count: wishlistCount } = useWishlist();
    const { theme, toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur dark:border-line dark:bg-paper/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <NavLink to="/" className="font-display text-2xl font-semibold tracking-tight text-ink">
          Marque
        </NavLink>

       <nav className="hidden items-center gap-7 sm:flex">
  <NavLink to="/" end className={navLinkClass}>
    Home
  </NavLink>
  <NavLink to="/products" className={navLinkClass}>
    Products
  </NavLink>
  <NavLink to="/wishlist" className={navLinkClass}>
    Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
  </NavLink>
</nav>

 <button
  onClick={toggleTheme}
  aria-label="Toggle dark mode"
  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-primary hover:text-ink"
>
  {theme === "dark" ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )}
</button>

        <NavLink
          to="/cart"
          className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink transition-colors hover:border-primary"
        >
          Cart
         <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 font-mono text-xs text-paper">
  {itemCount}
</span>
        </NavLink>
      </div>
    </header>
  );
}