import { Link, useLocation } from "react-router-dom";

export default function VisitorNavbar() {
  const location = useLocation();

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

        <nav className="nav desktop-nav">
          <Link to="/" className={getLinkClass("/")}>Marketplace</Link>
          <Link to="/recherche" className={getLinkClass("/recherche")}>Explore</Link>
          <Link to="/connexion" className={getLinkClass("/connexion")}>Sign In</Link>
          <Link to="/inscription" className="btn btn-primary" style={{ padding: "8px 20px" }}>Get Started</Link>
        </nav>

        <div className="header-actions">
           {/* Mobile Menu logic could go here */}
        </div>
      </div>
    </header>
  );
}
