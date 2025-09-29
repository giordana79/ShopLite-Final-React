"use client";
import { useCart } from "@/context/CartContext";

export default function CartSheet({ onClose = null }) {
  const { cart, updateQty, removeFromCart, errorMsg } = useCart();
  const total = cart.reduce((sum, p) => sum + p.price * p.qty, 0);

  return (
    <div className="cart-overlay">
      <div className="cart-panel">
        {errorMsg && <p className="error">{errorMsg}</p>}
        {onClose && (
          <button className="close" onClick={onClose}>
            ❌
          </button>
        )}

        <h2>Carrello</h2>
        {cart.length === 0 && <p>Vuoto</p>}

        {cart.map((item) => (
          <div key={item.id} className="item">
            <span>{item.title}</span>
            <input
              type="number"
              min="1"
              value={item.qty}
              onChange={(e) => updateQty(item.id, Number(e.target.value))}
            />
            <span>€ {(item.price * item.qty).toFixed(2)}</span>
            <button onClick={() => removeFromCart(item.id)}>❌</button>
          </div>
        ))}
        <h3>Totale: € {total.toFixed(2)}</h3>
        <p>
          <a href="/checkout">Vai al checkout</a>
        </p>
      </div>
    </div>
  );
}
