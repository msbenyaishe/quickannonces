import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function VisitorNavbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const getLinkClass = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <div className="brand-logo">QA</div>
          <span className="brand-name">Quick<span>Annonce</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="nav desktop-nav">
          <Link to="/" className={getLinkClass("/")}>Marketplace</Link>
          <Link to="/recherche" className={getLinkClass("/recherche")}>Explore</Link>
          <Link to="/connexion" className={getLinkClass("/connexion")}>Sign In</Link>
          <Link to="/inscription" className="btn btn-primary" style={{ padding: "8px 20px" }}>Get Started</Link>
        </nav>

        <div className="header-actions">
           <button 
             className="mobile-menu-toggle" 
             onClick={() => setIsOpen(!isOpen)}
             aria-label="Toggle menu"
           >
             {isOpen ? "✕" : "☰"}
           </button>
        </div>

        {/* Mobile Nav Overlay */}
        <nav className={`mobile-nav ${isOpen ? "open" : ""}`}>
          <Link to="/" className={getLinkClass("/")}>Marketplace</Link>
          <Link to="/recherche" className={getLinkClass("/recherche")}>Explore</Link>
          <hr style={{ border: "none", borderTop: "1px solid var(--border-light)", margin: "8px 0" }} />
          <Link to="/connexion" className={getLinkClass("/connexion")}>Sign In</Link>
          <Link to="/inscription" className="btn btn-primary">Get Started</Link>
        </nav>
      </div>
    </header>
  );
}
