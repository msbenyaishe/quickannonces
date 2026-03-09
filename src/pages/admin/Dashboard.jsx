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
        const rawImages = ad.photos || ad.images || ad.PHOTOS || ad.IMAGES || [];
        const photosArray = Array.isArray(rawImages) 
          ? rawImages 
          : (typeof rawImages === 'string' && rawImages.startsWith('[') 
              ? JSON.parse(rawImages) 
              : (rawImages ? [rawImages] : []));

        return {
          id: ad.id.toString(),
          titre: ad.title || ad.titre,
          description: ad.description,
          typeAnnonce: ad.type_annonce,
          categorieId: ad.category,
          sousCategorieId: ad.subcategory,
          prix: parseFloat(ad.price || ad.prix || 0),
          ville: ad.city || ad.ville,
          photos: photosArray.filter(p => typeof p === 'string' && p.length > 0),
          userId: (ad.user_id || ad.userId || "").toString(),
          etat: ad.status === "accepted" || ad.etat === "acceptee" ? "acceptee" : 
                ad.status === "refused" || ad.etat === "refusee" ? "refusee" : "en_attente",
          datePoster: ad.created_at || ad.datePoster,
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
