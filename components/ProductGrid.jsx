import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  if (!products.length) return <p>Nessun prodotto trovato.</p>;

  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
