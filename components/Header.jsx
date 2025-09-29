"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { useState, useMemo } from "react";
import CartSheet from "./CartSheet";

export default function Header() {
  const { cart } = useCart();
  const { theme, toggleTheme } = useTheme(); //Toggle nel context
  const [showCart, setShowCart] = useState(false);

  //Calcolo totale quantità nel carrello
  const cartCount = useMemo(
    () => cart.reduce((sum, p) => sum + p.qty, 0),
    [cart]
  );

  return (
    <header className="header">
      <Link href="/" className="logo">
        ShopLite-China
      </Link>
      <nav className="nav">
        <Link href="/checkout" className="nav-link">
          Checkout
        </Link>

        <button
          onClick={() => setShowCart((prev) => !prev)}
          aria-label="Apri carrello"
          title="Apri carrello"
        >
          🛒 {cartCount}
        </button>

        <button
          onClick={toggleTheme}
          aria-label="Cambia tema"
          title="Cambia tema"
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </nav>

      {showCart && <CartSheet onClose={() => setShowCart(false)} />}
    </header>
  );
}
