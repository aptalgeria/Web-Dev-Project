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
    if (search.trim()) {
      const params = new URLSearchParams();
      params.set("name", search.trim());
      return `${apiBaseUrl}/products/search?${params.toString()}`;
    }
    return `${apiBaseUrl}/products`;
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
    <section className="panel" id="product-list-panel">
      <div className="panel-head">
        <div>
          <p className="section-label">✦ Collection</p>
          <h3>Curated Fragrances</h3>
        </div>
        <div className="search-wrap">
          <input
            id="search-products"
            className="search-input"
            type="text"
            placeholder="Search fragrances..."
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      {error ? <p className="error-banner">{error}</p> : null}

      {loading ? (
        <div className="state-box">
          Discovering exquisite fragrances...
        </div>
      ) : products.length === 0 ? (
        <div className="state-box">
          No fragrances match your search yet.
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
