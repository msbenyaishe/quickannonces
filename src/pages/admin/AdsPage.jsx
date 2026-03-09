import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setAnnonces } from "../../features/annonces/annoncesSlice";
import { fetchAds } from "../../services/api/adsService";
import AdminAds from "../../components/admin/AdminAds";

export default function AdsPage() {
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

  useEffect(() => {
    refreshAds();
  }, [refreshAds]);

  return <AdminAds refreshAds={refreshAds} />;
}
