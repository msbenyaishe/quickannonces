/**
 * Hook to sync ads from PHP API to Redux on app load
 */

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAnnonces } from "../features/annonces/annoncesSlice";
import { fetchAds } from "../services/api/adsService";

export function useAdsSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadAds = async () => {
      try {
        const ads = await fetchAds();
        
        // Transform PHP API format to Redux format
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
        console.error("Error loading ads:", error);
        // Set empty array on error to prevent app crash
        dispatch(setAnnonces([]));
      }
    };

    loadAds();
  }, [dispatch]);
}
