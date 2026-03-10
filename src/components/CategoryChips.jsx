import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../features/annonces/annoncesSlice";

const categories = [
  { id: 1, label: "Vehicles", name: "vehicles" },
  { id: 2, label: "Real Estate", name: "real_estate" },
  { id: 3, label: "Electronics", name: "electronics" },
  { id: 4, label: "Housing", name: "housing" },
  { id: 5, label: "Jobs", name: "jobs" },
];

export default function CategoryChips() {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state) => state.annonces.filters.categorie);

  const handleCategoryClick = (categoryName) => {
    if (selectedCategory === categoryName) {
      dispatch(setFilters({ categorie: "" }));
    } else {
      dispatch(setFilters({ categorie: categoryName }));
    }
  };

  return (
    <div className="chips">
      {categories.map((cat) => (
        <span
          key={cat.id}
          className={`chip ${selectedCategory === cat.name ? "active" : ""}`}
          onClick={() => handleCategoryClick(cat.name)}
        >
          {cat.label}
        </span>
      ))}
    </div>
  );
}