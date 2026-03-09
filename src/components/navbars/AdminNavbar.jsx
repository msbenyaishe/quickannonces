import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearAuthUser } from "../../features/auth/authSlice";
import { logout } from "../../services/api/authService";

export default function AdminNavbar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    navigate("/");
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/admin" className="brand">
          <div className="brand-logo" style={{ width: "30px", height: "30px", fontSize: "12px" }}>QA</div>
          <span className="brand-name">Admin<span>Panel</span></span>
        </Link>

        <nav className="nav desktop-nav">
          <Link to="/admin" className={getLinkClass("/admin")}>Overview</Link>
          <Link to="/admin/ads" className={getLinkClass("/admin/ads")}>Ads Queue</Link>
          <Link to="/admin/users" className={getLinkClass("/admin/users")}>Users</Link>
        </nav>

        <div className="header-actions">
          <button onClick={handleLogout} className="btn btn-ghost" style={{ 
            padding: "6px 14px", 
            fontSize: "12px",
            color: "var(--danger)", 
            borderColor: "rgba(220, 38, 38, 0.1)" 
          }}>Sign Out</button>
        </div>
      </div>
    </header>
  );
}
