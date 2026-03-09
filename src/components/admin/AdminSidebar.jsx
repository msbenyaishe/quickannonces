import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname === path 
      ? "admin-nav-link active" 
      : "admin-nav-link";
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
      <div className="admin-brand">
        <div className="brand-logo" style={{ width: "30px", height: "30px", fontSize: "12px" }}>QA</div>
        <span className="brand-name">Admin</span>
        <button 
          onClick={toggleSidebar} 
          className="show-on-mobile" 
          style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "var(--text-muted)" }}
        >
          ✕
        </button>
      </div>

      <nav className="admin-nav">
        <Link to="/admin" className={getLinkClass("/admin")} onClick={toggleSidebar}>
          📊 Dashboard
        </Link>
        <Link to="/admin/ads" className={getLinkClass("/admin/ads")} onClick={toggleSidebar}>
          📝 Ads Management
        </Link>
        <Link to="/admin/users" className={getLinkClass("/admin/users")} onClick={toggleSidebar}>
          👥 Users Management
        </Link>
        <Link to="/" className="admin-nav-link" style={{ marginTop: "auto" }}>
          ⬅️ Back to Site
        </Link>
      </nav>
    </aside>
  );
}
