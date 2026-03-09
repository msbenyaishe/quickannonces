import { useDispatch, useSelector } from "react-redux";
import { deleteUser, selectAllUsers } from "../../features/users/usersSlice";
import { selectAllAnnonces } from "../../features/annonces/annoncesSelectors";
import { deleteAnnoncesByUser } from "../../features/annonces/annoncesSlice";
import { deleteUser as deleteUserAPI } from "../../services/api/usersService";
import { deleteAd } from "../../services/api/adsService";

export default function AdminUsers({ refreshAds, refreshUsers }) {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const allAnnonces = useSelector(selectAllAnnonces);

  const handleDeleteUser = async (userId, userEmail) => {
    if (confirm(`Delete user "${userEmail}" and all their ads?`)) {
      try {
        const userAds = allAnnonces.filter(ad => ad.userId === userId);
        for (const ad of userAds) {
          try {
            await deleteAd(ad.id);
          } catch (error) {
            console.error("Error deleting user ad:", error);
          }
        }
        
        await deleteUserAPI(userId);
        
        dispatch(deleteAnnoncesByUser(userId));
        dispatch(deleteUser(userId));
        
        await refreshAds();
        await refreshUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: "700" }}>User Accounts</h2>
          <p className="text-muted" style={{ fontSize: "14px" }}>Platform access and permissions</p>
        </div>
        <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-light)" }}>{users.length} total users</div>
      </div>
      
      <div className="card" style={{ padding: 0, overflow: "hidden", borderRadius: "var(--radius-lg)" }}>
        {users.length === 0 ? (
          <div className="text-center" style={{ padding: "64px 24px" }}>
             <p className="text-muted" style={{ fontWeight: "500" }}>No users registered yet.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ background: "var(--bg-soft)", borderBottom: "1px solid var(--border-light)" }}>
                <th style={{ padding: "14px 20px", fontWeight: "600", color: "var(--text-muted)" }}>User</th>
                <th style={{ padding: "14px 20px", fontWeight: "600", color: "var(--text-muted)" }}>Role</th>
                <th style={{ padding: "14px 20px", fontWeight: "600", color: "var(--text-muted)", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <div className="flex items-center gap-2">
                       <div style={{ width: "28px", height: "28px", fontSize: "11px", background: "var(--bg-darker)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-light)" }}>U</div>
                       <span style={{ fontWeight: "600" }}>{user.email}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span className="badge" style={{
                      background: user.role === "admin" ? "var(--primary-soft)" : "var(--bg-darker)",
                      color: user.role === "admin" ? "var(--primary)" : "var(--text-muted)"
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", textAlign: "right" }}>
                    {user.role !== "admin" && (
                      <button
                        className="btn btn-ghost"
                        style={{ padding: "5px 10px", fontSize: "12px", color: "var(--danger)", border: "none" }}
                        onClick={() => handleDeleteUser(user.id, user.email)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
