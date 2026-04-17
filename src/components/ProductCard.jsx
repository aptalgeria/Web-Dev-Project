import React, { useState, useRef } from "react";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  /* 3D tilt effect on mouse move */
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transform = "";
    }
  };

  return (
    <article
      className="product-card"
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="product-image-wrap">
        <img
          src={product.image_url || product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80";
          }}
        />
      </div>

      <div className="product-content">
        <h4>{product.name}</h4>
        <p>{product.description}</p>

        <div className="product-footer">
          <span className="price">${Number(product.price).toFixed(2)}</span>
          <span className="tag">Luxury</span>
        </div>
      </div>
    </article>
  );
}
