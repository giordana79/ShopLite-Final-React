# 🛍️ ShopLite – Flusso di funzionamento

## ⚙️ Architettura generale

- Framework: **Next.js (App Router)**
- Stato globale: **React Context API**
- Persistenza: **localStorage**
  - Dati salvati: carrello, prodotti, notifiche, ecc.
  - Rimangono dopo refresh.
  - Per resettare: `localStorage.clear()` da console.
- Stile: `styles.css` con **variabili CSS** per supporto tema **light/dark**.

---

## 🧩 Contexts

### 🔹 CartContext

Gestisce:

- `cart`: prodotti nel carrello (con quantità).
- `products`: catalogo (da `products.json` o `localStorage`).
- `discount`, `discountCode`, `discountError`: logica codici sconto.
- `errorMsgs`: errori per singolo prodotto (es. quantità oltre stock).
- `notifications`: lista email utenti per prodotti esauriti.

  Funzioni principali:
  - _addToCart(product)_: aggiunge un prodotto al carrello, senza superare la disponibilità (stock).
  - _updateQty(id, qty)_: aggiorna la quantità nel carrello, senza superare stock.
  - _removeFromCart(id)_: rimuove il prodotto dal carrello.
  - _clearCart()_: svuota il carrello.
  - checkout(): scala lo stock dei prodotti acquistati, salva aggiornamento, svuota carrello e resetta sconto.
  - _applyDiscount(code)_: applica i codici HELLO10 (-10%) o VIP20 (-20%), altrimenti mostra errore.
  - _showError()_: Gestisce gli errori.
  - _requestNotification(productId, email)_: salva la richiesta di un utente di essere avvisato quando un prodotto esaurito torna disponibile (stock riportato > 0).
  - - Extra: un useEffect controlla se un prodotto che era esaurito torna disponibile, mostra alert simulando “notifica inviata”.
  - - - Quando un prodotto esaurito viene acquistato nuovamente (stock riportato > 0), l’utente che aveva lasciato l’email riceve il popup alert(...).

  **WishlistContext**

  Tiene un array di prodotti preferiti:
  - toggleWishlist(product) aggiunge/rimuove un prodotto dalla wishlist.

  **ThemeContext**

  Gestisce tema light / dark:
  - setTheme() applica l’attributo data-theme="light|dark" su `<html>`, che cambia le variabili CSS globali.
    I componenti leggono le variabili CSS per aggiornare colori, sfondi e testi.

  **Componenti principali**
  - **page.jsx (Home)**

    Legge products da CartContext.
    Mostra sidebar ProductFilters (per ricerca) e ProductGrid (per griglia prodotti).
    Usa useEffect per aggiornare la lista filtrata.

  - **ProductFilters.jsx**

    Ha input di ricerca e filtra prodotti per titolo.
    Aggiorna lista mostrata nella Home.

  - **ProductGrid.jsx**

    Riceve products come prop.
    Li mostra in griglia di card (ProductCard).

  - **ProductCard.jsx**

    Mostra immagine, titolo, prezzo e disponibilità (stock).
    Se stock = 0 appare la scritta “Prodotto esaurito” + form email “Avvisami”.
    Bottoni:

  - Aggiungi al carrello, chiama addToCart(product).
  - Wishlis, aggiungi/rimuovi preferito.
    Se la quantità nel carrello = disponibilità, il bottone mostra “Quantità massima” e diventa disabilitato.
    Se l'utente inserisce email su prodotto esaurito, viene registrata in CartContext.notifications.

  - **CartSheet.jsx**

  - Pannello laterale con riepilogo carrello.
  - Mostra la lista dei prodotti con le quantità modificabili ed i pulsanti per rimuovere.
  - Mostra il totale e il link al checkout.
  - Pulsante ❌ chiude il carrello.

  - **checkout/page.jsx**

  - Mostra il riepilogo dell'ordine con i prodotti e il subtotale.
  - Campo input per il codice sconto (HELLO10 o VIP20).
  - Se il codice è valido aggiorna il totale con sconto.
  - Se il codice non è valido appare un messaggio di errore in rosso.
  - Form dati cliente: Nome, Email, Indirizzo.
  - handleSubmit:
  - Controlla i campi compilati.
  - Esegue il checkout() dal CartContext, scala stock, svuota carrello e resetta sconto.
  - Reindirizza a /order-success.

  - **order-success/page.jsx**

  - Pagina di conferma ordine.
  - Messaggio “Ordine completato”.
  - Pulsante “Torna allo shopping” e porta a "/".

  - **Header.jsx**

  - Barra in alto con link “ShopLite” e “Checkout”.
  - Icona carrello 🛒 con numero di pezzi e apre/chiude CartSheet.
  - Bottone 🌙/☀️ per cambiare tema dark/light.

  ### Flusso completo di utilizzo

  Si avvia l'app e la Home mostra i prodotti da CartContext (caricati da JSON o localStorage).
  Ricerca prodotto, la sidebar filtra lista in tempo reale.

  "Aggiungi al carrello":
  - Se c’è lo stock il prodotto viene aggiunto.
  - Se un prodotto raggiunge il limite appare la scritta rossa “Quantità massima”.
  - Se invece è esaurito il bottone viene disabilitato, ma è possibile lasciare email.
  - Wishlist è possibile aggiungere/rimuovere tra i preferiti.
  - Il Carrello appare nel pannello laterale con prodotti, modifica quantità, totale aggiornato.

  Il Checkout:
  Effettua il riepilogo prodotti.
  Si inserisce codice sconto (HELLO10/VIP20).
  Compilazione Nome, Email, Indirizzo.
  Conferma da il checkout:
  Lo stock dei prodotti viene scalato.
  Il carrello si svuota.
  Lo sconto viene resettato.
  Il Redirect a “Ordine completato”.
  L'order success da un messaggio + pulsante “Torna allo shopping”.
  Dark/Light mode con toggle header cambia tema di tutta l’app.

  Notifiche prodotto:
  - Se un prodotto era esaurito e viene inserita l'email questa viene salvata in localStorage.
  - Extra: un useEffect controlla se un prodotto che era esaurito torna disponibile mostra alert simulando “notifica inviata”.

  **CSS (styles.css)**

  Gestisce layout, card, pulsanti, filtri, carrello, checkout, dark/light.
  Usa variabili CSS (--bg, --text, ecc.) per cambiare dinamicamente i colori col tema.
  Include transizioni fluide e hover per una UX moderna.

In localStorage si potrà vedere:

```
notifications:
[{"productId":"p-102","email":"giordanapandolfo@gmail.com"}]
[{"productId":"p-101","email":"giordanapandolfo@gmail.com"}]

products:
[{"id":"p-101","title":"Cuffie Wireless Pro","description":"Cancellazione attiva del rumore, 30h autonomia.","price":129.9,"category":"audio","rating":4.5,"stock":22,"images":["/img/p101-1.jpg","/img/p101-2.jpg"],"discount":0.15,"bestseller":true}]

wishlist:
[{"id":"p-102","title":"Smartwatch Fit","description":"Cardiofrequenzimetro, GPS, resistenza all’acqua.","price":99,"category":"wearable","rating":4.2,"stock":10,"images":["/img/p102-1.jpg"],"discount":0,"bestseller":false}]

cart:
[{"id":"p-102","title":"Smartwatch Fit","description":"Cardiofrequenzimetro, GPS, resistenza all’acqua.","price":99,"category":"wearable","rating":4.2,"stock":10,"images":["/img/p102-1.jpg"],"discount":0,"bestseller":false,"qty":5}]
```

---

[Link Vercel](https://shop-lite-final-react.vercel.app/)

---

### NOTE

**Per verificare come viene visualizzato un progetto su un dispositivo mobile senza deployare su qualche piattaforma come Vercel seguire i seguenti passi:**

1. Avvia l’app in modalità sviluppo eseguendo il comando:

- npx next dev -H 0.0.0.0 -p 3000

2. Collegare il dispositivo mobile alla stessa rete del PC ed aprire il browser sul dispositivo mobile e visita l’indirizzo:

- `hhtp://<IP del PC>:3000`

- H 0.0.0.0
  - - H sta per host.
  - - 0.0.0.0 significa che il server accetta connessioni da tutti gli indirizzi IP, non solo dal computer locale (localhost o 127.0.0.1).
      Questo permette di accedere al sito da altri dispositivi sulla stessa rete.

- p 3000
  - - p sta per porta.
  - - 3000 è la porta su cui il server ascolta le richieste.
