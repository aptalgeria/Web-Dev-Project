import React, { useState, useRef } from "react";

function AddProduct({ apiBaseUrl, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
  });

  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUrl = (e) => {
    const url = e.target.value;
    setForm({ ...form, image_url: url });
    setPreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.price || !form.image_url) {
      setError("All fields are required to craft a perfume listing.");
      return;
    }

    setIsSubmitting(true);
    const data = {
      name: form.name,
      description: form.description,
      price: form.price,
      image_url: form.image_url,
    };

    try {
      const res = await fetch(`${apiBaseUrl}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

      setForm({
        name: "",
        description: "",
        price: "",
        image_url: "",
      });

      setPreview("");
      setError("");

      if (onCreated) onCreated();
    } catch (err) {
      setError("Error uploading product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="panel" id="add-product-panel">
      {/* HEADER */}
      <div className="panel-head">
        <div>
          <p className="section-label">✦ Create</p>
          <h3>New Fragrance</h3>
          <p className="section-copy">
            Compose a new masterpiece for your catalog with exquisite details and imagery.
          </p>
        </div>
      </div>

      {/* FORM + PREVIEW */}
      <div className="form-layout">
        {/* FORM */}
        <form className="glass-form" onSubmit={handleSubmit} ref={formRef} id="add-product-form">
          {error && <div className="error-banner">{error}</div>}

          <div className="field">
            <label htmlFor="product-name">Fragrance Name</label>
            <input
              id="product-name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Oud Royal Noir"
            />
          </div>

          <div className="field">
            <label htmlFor="product-description">Description</label>
            <textarea
              id="product-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the notes, family, and essence..."
            />
          </div>

          <div className="two-cols">
            <div className="field">
              <label htmlFor="product-price">Price (USD)</label>
              <input
                id="product-price"
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 249"
              />
            </div>

            <div className="field">
              <label htmlFor="product-image">Bottle Image URL</label>
              <input
                id="product-image"
                type="url"
                name="image_url"
                value={form.image_url}
                onChange={handleImageUrl}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <button
            type="submit"
            className="primary-button"
            id="submit-product"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "✦ Create Fragrance"}
          </button>
        </form>

        {/* PREVIEW */}
        <div className="preview-card" id="product-preview">
          <p className="preview-label">Live Preview</p>

          <div className="preview-image-wrap">
            {preview ? (
              <img src={preview} alt="preview" className="preview-image" />
            ) : (
              <div className="preview-placeholder">
                Your fragrance image will appear here
              </div>
            )}
          </div>

          <div className="preview-meta">
            <h4>{form.name || "Fragrance Name"}</h4>
            <p>{form.description || "A captivating scent awaits your description..."}</p>
            <strong>{form.price ? `$${Number(form.price).toFixed(2)}` : "$0.00"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;