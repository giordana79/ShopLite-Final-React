"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import ProductGrid from "@/components/ProductGrid";
import ProductFilters from "@/components/ProductFilters";

export default function Home() {
  const { products } = useCart(); //Prodotti dal context
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    setFiltered(products);
  }, [products]);

  return (
    <div className="flex-container">
      <ProductFilters products={products} setFiltered={setFiltered} />
      <ProductGrid products={filtered} />
    </div>
  );
}
