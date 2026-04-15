import React from "react";
export default function Header({ currentPage, onNavigate }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true" />
        <div>
          <h1>Perfume Gate</h1>
          <p>Luxury perfume catalog</p>
        </div>
      </div>

      <nav className="topbar-nav" aria-label="Main navigation">
        <button
          className={currentPage === "add" ? "nav-link active" : "nav-link"}
          onClick={() => onNavigate("add")}
        >
          Add Product
        </button>
        <button
          className={currentPage === "view" ? "nav-link active" : "nav-link"}
          onClick={() => onNavigate("view")}
        >
          View Products
        </button>
      </nav>
    </header>
  );
}
