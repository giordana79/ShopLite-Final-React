"use client";
export default function ProductDetailModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose} className="close">❌</button>
        <h2>{product.title}</h2>
        <img src={product.images[0]} alt={product.title} />
        <p>{product.description}</p>
        <p>Prezzo: € {product.price.toFixed(2)}</p>
      </div>
    </div>
  );
}
