import React, { useState, useRef } from "react";

function AddProduct({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });

  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.price || !form.image) {
      setError("All fields are required to craft a perfume listing.");
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("image", form.image);

    try {
      const res = await fetch("http://localhost:3000/products", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error();

      setForm({
        name: "",
        description: "",
        price: "",
        image: null,
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
              <label htmlFor="product-image">Bottle Image</label>
              <input
                id="product-image"
                type="file"
                accept="image/*"
                onChange={handleImage}
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