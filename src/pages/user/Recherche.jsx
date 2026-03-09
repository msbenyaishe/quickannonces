import { useSelector } from "react-redux";
import { selectFilteredAnnonces } from "../../features/annonces/annoncesSelectors";
import SearchBar from "../../components/SearchBar";
import AnnonceCard from "../../components/AnnonceCard";

export default function Recherche() {
  const annonces = useSelector(selectFilteredAnnonces);

  return (
    <main style={{ padding: "72px 0 80px", minHeight: "80vh", background: "var(--bg-soft)" }}>
      <div className="container" style={{ marginBottom: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "8px", letterSpacing: "-0.04em", color: "var(--primary)" }}>
            Browse all listings
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
            Filter by keywords, category, city, and price to find exactly what you need.
          </p>
        </div>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <SearchBar />
        </div>
      </div>

      <section className="container">
        {annonces.length === 0 ? (
          <div className="card" style={{
            textAlign: "center",
            padding: "80px 20px",
            color: "var(--text-muted)"
          }}>
            <p style={{ fontSize: "18px", fontWeight: "500", color: "var(--text)" }}>No results found.</p>
            <p style={{ fontSize: "15px" }}>Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <>
            <p style={{ marginBottom: "24px", color: "var(--text-muted)", fontSize: "14px", fontWeight: "500" }}>
              Showing {annonces.length} result{annonces.length !== 1 ? "s" : ""}
            </p>
            <div className="cards">
              {annonces.map(a => (
                <AnnonceCard key={a.id} annonce={a} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
