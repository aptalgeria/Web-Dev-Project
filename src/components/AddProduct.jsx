import React, { useState } from "react";

function AddProduct({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });

  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

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
      setError("All fields are required.");
      return;
    }

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
      setError("Error uploading product.");
    }
  };

  return (
    <div className="panel">
      {/* HEADER */}
      <div className="panel-head">
        <div>
          <p className="section-label">Create</p>
          <h3>Add New Perfume</h3>
          <p className="section-copy">
            Add a refined fragrance to your catalog with full details and image.
          </p>
        </div>
      </div>

      {/* FORM + PREVIEW */}
      <div className="form-layout">
        {/* FORM */}
        <form className="glass-form" onSubmit={handleSubmit}>
          {error && <div className="error-banner">{error}</div>}

          <div className="field">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Oud Royal"
            />
          </div>

          <div className="field">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the fragrance..."
            />
          </div>

          <div className="two-cols">
            <div className="field">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 120"
              />
            </div>

            <div className="field">
              <label>Image</label>
              <input type="file" accept="image/*" onChange={handleImage} />
            </div>
          </div>

          <button type="submit" className="primary-button">
            Create Product
          </button>
        </form>

        {/* PREVIEW */}
        <div className="preview-card">
          <p className="preview-label">Preview</p>

          <div className="preview-image-wrap">
            {preview ? (
              <img src={preview} alt="preview" className="preview-image" />
            ) : (
              <div className="preview-placeholder">
                Image preview will appear here
              </div>
            )}
          </div>

          <div className="preview-meta">
            <h4>{form.name || "Perfume Name"}</h4>
            <p>{form.description || "Product description..."}</p>
            <strong>{form.price ? `$${form.price}` : "$0"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;