## Flusso di funzionamento di ShopLite

1. **Architettura generale**

   Il progetto è in Next.js (App Router).
   Lo stato globale (carrello, wishlist, tema, prodotti) è gestito con React Context API.
   La persistenza (carrello, prodotti, notifiche, ecc.) è fatta in localStorage, quindi i dati rimangono anche dopo refresh.
   Questo perchè l'app è interamente frontend (per resettare l'app basta da console eseguire il comando localStorage.clear())
   Lo stile è gestito con un file styles.css, con variabili CSS per supportare tema light/dark.

2. **Contexts**

   I seguenti sono i motori principali che gestiscono lo stato:

   **CartContext**

   Tiene traccia di:
   - cart: prodotti nel carrello (con quantità).
   - products: catalogo dei prodotti (caricati da products.json o da localStorage).
   - discount, discountCode, discountError: logica codici sconto.
   - errorMsgs: errori specifici per ogni prodotto (es. quantità oltre disponibilità).
   - notifications: lista di email utenti da avvisare quando un prodotto torna disponibile.

   Funzioni principali:
   - addToCart(product): aggiunge un prodotto al carrello, senza superare la disponibilità (stock).
   - updateQty(id, qty): aggiorna la quantità nel carrello, senza superare stock.
   - removeFromCart(id): rimuove il prodotto dal carrello.
   - clearCart(): svuota il carrello.
   - checkout(): scala lo stock dei prodotti acquistati, salva aggiornamento, svuota carrello e resetta sconto.
   - applyDiscount(code): applica i codici HELLO10 (-10%) o VIP20 (-20%), altrimenti mostra errore.
   - showError(): Gestisce gli errori.
   - requestNotification(productId, email): salva la richiesta di un utente di essere avvisato quando un prodotto esaurito torna disponibile.
   - - Extra: un useEffect controlla se un prodotto che era esaurito torna disponibile, mostra alert simulando “notifica inviata”.

   **WishlistContext**

   Tiene un array di prodotti preferiti:
   - toggleWishlist(product) aggiunge/rimuove un prodotto dalla wishlist.

   **ThemeContext**

   Gestisce tema light / dark:
   - setTheme() applica l’attributo data-theme="light|dark" su `<html>`, che cambia le variabili CSS globali.
     I componenti leggono le variabili CSS per aggiornare colori, sfondi e testi.

3. **Componenti principali**
   - page.jsx (Home)
     Legge products da CartContext.
     Mostra sidebar ProductFilters (per ricerca) e ProductGrid (per griglia prodotti).
     Usa useEffect per aggiornare la lista filtrata.

   - ProductFilters.jsx
     Ha input di ricerca e filtra prodotti per titolo.
     Aggiorna lista mostrata nella Home.

   - ProductGrid.jsx
     Riceve products come prop.
     Li mostra in griglia di card (ProductCard).

   - ProductCard.jsx
     Mostra immagine, titolo, prezzo e disponibilità (stock).
     Se stock = 0 appare la scritta “Prodotto esaurito” + form email “Avvisami”.
     Bottoni:
   - Aggiungi al carrello, chiama addToCart(product).
   - Wishlis, aggiungi/rimuovi preferito.
     Se la quantità nel carrello = disponibilità, il bottone mostra “Quantità massima” e diventa disabilitato.
     Se l'utente inserisce email su prodotto esaurito, viene registrata in CartContext.notifications.

   - CartSheet.jsx
   - Pannello laterale con riepilogo carrello.
   - Mostra la lista dei prodotti con le quantità modificabili ed i pulsanti per rimuovere.
   - Mostra il totale e il link al checkout.
   - Pulsante ❌ chiude il carrello.

   - checkout/page.jsx
   - Mostra il riepilogo dell'ordine con i prodotti e il subtotale.
   - Campo input per il codice sconto (HELLO10 o VIP20).
   - Se il codice è valido aggiorna il totale con sconto.
   - Se il codice non è valido appare un messaggio di errore in rosso.
   - Form dati cliente: Nome, Email, Indirizzo.
   - handleSubmit:
   - Controlla i campi compilati.
   - Esegue il checkout() dal CartContext, scala stock, svuota carrello e resetta sconto.
   - Reindirizza a /order-success.

   - order-success/page.jsx
   - Pagina di conferma ordine.
   - Messaggio “Ordine completato”.
   - Pulsante “Torna allo shopping” e porta a "/".

   - Header.jsx
   - Barra in alto con link “ShopLite” e “Checkout”.
   - Icona carrello 🛒 con numero di pezzi e apre/chiude CartSheet.
   - Bottone 🌙/☀️ per cambiare tema dark/light.

4. **Flusso completo di utilizzo**
   SI avvia l'app e la Home mostra i prodotti da CartContext (caricati da JSON o localStorage).
   Ricerca prodotto, la sidebar filtra lista in tempo reale.

   "Aggiungi al carrello":
   - Se c’è lo stock il prodotto viene aggiunto.
   - Se un prodotto raggiunge il limite appare la scritta rossa “Quantità massima disponibile raggiunta”.
   - Se invece è esaurito il bottone viene disabilitato, ma è possibile lasciare email.
   - Wishlist è possibile aggiungere/rimuovere tra i preferiti.
   - Il Carrello appare nel pannello laterale con prodotti, modifica quantità, totale aggiornato.

   Il Checkout:
   Effettua il riepilogo prodotti.
   Si innserisce codice sconto (HELLO10/VIP20).
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
   - Extra: un useEffect controlla se un prodotto che era esaurito torna disponibile → mostra alert simulando “notifica inviata”.

5. CSS (styles.css)
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

Quando un prodotto esaurito viene acquistato nuovamente (stock riportato > 0), l’utente che aveva lasciato l’email riceve il popup alert(...).
La notifica viene rimossa dopo l’alert, quindi non si ripete.
