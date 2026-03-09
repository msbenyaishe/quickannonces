import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname === path 
      ? "admin-nav-link active" 
      : "admin-nav-link";
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <div className="brand-logo">QA</div>
        <span className="brand-name">Admin</span>
      </div>

      <nav className="admin-nav">
        <Link to="/admin" className={getLinkClass("/admin")}>
          📊 Dashboard
        </Link>
        <Link to="/admin/ads" className={getLinkClass("/admin/ads")}>
          📝 Ads Management
        </Link>
        <Link to="/admin/users" className={getLinkClass("/admin/users")}>
          👥 Users Management
        </Link>
        <Link to="/" className="admin-nav-link" style={{ marginTop: "auto" }}>
          ⬅️ Back to Site
        </Link>
      </nav>
    </aside>
  );
}
