import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../features/auth/authSlice";

export default function AnnonceCard({ annonce }) {
  const currentUser = useSelector(selectAuthUser);

  const isOwner =
    currentUser && String(annonce?.userId) === String(currentUser?.id);

  return (
    <Link to={`/annonce/${annonce?.id}`} className="card" style={{ display: "block" }}>
      <div className="card-img-wrapper">
        {isOwner && (
          <div style={{ position: "absolute", top: "8px", left: "8px", zIndex: 10 }}>
            <span
              className={`badge ${
                annonce?.etat === "acceptee"
                  ? "badge-accepted"
                  : annonce?.etat === "en_attente"
                  ? "badge-pending"
                  : "badge-refused"
              }`}
              style={{ fontSize: "10px" }}
            >
              {annonce?.etat === "en_attente"
                ? "Pending"
                : (annonce?.etat || "").replace("_", " ")}
            </span>
          </div>
        )}


        {annonce?.photos?.[0] || annonce?.images?.[0] ? (
          <img
            src={annonce.photos?.[0] || annonce.images?.[0]}
            alt={annonce?.titre || "Annonce"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1572375927902-1c094830d93a?q=80&w=600&auto=format&fit=crop";
            }}
          />
        ) : (
          <div
            className="flex items-center justify-center w-full"
            style={{
              height: "100%",
              fontSize: "11px",
              color: "var(--text-light)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              background: "var(--bg-darker)",
            }}
          >
            No image
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="card-price text-primary">
          {annonce?.prix ? annonce.prix.toLocaleString() : "0"} MAD
        </div>

        <h3 className="card-title mb-2" style={{ fontSize: "14px" }}>
          {annonce?.titre}
        </h3>

        <div className="card-meta" style={{ borderTop: "none", padding: 0 }}>
          <span style={{ fontSize: "12px" }}>{annonce?.ville}</span>

          <span style={{ marginLeft: "auto", fontSize: "12px" }}>
            {annonce?.datePoster
              ? new Date(annonce.datePoster).toLocaleDateString()
              : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}