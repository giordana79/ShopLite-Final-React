"use client";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useState } from "react";

export default function ProductCard({ product }) {
  const { cart, addToCart, errorMsgs, requestNotification } = useCart();
  const { toggleWishlist, wishlist } = useWishlist();
  const [email, setEmail] = useState("");
  const [notifyMsg, setNotifyMsg] = useState("");

  const inWishlist = wishlist.some((p) => p.id === product.id);
  const isOutOfStock = product.stock <= 0;
  const inCart = cart.find((c) => c.id === product.id);
  const isMaxed = inCart && inCart.qty >= product.stock;

  const handleNotify = () => {
    if (!email) {
      setNotifyMsg("⚠️ Inserisci la tua email!");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setNotifyMsg("⚠️ Email non valida!");
      return;
    }
    requestNotification(product.id, email);
    setNotifyMsg("✅ Ti avviseremo quando sarà disponibile!");
    setEmail("");
    setTimeout(() => setNotifyMsg(""), 3000); //Reset messaggio dopo 3s
  };

  return (
    <div className="card">
      <img src={product.images[0]} alt={`Immagine di ${product.title}`} />
      <h3>{product.title}</h3>
      <p>€ {product.price.toFixed(2)}</p>

      <p>
        {isOutOfStock ? (
          <span className="out-of-stock">Prodotto esaurito</span>
        ) : (
          `Disponibilità: ${product.stock}`
        )}
      </p>

      {/* Errore specifico per il prodotto */}
      {errorMsgs[product.id] && (
        <p className="error">{errorMsgs[product.id]}</p>
      )}

      <div className="actions">
        <button
          onClick={() => addToCart(product)}
          disabled={isOutOfStock || isMaxed}
          aria-label="Aggiungi al carrello"
          title="Aggiungi al carrello"
        >
          {isMaxed ? "Quantità massima" : "🛒 Aggiungi"}
        </button>

        <button
          onClick={() => toggleWishlist(product)}
          aria-label={
            inWishlist ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"
          }
          title={inWishlist ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
        >
          {inWishlist ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Form "Avvisami" se esaurito */}
      {isOutOfStock && (
        <div className="notify">
          <input
            type="email"
            placeholder="La tua email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleNotify}>Avvisami</button>
        </div>
      )}

      {/* Messaggio di conferma/errore per notifica */}
      {notifyMsg && (
        <p
          className={`message ${
            notifyMsg.startsWith("✅") ? "success" : "error"
          }`}
        >
          {notifyMsg}
        </p>
      )}
    </div>
  );
}
