import { createSelector } from "@reduxjs/toolkit";

export const selectAllAnnonces = (state) => state.annonces.items;

export const selectAnnonceById = (state, id) =>
  state.annonces.items.find((a) => a.id === id);

// Memoized selector to prevent unnecessary re-renders
export const selectFilteredAnnonces = createSelector(
  [
    (state) => state.annonces.items, 
    (state) => state.annonces.filters,
    (state) => state.auth.user
  ],
  (items, filters, currentUser) => {
    return items.filter((a) => {
      // Visibility logic:
      // 1. If it's accepted, everyone sees it.
      // 2. If it's own ad, owner sees it (even if pending/refused).
      // 3. If admin, see all (handled by API fetching status:all, but selector should also allow it).
      const isOwner = currentUser && a.userId === currentUser.id.toString();
      const isAdmin = currentUser && currentUser.role === 'admin';
      
      if (a.etat !== "acceptee" && !isOwner && !isAdmin) return false;

      // Keyword search (title + description)
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        const titleMatch = a.titre?.toLowerCase().includes(keyword);
        const descMatch = a.description?.toLowerCase().includes(keyword);
        if (!titleMatch && !descMatch) return false;
      }

      // Category filter
      if (filters.categorie && a.categorieId !== filters.categorie) return false;

      // Price range
      if (filters.prixMin && a.prix < Number(filters.prixMin)) return false;
      if (filters.prixMax && a.prix > Number(filters.prixMax)) return false;

      // City filter (case-insensitive partial match)
      if (filters.ville) {
        const cityFilter = filters.ville.toLowerCase();
        const adCity = a.ville?.toLowerCase() || "";
        if (!adCity.includes(cityFilter)) return false;
      }

      // Type filter
      if (filters.typeAnnonce && a.typeAnnonce !== filters.typeAnnonce)
        return false;

      return true;
    });
  }
);

// Memoized selectors for better performance
export const selectPendingAnnonces = createSelector(
  [selectAllAnnonces],
  (items) => items.filter((a) => a.etat === "en_attente")
);

export const selectAcceptedAnnonces = createSelector(
  [selectAllAnnonces],
  (items) => items.filter((a) => a.etat === "acceptee")
);

export const selectRefusedAnnonces = createSelector(
  [selectAllAnnonces],
  (items) => items.filter((a) => a.etat === "refusee")
);

export const selectAnnoncesStats = createSelector(
  [selectAllAnnonces],
  (items) => ({
    total: items.length,
    pending: items.filter((a) => a.etat === "en_attente").length,
    accepted: items.filter((a) => a.etat === "acceptee").length,
    refused: items.filter((a) => a.etat === "refusee").length,
  })
);

