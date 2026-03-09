import { Link } from "react-router-dom";

export default function AdminNavbar() {
  return (
    <nav style={{ padding: "10px", background: "#111", color: "#fff" }}>
      <Link to="/admin" style={{ marginRight: 10 }}>Dashboard</Link>
      <Link to="/admin/home" style={{ marginRight: 10 }}>Home</Link>
      <Link to="/admin/publier">Publier</Link>
    </nav>
  );
}
