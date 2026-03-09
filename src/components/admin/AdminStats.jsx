import { useSelector } from "react-redux";
import { selectAnnoncesStats } from "../../features/annonces/annoncesSelectors";
import { selectUsersStats } from "../../features/users/usersSlice";

export default function AdminStats() {
  const annoncesStats = useSelector(selectAnnoncesStats);
  const usersStats = useSelector(selectUsersStats);

  const stats = [
    { label: "Total users", value: usersStats.total, color: "var(--text)", bg: "var(--card)", border: "var(--border)" },
    { label: "Total ads", value: annoncesStats.total, color: "var(--text)", bg: "var(--card)", border: "var(--border)" },
    { label: "Pending Ads", value: annoncesStats.pending, color: "#92400e", bg: "#fef3c7", border: "#fde68a" },
    { label: "Accepted Ads", value: annoncesStats.accepted, color: "#065f46", bg: "#d1fae5", border: "#a7f3d0" },
    { label: "Refused Ads", value: annoncesStats.refused, color: "#991b1b", bg: "#fee2e2", border: "#fecaca" },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      marginBottom: "40px"
    }}>
      {stats.map((stat, index) => (
        <div key={index} style={{
          background: stat.bg,
          padding: "24px",
          borderRadius: "14px",
          border: `1px solid ${stat.border}`,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
        }}>
          <div style={{ fontSize: "13px", color: stat.color === "var(--text)" ? "var(--text-muted)" : stat.color, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {stat.label}
          </div>
          <div style={{ fontSize: "32px", fontWeight: "700", color: stat.color }}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}
