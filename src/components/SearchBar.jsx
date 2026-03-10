import { useDispatch, useSelector } from "react-redux";
import { setFilters, resetFilters } from "../features/annonces/annoncesSlice";
import { useState } from "react";

export default function SearchBar() {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.annonces.filters);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: "real_estate", nom: "Real Estate" },
    { id: "vehicles", nom: "Vehicles" },
    { id: "electronics", nom: "Electronics" },
    { id: "housing", nom: "Housing" },
    { id: "jobs", nom: "Jobs" },
  ];

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  const handleSearch = () => {
    setShowFilters(false);
  };

  return (
    <div className="search-section w-full" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div
        className="card flex items-center"
        style={{
          padding: "6px",
          borderRadius: "var(--radius-full)",
          background: "#fff",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center w-full" style={{ flex: 1, paddingInline: "16px" }}>
          <input
            id="search-keyword"
            name="keyword"
            type="text"
            className="input"
            style={{
              border: "none",
              height: "42px",
              paddingLeft: "0",
              background: "transparent",
              boxShadow: "none",
            }}
            placeholder="Search by title or keyword..."
            value={filters.keyword || ""}
            onChange={(e) => handleFilterChange("keyword", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <div className="flex items-center gap-2" style={{ paddingRight: "6px" }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-ghost"
            style={{
              height: "40px",
              border: "none",
              background: "var(--bg-soft)",
              borderRadius: "var(--radius-full)",
              padding: "0 18px",
              fontSize: "13px",
            }}
          >
            {showFilters ? "Hide" : "Filters"}
          </button>

          <button
            onClick={handleSearch}
            className="btn btn-primary"
            style={{
              height: "40px",
              borderRadius: "var(--radius-full)",
              padding: "0 24px",
              fontSize: "13px",
            }}
          >
            Search
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="card mt-4" style={{ padding: "24px", borderRadius: "var(--radius-lg)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "16px",
            }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label" htmlFor="filter-category">
                Category
              </label>
              <select
                id="filter-category"
                name="categorie"
                className="select"
                value={filters.categorie || ""}
                onChange={(e) => handleFilterChange("categorie", e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label" htmlFor="filter-city">
                City
              </label>
              <input
                id="filter-city"
                name="ville"
                type="text"
                className="input"
                placeholder="Ex: Casablanca"
                value={filters.ville || ""}
                onChange={(e) => handleFilterChange("ville", e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label" htmlFor="filter-type">
                Type
              </label>
              <select
                id="filter-type"
                name="typeAnnonce"
                className="select"
                value={filters.typeAnnonce || ""}
                onChange={(e) => handleFilterChange("typeAnnonce", e.target.value)}
              >
                <option value="">Any Type</option>
                <option value="vente">For Sale</option>
                <option value="location">For Rent</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label" htmlFor="filter-max-price">
                Max Price
              </label>
              <input
                id="filter-max-price"
                name="prixMax"
                type="number"
                className="input"
                placeholder="MAD"
                value={filters.prixMax || ""}
                onChange={(e) =>
                  handleFilterChange("prixMax", Number(e.target.value))
                }
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end items-center gap-2">
            <button
              onClick={handleReset}
              className="btn btn-ghost"
              style={{ padding: "8px 20px" }}
            >
              Reset
            </button>

            <button
              onClick={handleSearch}
              className="btn btn-primary"
              style={{ padding: "8px 20px" }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}