import { useMemo, useState } from "react";
import Header from "./components/Header";
import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList";

const API_BASE_URL = "http://localhost:3000";

export default function App() {
  const [page, setPage] = useState("add");
  const [refreshKey, setRefreshKey] = useState(0);
  const [notice, setNotice] = useState({
    type: "neutral",
    text: "Refined catalog experience for your perfume collection.",
  });

  const heroStats = useMemo(
    () => [
      { label: "Elegant UI", value: "Luxury" },
      { label: "Search mode", value: "Live" },
      { label: "Layout", value: "Cards" },
    ],
    []
  );

  const onProductCreated = () => {
    setNotice({
      type: "success",
      text: "Product added successfully. The collection has been refreshed.",
    });
    setPage("view");
    setRefreshKey((v) => v + 1);
  };

  const onProductsChanged = () => {
    setRefreshKey((v) => v + 1);
  };

  return (
    <div className="app-shell">
      <Header currentPage={page} onNavigate={setPage} />

      <main className="page">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Perfume Products Catalog</p>
            <h2>Minimal, refined, and presentation-ready.</h2>
            <p className="hero-text">
              A premium frontend for adding and browsing perfume products with a polished
              luxury look and a live jQuery search flow.
            </p>

            <div className="hero-actions">
              <button
                className={`pill-button ${page === "add" ? "active" : ""}`}
                onClick={() => setPage("add")}
              >
                Add Product
              </button>
              <button
                className={`pill-button ${page === "view" ? "active" : ""}`}
                onClick={() => setPage("view")}
              >
                View Collection
              </button>
            </div>
          </div>

          <div className="hero-panel">
            {heroStats.map((item) => (
              <div key={item.label} className="stat-card">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </section>

        {notice.text ? (
          <div className={`notice ${notice.type}`}>
            {notice.text}
          </div>
        ) : null}

        {page === "add" ? (
          <AddProduct apiBaseUrl={API_BASE_URL} onCreated={onProductCreated} onChange={onProductsChanged} />
        ) : (
          <ProductList apiBaseUrl={API_BASE_URL} refreshKey={refreshKey} />
        )}
      </main>
    </div>
  );
}
