import React, { useState, useRef } from "react";

function AddProduct({ apiBaseUrl, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // On crée une URL temporaire pour la prévisualisation
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.price || !file) {
      setError("Please include a name, description, price, and a beautiful photo.");
      return;
    }

    setIsSubmitting(true);
    
    // On utilise FormData pour envoyer le fichier
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("image", file); // 'image' correspond au nom attendu par multer sur le serveur

    try {
      const res = await fetch(`${apiBaseUrl}/products`, {
        method: "POST",
        // Note: Pas de 'Content-Type' header ici, le navigateur le met automatiquement pour FormData
        body: formData,
      });

      if (!res.ok) throw new Error();

      setForm({
        name: "",
        description: "",
        price: "",
      });
      setFile(null);

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
              <label htmlFor="product-image">Bottle Photo</label>
              <input
                id="product-image"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
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