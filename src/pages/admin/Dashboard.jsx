import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setAnnonces } from "../../features/annonces/annoncesSlice";
import { setUsers } from "../../features/users/usersSlice";
import { fetchAds } from "../../services/api/adsService";
import { fetchUsers } from "../../services/api/usersService";
import AdminStats from "../../components/admin/AdminStats";

export default function AdminDashboard() {
  const dispatch = useDispatch();

  const refreshAds = useCallback(async () => {
    try {
      const ads = await fetchAds({ status: 'all' });
      const reduxAds = ads.map((ad) => {
        const images = ad.photos || ad.images || [];
        return {
          id: ad.id.toString(),
          titre: ad.title,
          description: ad.description,
          typeAnnonce: ad.type_annonce,
          categorieId: ad.category,
          sousCategorieId: ad.subcategory,
          prix: parseFloat(ad.price),
          ville: ad.city,
          photos: Array.isArray(images) ? images : [],
          userId: ad.user_id.toString(),
          etat: ad.status === "pending" ? "en_attente" : ad.status === "accepted" ? "acceptee" : "refusee",
          datePoster: ad.created_at,
        };
      });
      dispatch(setAnnonces(reduxAds));
    } catch (error) {
      console.error("Error refreshing ads:", error);
    }
  }, [dispatch]);

  const refreshUsers = useCallback(async () => {
    try {
      const usersData = await fetchUsers();
      const reduxUsers = usersData.map((user) => ({
        id: user.id.toString(),
        email: user.email,
        role: user.role,
      }));
      dispatch(setUsers(reduxUsers));
    } catch (error) {
      console.error("Error refreshing users:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    refreshAds();
    refreshUsers();
  }, [refreshAds, refreshUsers]);

  return (
    <div>
      <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "32px", color: "var(--text)" }}>
        Dashboard Overview
      </h1>
      <AdminStats />
    </div>
  );
}
