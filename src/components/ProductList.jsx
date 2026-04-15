import React from "react";
import { useEffect, useMemo, useState } from "react";
import $ from "jquery";
import ProductCard from "./ProductCard";

export default function ProductList({ apiBaseUrl, refreshKey }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const endpoint = useMemo(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    return `${apiBaseUrl}/products${params.toString() ? `?${params.toString()}` : ""}`;
  }, [apiBaseUrl, search]);

  const loadProducts = (url) => {
    setLoading(true);
    setError("");

    $.ajax({
      url,
      method: "GET",
      dataType: "json",
      success: (data) => {
        setProducts(Array.isArray(data) ? data : []);
      },
      error: () => {
        setError("Unable to load products. Please check the backend server.");
      },
      complete: () => {
        setLoading(false);
      },
    });
  };

  useEffect(() => {
    loadProducts(endpoint);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, refreshKey]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <p className="section-label">Collection</p>
          <h3>View all products</h3>
        </div>
        <div className="search-wrap">
          <input
            className="search-input"
            type="text"
            placeholder="Search by product name..."
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      {error ? <p className="error-banner">{error}</p> : null}

      {loading ? (
        <div className="state-box">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="state-box">
          No products match your search yet.
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product, index) => (
            <ProductCard key={product.id ?? `${product.name}-${index}`} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
