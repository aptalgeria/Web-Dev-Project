import React, { useEffect, useRef, useState, useCallback } from "react";
import Header from "./components/Header";
import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList";

// API base URL for backend. In development, allow overriding via Vite env var
// so we can take advantage of a dev proxy (see vite.config.js).
// Defaults to '/api' which will be proxied to the backend when using the dev server.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

/* ── Floating Gold Particles ── */
function ParticleCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles = [];
    const PARTICLE_COUNT = 18;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const el = document.createElement("div");
      el.className = "particle";
      const size = Math.random() * 4 + 2;
      const left = Math.random() * 100;
      const duration = Math.random() * 18 + 14;
      const delay = Math.random() * 20;

      el.style.cssText = `
        width: ${size}px; 
        height: ${size}px; 
        left: ${left}%; 
        animation-duration: ${duration}s; 
        animation-delay: -${delay}s;
        opacity: ${Math.random() * 0.5 + 0.2};
      `;
      container.appendChild(el);
      particles.push(el);
    }

    return () => {
      particles.forEach((p) => p.remove());
    };
  }, []);

  return <div className="particle-canvas" ref={containerRef} aria-hidden="true" />;
}

/* ── Theme Management ── */
function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("perfume-gate-theme");
      if (saved) return saved;
      return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    return "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("perfume-gate-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme };
}

export default function App() {
  const [page, setPage] = useState("add");
  const [refreshKey, setRefreshKey] = useState(0);
  const [notice, setNotice] = useState({
    type: "neutral",
    text: "Welcome to an exclusive world of luxury fragrances.",
  });

  const { theme, toggleTheme } = useTheme();
  const sectionRef = useRef(null);

  /* Scroll to the content section when page changes */
  const handleNavigate = useCallback((newPage) => {
    setPage(newPage);
    /* Wait a tick for React to render the new section, then scroll */
    setTimeout(() => {
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  }, []);

  const onProductCreated = () => {
    setNotice({
      type: "success",
      text: "✦ Fragrance added to the collection. Your catalog has been refreshed.",
    });
    handleNavigate("view");
    setRefreshKey((v) => v + 1);
  };

  const onProductsChanged = () => {
    setRefreshKey((v) => v + 1);
  };

  return (
    <div className="app-shell">
      <ParticleCanvas />
      <Header
        currentPage={page}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="page" id="main-content">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Perfume Products Catalog</p>
            <h2>Perfume Gate</h2>
            <p className="hero-text">
              Enter a realm of sophistication and sensory elegance.
              Discover an exclusive selection of luxurious fragrances,
              meticulously crafted to elevate your identity and define
              your presence with every note.
            </p>

            <div className="hero-actions">
              <button
                id="hero-add-btn"
                className={`pill-button ${page === "add" ? "active" : ""}`}
                onClick={() => handleNavigate("add")}
              >
                ✦ Add Product
              </button>
              <button
                id="hero-view-btn"
                className={`pill-button ${page === "view" ? "active" : ""}`}
                onClick={() => handleNavigate("view")}
              >
                ✦ View Collection
              </button>
            </div>
          </div>
        </section>

        {notice.text ? (
          <div className={`notice ${notice.type}`} id="notice-bar">
            {notice.text}
          </div>
        ) : null}

        {/* Scroll anchor for the content section */}
        <div ref={sectionRef} style={{ scrollMarginTop: "24px" }} />

        {page === "add" ? (
          <AddProduct apiBaseUrl={API_BASE_URL} onCreated={onProductCreated} onChange={onProductsChanged} />
        ) : (
          <ProductList apiBaseUrl={API_BASE_URL} refreshKey={refreshKey} />
        )}
      </main>
    </div>
  );
}
