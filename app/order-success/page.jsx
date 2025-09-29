import Link from "next/link";

export default function OrderSuccess() {
  return (
    <div className="success">
      <h1>✅ Ordine completato!</h1>
      <p>Grazie per il tuo acquisto.</p>
      <Link href="/" className="btn">
        Torna allo shopping
      </Link>
    </div>
  );
}
