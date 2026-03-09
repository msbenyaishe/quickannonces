import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { addAnnonce, setAnnonces } from "../../features/annonces/annoncesSlice";
import { createAd, fetchAds } from "../../services/api/adsService";
import { uploadImages } from "../../services/api/uploadService";

export default function Publier() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }
    setSelectedImages(files);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const form = e.target;

      if (!form.titre.value.trim()) {
        setError("Ad title is required");
        setLoading(false);
        return;
      }

      let imageUrls = [];
      if (selectedImages.length > 0) {
        try {
          imageUrls = await uploadImages(selectedImages);
        } catch {
          setError("Failed to upload images. Please try again.");
          setLoading(false);
          return;
        }
      }

      const adData = {
        title: form.titre.value.trim(),
        description: form.description.value.trim() || null,
        typeAnnonce: form.typeAnnonce.value,
        category: form.categorie?.value || null,
        price: Number(form.prix.value),
        city: form.ville.value.trim(),
        images: imageUrls,
      };

      const newAd = await createAd(adData);

      // Transform for Redux
      const reduxAd = {
        id: newAd.id.toString(),
        titre: newAd.title,
        description: newAd.description,
        typeAnnonce: newAd.type_annonce,
        categorieId: newAd.category,
        prix: parseFloat(newAd.price),
        ville: newAd.city,
        photos: Array.isArray(newAd.images) ? newAd.images : [],
        userId: newAd.user_id.toString(),
        etat: newAd.status === "pending" ? "en_attente" : newAd.status === "accepted" ? "acceptee" : "refusee",
        datePoster: newAd.created_at,
      };

      dispatch(addAnnonce(reduxAd));

      // Refresh global list
      const allAds = await fetchAds();
      const reduxAds = allAds.map((ad) => ({
        id: ad.id.toString(),
        titre: ad.title,
        description: ad.description,
        typeAnnonce: ad.type_annonce,
        categorieId: ad.category,
        prix: parseFloat(ad.price),
        ville: ad.city,
        photos: Array.isArray(ad.photos || ad.images) ? (ad.photos || ad.images) : [],
        userId: ad.user_id.toString(),
        etat: ad.status === "pending" ? "en_attente" : ad.status === "accepted" ? "acceptee" : "refusee",
        datePoster: ad.created_at,
      }));
      dispatch(setAnnonces(reduxAds));

      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to create ad. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="animate-fade-in" style={{ padding: "60px 0", background: "var(--bg-soft)" }}>
      <div className="container" style={{ maxWidth: "760px" }}>
        {/* Header Section */}
        <div style={{ marginBottom: "40px", textAlign: "center" }}>
           <h1 style={{ fontSize: "32px", color: "var(--primary)", marginBottom: "8px" }}>Post an Announcement</h1>
           <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>Reach thousands of local buyers with a professional listing.</p>
        </div>

        {error && (
          <div className="animate-fade-in" style={{
            background: "rgba(220, 38, 38, 0.05)",
            color: "var(--danger)",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "32px",
            border: "1px solid rgba(220, 38, 38, 0.1)",
            fontSize: "14px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Ad Details Card */}
          <div className="card" style={{ padding: "40px", borderRadius: "16px", background: "#fff" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "24px", color: "var(--primary)" }}>Listing Details</h3>
            
            <div className="form-group">
              <label className="label" htmlFor="publier-titre">Announcement Title</label>
              <input
                id="publier-titre"
                name="titre"
                type="text"
                required
                className="input"
                placeholder="What are you selling?"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
               <div className="form-group">
                  <label className="label" htmlFor="publier-categorie">Category</label>
                  <select id="publier-categorie" name="categorie" className="select">
                    <option value="">Select Category</option>
                    <option value="vehicles">Vehicles</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="electronics">Electronics</option>
                    <option value="housing">Housing</option>
                  </select>
               </div>
               <div className="form-group">
                  <label className="label" htmlFor="publier-type">Listing Type</label>
                  <select id="publier-type" name="typeAnnonce" required className="select">
                    <option value="vente">For Sale</option>
                    <option value="location">For Rent</option>
                    <option value="service">Service</option>
                  </select>
               </div>
               <div className="form-group">
                  <label className="label" htmlFor="publier-prix">Price (MAD)</label>
                  <input
                    id="publier-prix"
                    name="prix"
                    type="number"
                    required
                    className="input"
                    placeholder="0.00"
                  />
               </div>
               <div className="form-group">
                  <label className="label" htmlFor="publier-ville">Location (City)</label>
                  <input
                    id="publier-ville"
                    name="ville"
                    type="text"
                    required
                    className="input"
                    placeholder="Ex: Tangier"
                  />
               </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label" htmlFor="publier-description">Item Description</label>
              <textarea
                id="publier-description"
                name="description"
                rows="5"
                className="textarea"
                placeholder="Describe your item in detail (condition, specs, etc.)"
              />
            </div>
          </div>

          {/* Media Upload */}
          <div className="card" style={{ padding: "40px", borderRadius: "16px", background: "#fff" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "8px", color: "var(--primary)" }}>Gallery</h3>
            <p style={{ fontSize: "13px", color: "var(--text-light)", marginBottom: "24px" }}>Add up to 5 clear photos of your item.</p>
            
            <div style={{ 
              border: "1px dashed var(--border)", 
              borderRadius: "12px", 
              padding: "48px 24px", 
              textAlign: "center",
              background: "var(--bg-soft)",
              position: "relative"
            }}>
               <div style={{ fontWeight: "600", fontSize: "14px", color: "var(--text)" }}>Upload photos</div>
               <div style={{ fontSize: "12px", color: "var(--text-light)", marginTop: "4px" }}>JPEGs, PNGs up to 5MB</div>
               <input
                 id="publier-photos"
                 name="photos"
                 type="file"
                 accept="image/*"
                 multiple
                 onChange={handleImageChange}
                 style={{ 
                   position: "absolute", 
                   top: 0, 
                   left: 0, 
                   width: "100%", 
                   height: "100%", 
                   opacity: 0, 
                   cursor: "pointer" 
                 }}
               />
            </div>

            {selectedImages.length > 0 && (
              <div style={{ marginTop: "24px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {selectedImages.map((file, index) => (
                  <div key={index} style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid var(--border-light)"
                  }}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
             <button type="button" onClick={() => navigate("/")} className="btn btn-ghost" style={{ padding: "12px 28px" }}>Cancel</button>
             <button 
               type="submit" 
               className="btn btn-primary" 
               disabled={loading}
               style={{ padding: "12px 40px" }}
             >
               {loading ? "Publishing..." : "Publish Listing"}
             </button>
          </div>
        </form>
      </div>
    </main>
  );
}
