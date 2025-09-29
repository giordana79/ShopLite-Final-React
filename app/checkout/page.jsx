"use client";
import { useCart } from "@/context/CartContext";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, checkout, discount, discountError, applyDiscount } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [code, setCode] = useState("");

  //Calcoli ottimizzati
  const { subtotal, discountAmount, total } = useMemo(() => {
    const subtotal = cart.reduce((sum, p) => sum + p.price * p.qty, 0);
    const discountAmount = subtotal * discount;
    return { subtotal, discountAmount, total: subtotal - discountAmount };
  }, [cart, discount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.address) {
      alert("Compila tutti i campi!");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      alert("Inserisci un'email valida!");
      return;
    }

    //Checkout + redirect
    checkout(form);
    router.push("/order-success");
  };

  const handleApplyDiscount = () => {
    applyDiscount(code);
    if (!discountError) setCode(""); //Reset campo se valido
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>

      <h3>Riepilogo carrello</h3>
      {cart.length === 0 ? (
        <p>Il carrello è vuoto.</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.title} x {item.qty} → €{" "}
                {(item.price * item.qty).toFixed(2)}
              </li>
            ))}
          </ul>
          <h3>Subtotale: € {subtotal.toFixed(2)}</h3>
          {discount > 0 && (
            <h3>
              Sconto: -€ {discountAmount.toFixed(2)} ({discount * 100}%)
            </h3>
          )}
          <h2>Totale: € {total.toFixed(2)}</h2>
        </>
      )}

      {/* Codice sconto */}
      <div className="discount">
        <input
          type="text"
          placeholder="Inserisci codice sconto"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
          }}
        />
        <button type="button" onClick={handleApplyDiscount}>
          Applica
        </button>
      </div>
      {discountError && <p className="error">{discountError}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Inserisci nome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Inserisci email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Inserisci indirizzo"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />
        <button type="submit" disabled={cart.length === 0}>
          Conferma ordine
        </button>
      </form>
    </div>
  );
}
