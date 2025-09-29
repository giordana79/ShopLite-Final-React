"use client";
import { useState } from "react";

export default function ProductFilters({ products, setFiltered }) {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = products.filter((p) =>
      p.title.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(filtered);
  };

  return (
    <aside className="filters">
      <h3>🔍 Cerca prodotti</h3>
      <input
        type="text"
        placeholder="Cerca per nome..."
        value={search}
        onChange={handleSearch}
      />
    </aside>
  );
}
