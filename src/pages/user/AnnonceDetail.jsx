import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAnnonceById } from "../../features/annonces/annoncesSelectors";
import { selectAuthUser } from "../../features/auth/authSlice";
import { useState } from "react";

export default function AnnonceDetail() {
  const { id } = useParams();
  const annonce = useSelector((state) => selectAnnonceById(state, id));
  const currentUser = useSelector(selectAuthUser);
  const [activePhoto, setActivePhoto] = useState(0);

  const isOwner = currentUser && annonce && (annonce.userId === currentUser.id.toString());
  const isAdmin = currentUser && currentUser.role === "admin";

  if (!annonce || (annonce.etat !== "acceptee" && !isOwner && !isAdmin)) {
    return (
      <main className="container section-padding" style={{ minHeight: "70vh" }}>
        <div className="text-center" style={{ padding: "80px 0" }}>
          <h2 className="mb-2">Announcement not found</h2>
          <p className="text-muted">This item may have been sold or removed by the seller.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: "24px" }}>Back to Marketplace</Link>
        </div>
      </main>
    );
  }

  const photos = Array.isArray(annonce.photos) && annonce.photos.length > 0
    ? annonce.photos
    : Array.isArray(annonce.images) && annonce.images.length > 0
      ? annonce.images
      : [];

  return (
    <main style={{ padding: "40px 0 80px" }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ marginBottom: "24px" }}>
           <Link to="/" className="text-muted" style={{ fontSize: "14px", fontWeight: "600" }}>
             ← Marketplace
           </Link>
        </div>

        <div className="annonce-detail-grid">
          {/* Main Content */}
          <div>
            {/* Gallery */}
            <div className="card annonce-detail-gallery" style={{ background: "var(--bg-soft)", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: "32px", padding: "0" }}>
              <div style={{ minHeight: "360px", maxHeight: "500px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "20px" }}>
                 {photos.length > 0 ? (
                    <img
                      src={photos[activePhoto]}
                      alt={annonce.titre}
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1572375927902-1c094830d93a?q=80&w=800&auto=format&fit=crop";
                      }}
                    />
                  ) : (
                    <div className="text-light" style={{ fontSize: "12px", textTransform: "uppercase" }}>
                      No images
                    </div>
                  )}
              </div>
              
              {photos.length > 1 && (
                <div className="flex gap-2" style={{ padding: "16px", background: "#fff", borderTop: "1px solid var(--border-light)", overflowX: "auto" }}>
                  {photos.map((p, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setActivePhoto(idx)}
                      style={{ 
                        width: "64px", 
                        height: "64px", 
                        borderRadius: "var(--radius-sm)", 
                        overflow: "hidden",
                        cursor: "pointer",
                        border: activePhoto === idx ? "2px solid var(--primary)" : "1px solid var(--border-light)",
                        flexShrink: 0
                      }}
                    >
                      <img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ padding: "0 4px" }}>
               <div className="flex items-center gap-2 mb-2">
                  <span className="badge" style={{ background: "var(--bg-darker)", color: "var(--text-muted)" }}>
                    {annonce.typeAnnonce}
                  </span>
                  <span className="text-muted" style={{ fontSize: "13px" }}>
                    {new Date(annonce.datePoster).toLocaleDateString()}
                  </span>
               </div>
               
               <h1 className="text-primary mb-2" style={{ fontSize: "28px" }}>{annonce.titre}</h1>
               
               <div style={{ margin: "24px 0", padding: "24px", background: "var(--bg-soft)", borderRadius: "var(--radius-md)" }}>
                  <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>Description</h3>
                  <p className="text-muted" style={{ fontSize: "15px", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                    {annonce.description || "No description provided."}
                  </p>
               </div>

               {(isOwner || isAdmin) && (
                 <div className="flex justify-between items-center" style={{ 
                    padding: "16px", 
                    borderRadius: "var(--radius-md)", 
                    background: annonce.etat === "acceptee" ? "rgba(5, 150, 105, 0.05)" : "rgba(217, 119, 6, 0.05)",
                    border: "1px solid var(--border-light)"
                 }}>
                    <div className="flex items-center gap-2">
                       <span style={{ fontWeight: "700", fontSize: "13px" }}>Status:</span>
                       <span className="badge" style={{ fontSize: "11px" }}>{annonce.etat.replace("_", " ")}</span>
                    </div>
                    <span className="text-light" style={{ fontSize: "12px" }}>Private information</span>
                 </div>
               )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="annonce-detail-sidebar" style={{ position: "sticky", top: "100px" }}>
             <div className="card" style={{ padding: "24px", borderRadius: "var(--radius-lg)" }}>
                <div className="text-muted" style={{ fontSize: "12px", marginBottom: "4px" }}>Price</div>
                <div className="text-primary" style={{ fontSize: "28px", fontWeight: "700", marginBottom: "24px" }}>
                   {annonce.prix ? annonce.prix.toLocaleString() : "0"} <span style={{ fontSize: "14px", color: "var(--text-light)" }}>MAD</span>
                </div>

                <hr style={{ border: "none", borderTop: "1px solid var(--border-light)", marginBottom: "24px" }} />

                <div className="flex items-center gap-2 mb-2">
                   <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--bg-darker)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-light)" }}>U</div>
                   <div>
                      <div style={{ fontSize: "14px", fontWeight: "700" }}>Seller Profile</div>
                      <div style={{ fontSize: "12px", color: "var(--text-light)" }}>Location: {annonce.ville}</div>
                   </div>
                </div>
             </div>

             <div className="mt-4" style={{ padding: "16px", borderRadius: "var(--radius-md)", background: "var(--bg-soft)", border: "1px solid var(--border-light)" }}>
                <div style={{ fontWeight: "700", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>Safety Tips</div>
                <p className="text-light" style={{ fontSize: "11px", lineHeight: "1.4" }}>
                   Meet in public places. Inspect items before buying. Never pay in advance.
                </p>
             </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
