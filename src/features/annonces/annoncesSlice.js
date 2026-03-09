import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  filters: {
    keyword: "",
    categorie: "",
    prixMin: "",
    prixMax: "",
    ville: "",
    typeAnnonce: "",
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
            photos: [],
            ...data,
          },
        };
      },
    },
    updateEtat(state, action) {
      const annonce = state.items.find((a) => a.id === action.payload.id);
      if (annonce) {
        annonce.etat = action.payload.etat;
      }
    },
    deleteAnnonce(state, action) {
      state.items = state.items.filter((a) => a.id !== action.payload);
    },
    updateAnnonce(state, action) {
      const index = state.items.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteAnnoncesByUser(state, action) {
      state.items = state.items.filter((a) => a.userId !== action.payload);
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },
    setAnnonces(state, action) {
      state.items = action.payload;
    },
  },
});

export const {
  addAnnonce,
  updateEtat,
  deleteAnnonce,
  updateAnnonce,
  deleteAnnoncesByUser,
  setFilters,
  resetFilters,
  setAnnonces,
} = annoncesSlice.actions;

export default annoncesSlice.reducer;

