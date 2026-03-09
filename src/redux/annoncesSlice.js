import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  filters: {
    keyword: "",
    categorie: "",
    prixMin: "",
    prixMax: "",
  },
};

const annoncesSlice = createSlice({
  name: "annonces",
  initialState,
  reducers: {
    addAnnonce: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare(data) {
        return {
          payload: {
            id: nanoid(),
            datePoster: new Date().toISOString(),
            etat: "en_attente",
            ...data,
          },
        };
      },
    },

    updateEtat(state, action) {
      const annonce = state.items.find(a => a.id === action.payload.id);
      if (annonce) annonce.etat = action.payload.etat;
    },

    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const { addAnnonce, updateEtat, setFilters } = annoncesSlice.actions;
export default annoncesSlice.reducer;