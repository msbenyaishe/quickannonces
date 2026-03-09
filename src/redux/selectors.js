export const selectFilteredAnnonces = state => {
  const { items, filters } = state.annonces;

  return items.filter(a => {
    if (filters.keyword &&
        !a.titre.toLowerCase().includes(filters.keyword.toLowerCase()))
      return false;

    if (filters.prixMin && a.prix < filters.prixMin) return false;
    if (filters.prixMax && a.prix > filters.prixMax) return false;

    return a.etat === "acceptee";
  });
};