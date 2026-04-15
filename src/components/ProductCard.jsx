export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          src={product.image}
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
