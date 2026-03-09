import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { clearAuthUser } from "../../features/auth/authSlice";
import { logout } from "../../services/api/authService";

export default function AdminNavbar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    <header className="header" style={{ borderBottom: "2px solid var(--primary-soft)" }}>
      <div className="container header-inner">
        <Link to="/admin" className="brand">
          <div className="brand-logo" style={{ width: "32px", height: "32px", fontSize: "12px" }}>QA</div>
          <span className="brand-name">Admin<span>Panel</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="nav desktop-nav">
          <Link to="/admin" className={getLinkClass("/admin")}>Overview</Link>
          <Link to="/admin/ads" className={getLinkClass("/admin/ads")}>Ads Queue</Link>
          <Link to="/admin/users" className={getLinkClass("/admin/users")}>Users</Link>
          <Link to="/" className="nav-link" style={{ fontSize: "12px", opacity: 0.8 }}>View Site</Link>
        </nav>

        <div className="header-actions">
          <button 
            onClick={handleLogout} 
            className="btn btn-ghost hide-on-mobile" 
            style={{ 
              padding: "6px 14px", 
              fontSize: "12px",
              color: "var(--danger)", 
              borderColor: "rgba(220, 38, 38, 0.1)" 
            }}
          >
            Sign Out
          </button>
          
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
          <div style={{ padding: "0 16px 16px", borderBottom: "1px solid var(--border-light)", color: "var(--primary)", fontWeight: "700" }}>
            ADMINISTRATION
          </div>
          <Link to="/admin" className={getLinkClass("/admin")}>Overview</Link>
          <Link to="/admin/ads" className={getLinkClass("/admin/ads")}>Ads Queue</Link>
          <Link to="/admin/users" className={getLinkClass("/admin/users")}>Users Control</Link>
          <Link to="/" className="nav-link">Main Website</Link>
          <button 
            onClick={handleLogout} 
            className="btn btn-ghost" 
            style={{ marginTop: "auto", borderColor: "var(--danger)", color: "var(--danger)" }}
          >
            Exit Admin Session
          </button>
        </nav>
      </div>
    </header>
  );
}
