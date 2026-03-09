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
          // Robust image extraction
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
        console.error("Error loading ads:", error);
        // Set empty array on error to prevent app crash
        dispatch(setAnnonces([]));
      }
    };

    loadAds();
  }, [dispatch]);
}
