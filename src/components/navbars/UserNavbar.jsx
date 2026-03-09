import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { clearAuthUser } from "../../features/auth/authSlice";
import { logout } from "../../services/api/authService";

export default function UserNavbar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const getLinkClass = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    dispatch(clearAuthUser());
    setIsOpen(false);
    navigate("/");
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
          <Link to="/recherche" className={getLinkClass("/recherche")}>Search</Link>
          <Link to="/publier" className={getLinkClass("/publier")}>Post Ad</Link>
        </nav>

        <div className="header-actions flex items-center" style={{ gap: "20px" }}>
          <span className="text-muted hide-on-mobile" style={{ fontSize: "14px", fontWeight: "600" }}>{user?.email}</span>
          <button onClick={handleLogout} className="btn btn-ghost hide-on-mobile" style={{ padding: "8px 16px", fontSize: "13px" }}>Sign Out</button>
          
          <button 
             className="mobile-menu-toggle" 
             onClick={() => setIsOpen(!isOpen)}
             aria-label="Toggle menu"
           >
             {isOpen ? "✕" : "☰"}
           </button>
        </div>

        {/* Mobile Nav */}
        <nav className={`mobile-nav ${isOpen ? "open" : ""}`}>
          <div style={{ padding: "0 16px 16px", borderBottom: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "13px", color: "var(--text-light)" }}>Logged in as</div>
            <div style={{ fontWeight: "600", color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email}</div>
          </div>
          <Link to="/" className={getLinkClass("/")}>Marketplace</Link>
          <Link to="/recherche" className={getLinkClass("/recherche")}>Search</Link>
          <Link to="/publier" className={getLinkClass("/publier")}>Post Ad</Link>
          <button 
            onClick={handleLogout} 
            className="btn btn-ghost" 
            style={{ marginTop: "auto", borderColor: "var(--danger)", color: "var(--danger)" }}
          >
            Sign Out
          </button>
        </nav>
      </div>
    </header>
  );
}
