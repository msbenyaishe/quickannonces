export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "40px" }}>
          <div>
            <div className="brand mb-2">
              <div className="brand-logo" style={{ width: "30px", height: "30px", fontSize: "12px" }}>QA</div>
              <span className="brand-name" style={{ fontSize: "18px" }}>QuickAnnonce</span>
            </div>
            <p className="text-muted" style={{ fontSize: "14px", lineHeight: "1.6" }}>
              A modern marketplace platform focused on simplicity and trust.
            </p>
          </div>

          <div className="flex" style={{ flexDirection: "column", gap: "10px" }}>
            <h4 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "4px" }}>Platform</h4>
            <a href="/" style={{ fontSize: "13px", color: "var(--text-light)" }}>Marketplace</a>
            <a href="/recherche" style={{ fontSize: "13px", color: "var(--text-light)" }}>Explore</a>
            <a href="/publier" style={{ fontSize: "13px", color: "var(--text-light)" }}>Post Listing</a>
          </div>

          <div className="flex" style={{ flexDirection: "column", gap: "10px" }}>
            <h4 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "4px" }}>Links</h4>
            <a href="#" style={{ fontSize: "13px", color: "var(--text-light)" }}>Service Status</a>
            <a href="/admin" style={{ fontSize: "13px", color: "var(--text-light)" }}>Admin Panel</a>
            <a href="#" style={{ fontSize: "13px", color: "var(--text-light)" }}>Help Center</a>
          </div>

          <div className="flex" style={{ flexDirection: "column", gap: "10px" }}>
            <h4 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "4px" }}>Legal</h4>
            <a href="#" style={{ fontSize: "13px", color: "var(--text-light)" }}>Terms of Use</a>
            <a href="#" style={{ fontSize: "13px", color: "var(--text-light)" }}>Privacy Policy</a>
            <span className="text-light" style={{ fontSize: "12px", marginTop: "8px" }}>© 2026 QA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
