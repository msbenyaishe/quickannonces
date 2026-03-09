import { useState, useEffect } from "react";

export default function EditAdModal({ ad, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    city: "",
    description: "",
    status: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (ad && isOpen) {
      setFormData({
        title: ad.titre || "",
        price: ad.prix || 0,
        city: ad.ville || "",
        description: ad.description || "",
        status: ad.etat === "en_attente" ? "pending" : ad.etat === "acceptee" ? "accepted" : "refused"
      });
    }
  }, [ad, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(ad.id, formData);
      onClose();
    } catch (error) {
      console.error("Error saving ad:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(15, 23, 42, 0.5)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      padding: "20px"
    }}>
      <div className="modal-content" style={{
        background: "white",
        width: "100%",
        maxWidth: "500px",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        overflow: "hidden"
      }}>
        <div style={{ padding: "24px", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>Edit Announcement</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "var(--text-light)" }}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor={`edit-title-${ad?.id}`} style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-muted)" }}>Title</label>
            <input 
              id={`edit-title-${ad?.id}`}
              name="title"
              type="text" 
              className="form-input" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label htmlFor={`edit-price-${ad?.id}`} style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-muted)" }}>Price (MAD)</label>
              <input 
                id={`edit-price-${ad?.id}`}
                name="price"
                type="number" 
                className="form-input" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                style={{ width: "100%", padding: "10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}
              />
            </div>
            <div>
              <label htmlFor={`edit-city-${ad?.id}`} style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-muted)" }}>City</label>
              <input 
                id={`edit-city-${ad?.id}`}
                name="city"
                type="text" 
                className="form-input" 
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                required
                style={{ width: "100%", padding: "10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label htmlFor={`edit-status-${ad?.id}`} style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-muted)" }}>Status</label>
            <select 
              id={`edit-status-${ad?.id}`}
              name="status"
              className="form-select" 
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              style={{ width: "100%", padding: "10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "white" }}
            >
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="refused">Refused</option>
            </select>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label htmlFor={`edit-description-${ad?.id}`} style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-muted)" }}>Description</label>
            <textarea 
              id={`edit-description-${ad?.id}`}
              name="description"
              className="form-input" 
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{ width: "100%", padding: "10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", resize: "vertical" }}
            ></textarea>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} className="btn btn-ghost" style={{ padding: "10px 20px" }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ padding: "10px 24px" }}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
