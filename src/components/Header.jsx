import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  return (
    <header className="header backdrop-blur">
      <div className="container header-inner">
        {/* Left Section - Logo (Unchanged) */}
        <div className="brand">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div className="brand-logo">QA</div>
            <span className="brand-name">QuickAnnonce</span>
          </Link>
        </div>

        {/* Center Section - Navigation */}
        <nav className="nav desktop-nav">
          <Link to="/" className={getLinkClass("/")}>
            Home
          </Link>
          <Link to="/recherche" className={getLinkClass("/recherche")}>
            Browse Ads
          </Link>
          <Link to="/contact" className={getLinkClass("/contact")}>
            Contact
          </Link>
        </nav>

        {/* Right Section - Auth & CTA */}
        <div className="header-actions">
          <Link to="/connexion" className={getLinkClass("/connexion")}>
            Login
          </Link>
          <Link to="/admin" className={getLinkClass("/admin")}>
            Admin
          </Link>
          <Link to="/publier" className="btn primary-cta">
            + Post Ad
          </Link>
        </div>
      </div>
    </header>
  );
}