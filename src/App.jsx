import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    let cancelled = false;

    //
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const productsResponse = await axios.get(
          "https://dummyjson.com/products"
        );
        const categoriesResponse = await axios.get(
          "https://dummyjson.com/products/categories"
        );
        if (!cancelled) {
          setProducts(productsResponse.data.products || []);
          setCategories(categoriesResponse.data || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = products.filter((p) => {
    const matches = p.title.toLowerCase().includes(search.trim().toLowerCase());
    const filterCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    return matches && filterCategory;
  });

  return (
    <>
      <div>
        <h1>Products</h1>
        <div>
          <input
            type="text"
            placeholder="search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All</option>
            {categories.map((c) => {
              const value = typeof c === "string" ? c : c.slug;
              const label = typeof c === "string" ? c : c.name;
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>
        {loading && <p>Loading products...</p>}
        {error && !loading && <p style={{ color: "red" }}>Error:{error}</p>}
        {!loading && !error && filteredProducts.length === 0 && (
          <p>No products match</p>
        )}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="cls-card-container">
            {filteredProducts.map((product) => (
              <div key={product.id} className="cls-card">
                <img src={product.thumbnail} alt={product.title} />
                <h3>{product.title}</h3>
                <p>{product.price}</p>
                <p>{product.category}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
