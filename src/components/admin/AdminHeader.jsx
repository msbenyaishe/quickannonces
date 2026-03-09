import { useSelector } from "react-redux";
import { selectAuthUser } from "../../features/auth/authSlice";

export default function AdminHeader({ toggleSidebar }) {
  const user = useSelector(selectAuthUser);

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-inner">
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
           <button 
             onClick={toggleSidebar} 
             className="show-on-mobile mobile-menu-toggle"
             style={{ padding: "4px", margin: "0" }}
           >
             ☰
           </button>
           <h2 className="hide-on-mobile" style={{ fontSize: "20px", fontWeight: "600", margin: 0 }}>
             Admin Portal
           </h2>
           <h2 className="show-on-mobile" style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>
             Portal
           </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "14px", color: "var(--muted)" }}>
            Welcome, <strong>{user?.email || "Admin"}</strong>
          </span>
          <div style={{ 
            width: "36px", 
            height: "36px", 
            borderRadius: "50%", 
            background: "var(--primary)", 
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold"
          }}>
            {user?.email?.[0]?.toUpperCase() || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}
