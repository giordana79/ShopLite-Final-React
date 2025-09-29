"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [errorMsgs, setErrorMsgs] = useState({});
  const [discount, setDiscount] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [notifications, setNotifications] = useState([]);
  //[{ productId, email }]

  /* INIT: carica dati da localStorage o products.json */
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      fetch("/products.json")
        .then((res) => res.json())
        .then((data) => setProducts(data));
    }

    const savedNotifs = localStorage.getItem("notifications");
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
  }, []);

  /* Persistenza */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  /* Notifiche disponibilità */
  //Controllo: se un prodotto torna disponibile
  useEffect(() => {
    notifications.forEach((notif) => {
      const product = products.find((p) => p.id === notif.productId);
      if (product && product.stock > 0) {
        alert(
          `✅ Il prodotto "${product.title}" è di nuovo disponibile! Notifica inviata a ${notif.email}`
        );
        // Rimuove la notifica perché è stata "inviata"
        setNotifications((prev) =>
          prev.filter((n) => n.productId !== notif.productId)
        );
      }
    });
  }, [products]);

  /* Carrello */
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          return prev;
        }
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      if (product.stock > 0) {
        return [...prev, { ...product, qty: 1 }];
      }
      showError(product.id, "Prodotto esaurito!");
      return prev;
    });
  };

  const updateQty = (id, qty) => {
    setCart((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          if (qty > p.stock) {
            return { ...p, qty: p.stock };
          }
          return { ...p, qty };
        }
        return p;
      })
    );
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((p) => p.id !== id));
  const clearCart = () => setCart([]);

  /* Sconti */
  const applyDiscount = (code) => {
    if (code === "HELLO10") {
      setDiscount(0.1);
      setDiscountCode(code);
      setDiscountError("");
    } else if (code === "VIP20") {
      setDiscount(0.2);
      setDiscountCode(code);
      setDiscountError("");
    } else {
      setDiscount(0);
      setDiscountCode("");
      setDiscountError("Codice sconto non valido!");
    }
  };

  /* Checkout */
  const checkout = () => {
    const updatedProducts = products.map((prod) => {
      const cartItem = cart.find((c) => c.id === prod.id);
      return cartItem
        ? { ...prod, stock: Math.max(0, prod.stock - cartItem.qty) }
        : prod;
    });

    setProducts(updatedProducts); //Requisito che checkout() si aggiorna
    // sempre correttamente products con il nuovo stock,
    // altrimenti l’useEffect non scatta, perchè senza questo,
    // React non vede il cambiamento e la useEffect([products]) non si esegue.
    clearCart();
    setDiscount(0);
    setDiscountCode("");
    setDiscountError("");
  };

  /* Errori */
  const showError = (id, msg) => {
    setErrorMsgs((prev) => ({ ...prev, [id]: msg }));
    setTimeout(() => {
      setErrorMsgs((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }, 2000);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        products,
        discount,
        discountCode,
        discountError,
        errorMsgs,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        checkout,
        applyDiscount,
        requestNotification: (id, email) =>
          setNotifications((prev) => [...prev, { productId: id, email }]),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
