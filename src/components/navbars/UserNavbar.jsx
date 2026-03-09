import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthUser } from "../../features/auth/authSlice";
import { logout } from "../../services/api/authService";

export default function UserNavbar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

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
        <Link to="/" className="brand">
          <div className="brand-logo">QA</div>
          <span className="brand-name">Quick<span>Annonce</span></span>
        </Link>

        <nav className="nav desktop-nav">
          <Link to="/" className={getLinkClass("/")}>Marketplace</Link>
          <Link to="/recherche" className={getLinkClass("/recherche")}>Search</Link>
          <Link to="/publier" className={getLinkClass("/publier")}>Post Ad</Link>
        </nav>

        <div className="header-actions flex items-center" style={{ gap: "20px" }}>
          <span className="text-muted" style={{ fontSize: "14px", fontWeight: "600" }}>{user?.email}</span>
          <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: "13px" }}>Sign Out</button>
        </div>
      </div>
    </header>
  );
}
