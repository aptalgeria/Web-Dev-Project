import { useMemo, useState } from "react";

const initialForm = {
  name: "",
  description: "",
  price: "",
  image: "",
};

export default function AddProduct({ apiBaseUrl, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imagePreview = useMemo(() => form.image.trim(), [form.image]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validate = () => {
    if (!form.name.trim() || !form.description.trim() || !form.price.trim() || !form.image.trim()) {
      return "Please complete all fields.";
    }

    const priceValue = Number(form.price);
    if (Number.isNaN(priceValue) || priceValue <= 0) {
      return "Price must be a valid number greater than zero.";
    }

    try {
      new URL(form.image.trim());
    } catch {
      return "Image must be a valid URL.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${apiBaseUrl}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          image: form.image.trim(),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || "Failed to add product.");
      }

      setForm(initialForm);
      onCreated?.();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <p className="section-label">New entry</p>
          <h3>Add a perfume product</h3>
        </div>
        <p className="section-copy">
          Keep the form clean and complete to create a polished catalog item.
        </p>
      </div>

      <div className="form-layout">
        <form className="glass-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Product name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Velvet Bloom"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="A short elegant description..."
              rows="5"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="two-cols">
            <div className="field">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="image">Image URL</label>
              <input
                id="image"
                name="image"
                type="url"
                placeholder="https://..."
                value={form.image}
                onChange={handleChange}
              />
            </div>
          </div>

          {error ? <p className="error-banner">{error}</p> : null}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Create Product"}
          </button>
        </form>

        <aside className="preview-card">
          <p className="preview-label">Live preview</p>

          <div className="preview-image-wrap">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Product preview"
                className="preview-image"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="preview-placeholder">
                Add an image URL to see the preview
              </div>
            )}
          </div>

          <div className="preview-meta">
            <h4>{form.name || "Product name"}</h4>
            <p>{form.description || "Description appears here."}</p>
            <strong>{form.price ? `$${form.price}` : "$0.00"}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}
