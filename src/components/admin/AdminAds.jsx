import { useDispatch, useSelector } from "react-redux";
import { updateEtat, deleteAnnonce, updateAnnonce } from "../../features/annonces/annoncesSlice";
import { selectAllAnnonces } from "../../features/annonces/annoncesSelectors";
import { updateAdStatus, deleteAd, updateAd } from "../../services/api/adsService";
import { useState } from "react";
import EditAdModal from "./EditAdModal";

export default function AdminAds({ refreshAds }) {
  const dispatch = useDispatch();
  const allAnnonces = useSelector(selectAllAnnonces);
  
  const [filter, setFilter] = useState("all");
  const [editingAd, setEditingAd] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredAds = allAnnonces.filter(ad => {
    if (filter === "all") return true;
    if (filter === "pending") return ad.etat === "en_attente";
    if (filter === "accepted") return ad.etat === "acceptee";
    if (filter === "refused") return ad.etat === "refusee";
    return true;
  });

  const handleAction = async (id, action, status) => {
    try {
       await updateAdStatus(id, status);
       dispatch(updateEtat({ id, etat: status === 'accepted' ? 'acceptee' : 'refusee' }));
       await refreshAds();
    } catch (error) {
       console.error(`Error ${action} ad:`, error);
       alert(`Failed to ${action} ad.`);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to permanently delete this announcement? This action cannot be undone.")) {
      try {
        await deleteAd(id);
        dispatch(deleteAnnonce(id));
        await refreshAds();
      } catch (error) {
        alert("Failed to delete ad.");
      }
    }
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async (id, updatedData) => {
    try {
      await updateAd(id, updatedData);
      dispatch(updateAnnonce({ 
        id, 
        titre: updatedData.title,
        description: updatedData.description,
        prix: parseFloat(updatedData.price),
        ville: updatedData.city,
        etat: updatedData.status === "pending" ? "en_attente" : updatedData.status === "accepted" ? "acceptee" : "refusee"
      }));
      await refreshAds();
    } catch (error) {
      alert("Failed to update ad.");
      throw error;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: "24px" }}>
        <div>
           <h2 style={{ fontSize: "24px", fontWeight: "700" }}>Ads Management</h2>
           <p className="text-muted" style={{ fontSize: "14px" }}>Manage and moderate all marketplace content</p>
        </div>
        
        <div className="flex" style={{ background: "var(--bg-darker)", padding: "3px", borderRadius: "var(--radius-md)", gap: "2px" }}>
           {["all", "pending", "accepted", "refused"].map(f => (
             <button 
                key={f}
                onClick={() => setFilter(f)}
                className="btn"
                style={{ 
                  padding: "6px 14px", 
                  fontSize: "13px", 
                  borderRadius: "var(--radius-sm)",
                  background: filter === f ? "#fff" : "transparent",
                  boxShadow: filter === f ? "var(--shadow-sm)" : "none",
                  color: filter === f ? "var(--primary)" : "var(--text-muted)",
                  border: "none",
                  minWidth: "80px"
                }}
             >
               {f.charAt(0).toUpperCase() + f.slice(1)}
             </button>
           ))}
        </div>
      </div>
      
      <div className="card" style={{ padding: "0", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <div className="table-responsive">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ background: "var(--bg-soft)", textAlign: "left", borderBottom: "1px solid var(--border-light)" }}>
                <th style={{ padding: "14px 20px", fontWeight: "600" }}>Item</th>
                <th style={{ padding: "14px 20px", fontWeight: "600" }}>Location</th>
                <th style={{ padding: "14px 20px", fontWeight: "600" }}>Price</th>
                <th style={{ padding: "14px 20px", fontWeight: "600" }}>Date</th>
                <th style={{ padding: "14px 20px", fontWeight: "600" }}>Status</th>
                <th style={{ padding: "14px 20px", fontWeight: "600", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAds.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center" style={{ padding: "64px" }}>
                     <p className="text-muted" style={{ fontWeight: "500" }}>No {filter} ads to display.</p>
                  </td>
                </tr>
              ) : (
                filteredAds.map((ad) => (
                  <tr key={ad.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "14px 20px" }}>
                      <div className="flex items-center gap-2">
                        <div style={{ width: "40px", height: "40px", borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--bg-darker)" }}>
                          {ad.photos?.[0] ? (
                            <img src={ad.photos[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div className="flex items-center justify-center w-full" style={{ height: "100%", fontSize: "10px", color: "var(--text-light)" }}>
                              NO
                            </div>
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: "600" }}>{ad.titre}</div>
                          <div style={{ fontSize: "11px", color: "var(--text-light)" }}>#{ad.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", color: "var(--text-muted)" }}>{ad.ville}</td>
                    <td className="text-primary" style={{ padding: "14px 20px", fontWeight: "600" }}>{ad.prix?.toLocaleString()} MAD</td>
                    <td style={{ padding: "14px 20px", color: "var(--text-muted)" }}>{new Date(ad.datePoster).toLocaleDateString()}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span className={`badge badge-${ad.etat === 'en_attente' ? 'pending' : ad.etat === 'acceptee' ? 'accepted' : 'refused'}`}>
                        {ad.etat === 'en_attente' ? 'Pending' : ad.etat.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "right" }}>
                      <div className="flex gap-2" style={{ justifyContent: "flex-end" }}>
                        <button onClick={() => handleEdit(ad)} className="btn btn-ghost" style={{ padding: "5px 10px", fontSize: "12px", color: "var(--primary)" }}>Edit</button>
                        {ad.etat !== 'acceptee' && (
                          <button onClick={() => handleAction(ad.id, 'accepting', 'accepted')} className="btn" style={{ background: "rgba(5, 150, 105, 0.1)", color: "var(--success)", padding: "5px 10px", fontSize: "12px", border: "none" }}>Accept</button>
                        )}
                        {ad.etat !== 'refusee' && (
                          <button onClick={() => handleAction(ad.id, 'refusing', 'refused')} className="btn" style={{ background: "rgba(220, 38, 38, 0.1)", color: "var(--danger)", padding: "5px 10px", fontSize: "12px", border: "none" }}>Reject</button>
                        )}
                        <button onClick={() => handleDelete(ad.id)} className="btn btn-ghost" style={{ padding: "5px 10px", fontSize: "12px", color: "var(--danger)" }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EditAdModal 
        ad={editingAd} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveEdit}
      />
    </div>
  );
}
