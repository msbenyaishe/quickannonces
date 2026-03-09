import { useSelector } from "react-redux";
import { selectFilteredAnnonces } from "../../features/annonces/annoncesSelectors";
import { Link } from "react-router-dom";
import AnnonceCard from "../../components/AnnonceCard";
import SearchBar from "../../components/SearchBar";
import CategoryChips from "../../components/CategoryChips";

export default function Home() {
  const annonces = useSelector(selectFilteredAnnonces);

  return (
    <main>
      {/* Hero */}
      <section className="hero responsive-hero" style={{ padding: "clamp(60px, 10vw, 100px) 0 60px", borderBottom: "1px solid var(--border-light)" }}>
        <div className="container">
          <div className="text-center hero-content" style={{ maxWidth: "800px", margin: "0 auto 40px" }}>
            <h1 className="text-primary hero-title" style={{ fontSize: "clamp(28px, 6vw, 42px)", marginBottom: "16px", lineHeight: "1.2" }}>
              Find what you need <span style={{ color: "var(--accent)" }}>locally</span>
            </h1>
            <p className="text-muted hero-subtitle" style={{ fontSize: "clamp(14px, 4vw, 16px)", lineHeight: "1.6" }}>
              The simplest way to buy and sell in your community. 
              QuickAnnonce connects you with verified local ads.
            </p>
          </div>
          
          <SearchBar />
        </div>
      </section>

      {/* Category Navigation */}
      <section style={{ padding: "20px 0", borderBottom: "1px solid var(--border-light)", background: "var(--bg-soft)" }}>
        <div className="container flex justify-center">
           <CategoryChips />
        </div>
      </section>

      {/* Main Content */}
      <section className="container section-padding">
        <div className="flex justify-between items-center mb-2" style={{ marginBottom: "32px" }}>
          <div>
            <h2 style={{ fontSize: "24px" }}>Latest Listings</h2>
            <p className="text-muted" style={{ fontSize: "14px" }}>Browse the recently posted announcements</p>
          </div>
          <Link to="/recherche" style={{ fontSize: "14px", fontWeight: "600", color: "var(--primary)" }}>
            View all
          </Link>
        </div>

        {annonces.length === 0 ? (
          <div className="text-center" style={{ padding: "80px 0" }}>
            <h3 className="text-muted" style={{ marginBottom: "8px" }}>No announcements found</h3>
            <p className="text-light" style={{ fontSize: "14px" }}>Try searching with different keywords or categories.</p>
          </div>
        ) : (
          <div className="cards">
            {annonces.map((annonce) => (
              <AnnonceCard 
                key={annonce.id} 
                annonce={annonce} 
              />
            ))}
          </div>
        )}
      </section>

      {/* Trust & Simplicity */}
      <section style={{ background: "var(--bg-soft)", padding: "64px 0", borderTop: "1px solid var(--border-light)" }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: "40px" }}>
             <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>Simple and Secure</h2>
             <p className="text-muted" style={{ maxWidth: "600px", margin: "0 auto" }}>
               A focused marketplace experience designed for clarity and ease of use.
             </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "32px" }}>
            <div>
              <h4 style={{ marginBottom: "8px" }}>Effortless posting</h4>
              <p className="text-muted" style={{ fontSize: "14px", lineHeight: "1.6" }}>Create your ad in under a minute with our streamlined forms and easy photo uploads.</p>
            </div>
            <div>
              <h4 style={{ marginBottom: "8px" }}>Quality verification</h4>
              <p className="text-muted" style={{ fontSize: "14px", lineHeight: "1.6" }}>We review every announcement to maintain a high-quality, trustworthy marketplace.</p>
            </div>
            <div>
              <h4 style={{ marginBottom: "8px" }}>Clean interface</h4>
              <p className="text-muted" style={{ fontSize: "14px", lineHeight: "1.6" }}>A minimalist design focused on readability and ease of use across all devices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding">
        <div className="container text-center" style={{ maxWidth: "600px" }}>
          <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>Ready to list your item?</h2>
          <p className="text-muted" style={{ marginBottom: "32px", fontSize: "16px" }}>
             Join our growing marketplace and reach local buyers instantly. 
             It's free to start and simple to manage.
          </p>
          <div className="flex gap-2 justify-center">
            <Link to="/publier" className="btn btn-primary" style={{ padding: "12px 32px" }}>Create Ad</Link>
            <Link to="/recherche" className="btn btn-ghost" style={{ padding: "12px 32px" }}>Explore</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
